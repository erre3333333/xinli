import { Router } from 'express'

const router = Router()
const AGNES_API_KEY = process.env.AGNES_API_KEY

function dimensionBlock(dimensionScores) {
  if (!dimensionScores || !dimensionScores.length) return ''
  return `
各项维度得分：
${dimensionScores.map(d => `- ${d.name}：${d.score}/${d.max}${d.desc ? `（${d.desc}）` : ''}`).join('\n')}
`
}

function buildPrompt(testName, testSubtitle, patientType, totalScore, maxScore, severity, severityLabel, conditionLabel, dimensionScores) {
  const dimText = dimensionBlock(dimensionScores)
  return {
    system: `你是一位资深心理测评分析师。请根据测评结果给出详细的分析报告，**使用表格和结构化格式**呈现。

测评工具：${testName}${testSubtitle ? `（${testSubtitle}）` : ''}

结果：
- 总分：${totalScore}/${maxScore}
- 严重程度：${severityLabel}
- 临床评估：${conditionLabel}
${dimText}
请包含以下表格和章节（用markdown格式）：
1. # 结果概要 — 用一两段话总结，提及总分和严重程度
2. # 各项维度分析 — **用表格呈现**，列：维度、得分、百分比、说明
3. # 核心问题识别 — 指出得分最高的维度及其临床意义
4. # 临床意义 — 分点说明
5. # 个性化建议 — 根据维度得分高低给出针对性建议

务必用 markdown 表格来展示维度数据。`,
    user: `请深入分析这份${testName}测评结果，特别关注各维度的得分差异。`
  }
}

router.post('/assess', async (req, res) => {
  const {
    testName, testSubtitle, patientType, totalScore,
    maxScore, severity, severityLabel, conditionLabel, answers, model, dimensionScores,
  } = req.body

  if (!testName || !patientType) {
    return res.status(400).json({ error: '缺少必要参数' })
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')

  const { system, user } = buildPrompt(testName, testSubtitle, patientType, totalScore, maxScore, severity, severityLabel, conditionLabel, dimensionScores)

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 120000)

    const aiRes = await fetch('https://apihub.agnes-ai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AGNES_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || 'agnes-2.0-flash',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
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
            } catch { /* skip malformed chunk */ }
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
