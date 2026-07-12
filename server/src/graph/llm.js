import { compress } from 'headroom-ai'

const AGNES_API_KEY = process.env.AGNES_API_KEY
const BASE_URL = 'https://apihub.agnes-ai.com/v1/chat/completions'

const FALLBACK_MODELS = [
  'agnes-2.0-flash',
  'agnes-1.5-flash',
]

let headroomOk = true
let headroomStats = null

// 粗略计算 token 数
function approxTokens(text) {
  return Math.ceil((text || '').length / 2)
}

function totalTokens(msgs) {
  return msgs.reduce((s, m) => s + approxTokens(m.content) + 4, 0)
}

const MAX_TOKENS = 4096 // 超过此值触发压缩

async function tryHeadroom(messages, model) {
  if (!headroomOk) return null
  try {
    const r = await compress(messages, { model, timeout: 3000 })
    if (r.compressed && r.messages?.length) {
      headroomStats = { tokensBefore: r.tokensBefore, tokensAfter: r.tokensAfter, tokensSaved: r.tokensSaved, ratio: r.compressionRatio }
      console.log(`[Headroom] ${r.tokensBefore}→${r.tokensAfter} tokens (压缩率 ${(r.compressionRatio * 100).toFixed(1)}%)`)
      return r.messages
    }
  } catch (e) {
    headroomOk = false
    console.warn('[Headroom] 连接失败，已切换至本地截断:', e.message)
  }
  return null
}

// 本地截断：保留 system + 最近 N 轮对话
function truncate(messages) {
  const sysIdx = messages.findIndex(m => m.role === 'system')
  const system = sysIdx >= 0 ? [messages[sysIdx]] : []
  const rest = sysIdx >= 0 ? messages.slice(sysIdx + 1) : messages
  if (totalTokens(rest) <= MAX_TOKENS) return messages
  // 保留最后 6 条消息（约 3 轮对话）
  const kept = rest.slice(-6)
  const dropped = rest.length - kept.length
  if (dropped <= 0) return messages
  kept.unshift({ role: 'system', content: `【以下为已压缩的历史摘要】之前对话共 ${dropped} 条消息已省略，直接回应最新问题。` })
  return [...system, ...kept]
}

async function fetchOnce(messages, model, onToken) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 120000)

  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AGNES_API_KEY}`,
      },
      body: JSON.stringify({ model, messages, stream: !!onToken }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      const err = await res.text()
      const isRateLimit = res.status === 429 || res.status === 503
      throw Object.assign(new Error(`API ${res.status}: ${err}`), { status: res.status, isRateLimit })
    }

    if (onToken) {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let full = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              const c = parsed.choices?.[0]?.delta?.content || ''
              if (c) { full += c; onToken(c) }
            } catch { }
          }
        }
      }
      return full
    }

    const json = await res.json()
    return json.choices?.[0]?.message?.content || ''
  } catch (e) {
    clearTimeout(timeout)
    throw e
  }
}

export { headroomOk, headroomStats }

export async function callLLM({ messages, model, onToken }) {
  // 优先 headroom proxy，失败则本地截断
  const compressed = await tryHeadroom(messages, model)
  if (compressed) messages = compressed
  else messages = truncate(messages)

  // 模型后备链：请求的 model → FALLBACK_MODELS，限流时指数退避
  const chain = [model, ...FALLBACK_MODELS.filter(m => m !== model)]
  let lastErr

  for (let i = 0; i < chain.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, 1000 * i * 3 + Math.random() * 2000))
    try {
      return await fetchOnce(messages, chain[i], onToken)
    } catch (e) {
      lastErr = e
      if (i < chain.length - 1 && e.status >= 400) continue
      throw e
    }
  }

  throw lastErr
}
