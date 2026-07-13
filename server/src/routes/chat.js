import { Router } from 'express'

const router = Router()
const AGNES_API_KEY = process.env.AGNES_API_KEY

router.post('/chat', async (req, res) => {
  const { message, patientType, history, model, images } = req.body

  if (!patientType || (!message && (!images || !images.length))) {
    return res.status(400).json({ error: '缺少必要参数' })
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')

  const systemContent = `你是一位专业的心理咨询师，擅长${patientType}相关问题的咨询。请以温和、专业的态度回应用户，提供有同理心的建议和支持。回答应具有心理学专业深度，同时保持易于理解。`

  const messages = [{ role: 'system', content: systemContent }]

  if (history && Array.isArray(history)) {
    for (const msg of history) {
      if (msg.role && msg.content) {
        messages.push({ role: msg.role, content: msg.content })
      }
    }
  }

  const userContent = message || ''
  messages.push({ role: 'user', content: userContent })

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 60000)

    const aiRes = await fetch('https://apihub.agnes-ai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AGNES_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || 'agnes-2.0-flash',
        messages,
        stream: true,
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!aiRes.ok) {
      const err = await aiRes.text()
      res.status(502)
      res.write(err)
      res.end()
      return
    }

    const reader = aiRes.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
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
              const content = parsed.choices?.[0]?.delta?.content || ''
              if (content) res.write(content)
            } catch { /* skip */ }
          }
        }
      }

      if (buffer.startsWith('data: ')) {
        const data = buffer.slice(6).trim()
        if (data !== '[DONE]') {
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content || ''
            if (content) res.write(content)
          } catch { /* skip */ }
        }
      }
    } catch (streamErr) {
      if (!res.writableEnded) {
        res.write(`\n\n[连接中断: ${streamErr.message}]`)
      }
    }
    if (!res.writableEnded) res.end()
  } catch (e) {
    if (!res.writableEnded) {
      res.write(`连接 AI 服务失败: ${e.message}`)
      res.end()
    }
  }
})

router.post('/medication', async (req, res) => {
  const { testName, testSubtitle, patientType, totalScore, maxScore, severity, severityLabel, conditionLabel, answers, model, dimensionScores } = req.body

  if (!testName || !patientType) {
    return res.status(400).json({ error: '缺少必要参数' })
  }

  const dimText = dimensionScores?.length
    ? `\n\n各维度得分：\n${dimensionScores.map(d => `- ${d.name}：${d.score}/${d.max}`).join('\n')}\n`
    : ''

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')

  const systemContent = `你是一位临床精神药理学专家。请根据以下测评结果为用户提供用药方面的科普建议，**优先使用表格**展示药物信息。

测评工具：${testName}${testSubtitle ? `（${testSubtitle}）` : ''}

结果：
- 总分：${totalScore}/${maxScore}
- 严重程度：${severityLabel}
- 临床评估：${conditionLabel}${dimText}
请包含以下内容（用markdown格式）：
1. # 用药概述 — 简要说明
2. # 常见药物类别 — **用表格呈现**，列：药物类别、作用机制、常见药物、注意事项
3. # 副作用与风险 — 用表格呈现，列：药物、常见副作用、注意事项
4. # 综合建议 — 分点说明（强调务必就医，遵医嘱用药）

务必用 markdown 表格来展示药物数据。`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 60000)

    const aiRes = await fetch('https://apihub.agnes-ai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AGNES_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || 'agnes-2.0-flash',
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: '请给出用药建议。' },
        ],
        stream: true,
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!aiRes.ok) {
      const err = await aiRes.text()
      res.status(502)
      res.write(err)
      res.end()
      return
    }

    const reader = aiRes.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
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
              const content = parsed.choices?.[0]?.delta?.content || ''
              if (content) res.write(content)
            } catch { /* skip */ }
          }
        }
      }

      if (buffer.startsWith('data: ')) {
        const data = buffer.slice(6).trim()
        if (data !== '[DONE]') {
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content || ''
            if (content) res.write(content)
          } catch { /* skip */ }
        }
      }
    } catch (streamErr) {
      if (!res.writableEnded) {
        res.write(`\n\n[连接中断: ${streamErr.message}]`)
      }
    }
    if (!res.writableEnded) res.end()
  } catch (e) {
    if (!res.writableEnded) {
      res.write(`连接 AI 服务失败: ${e.message}`)
      res.end()
    }
  }
})

export default router
