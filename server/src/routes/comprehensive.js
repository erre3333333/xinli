import { Router } from 'express'

const router = Router()
const AGNES_API_KEY = process.env.AGNES_API_KEY

router.post('/comprehensive', async (req, res) => {
  const { results } = req.body

  if (!results || !results.length) {
    return res.status(400).json({ error: '缺少测评结果数据' })
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')

  const summaryLines = results.map((r, i) =>
    `${i + 1}. ${r.testName}（${r.testSubtitle || ''}）— 总分 ${r.totalScore}/${r.maxScore}，严重程度：${r.severityLabel}`
  )

  const analysisSystem = `你是一位资深临床心理评估专家。请根据以下多量表综合测评结果，给出整体分析报告。

用户完成的测评项目：
${summaryLines.join('\n')}

请包含以下部分（使用 markdown 格式，优先使用表格）：
1. # 整体评估概要 — 综合所有量表结果，给出整体心理状态评估
2. # 各维度分析 — **用表格呈现**，列：评估领域、量表、得分、严重程度、解读
3. # 主要问题识别 — 列出最主要的 2-3 个心理问题领域
4. # 综合建议 — 针对整体情况给出个性化建议`

  const medicationSystem = `你是一位临床精神药理学专家。请根据以下多量表综合测评结果，给出综合用药建议。

用户完成的测评项目：
${summaryLines.join('\n')}

请包含以下部分（使用 markdown 格式，优先使用表格）：
1. # 用药概述 — 基于整体情况的用药思路
2. # 综合药物建议 — **用表格呈现**，列：针对症状、推荐药物类别、作用机制、注意事项
3. # 药物相互作用注意事项 — 如涉及多类药物时的注意事项
4. # 综合建议 — 强调务必就医，遵医嘱用药`

  const cbtSystem = `你是一位资深的认知行为疗法（CBT）治疗师。请根据以下综合测评结果，为用户制定一份详细、可操作的 CBT 自助治疗方案。

用户完成的测评项目：
${summaryLines.join('\n')}

请包含以下部分（使用 markdown 格式，必须使用表格呈现时间计划）：
1. # CBT 治疗概述 — 简要说明 CBT 如何适用于用户的核心问题
2. # 核心认知扭曲识别 — **用表格呈现**，列：认知扭曲类型、典型表现、替代思维
3. # 每周治疗计划 — **用表格呈现详细的周计划**，建议 6-8 周，列：周次、主题、具体操作步骤、家庭作业、预期目标
4. # 核心操作技术 — 分步说明以下技术的操作步骤：
   - 思维记录表（Thought Record）的填写步骤
   - 行为激活（Behavioral Activation）的具体操作
   - 认知重建（Cognitive Restructuring）的分步指南
5. # 日常练习计划 — **用表格呈现**，列：时间段、练习内容、时长、频率
6. # 建议与提醒 — 注意事项和何时寻求专业帮助`

  const actSystem = `你是一位资深的接纳承诺疗法（ACT）治疗师。请根据以下综合测评结果，为用户制定一份详细、可操作的 ACT 自助治疗方案。

用户完成的测评项目：
${summaryLines.join('\n')}

请包含以下部分（使用 markdown 格式，必须使用表格呈现时间计划）：
1. # ACT 治疗概述 — 简要说明 ACT 如何适用于用户的核心问题
2. # 核心问题识别 — **用表格呈现**，列：经验性回避模式、认知融合类型、价值方向偏离
3. # 每周治疗计划 — **用表格呈现详细的周计划**，建议 6-8 周，列：周次、主题（对应 ACT 六大核心过程）、具体操作步骤、家庭作业、预期目标
4. # 核心操作技术 — 分步说明以下技术的操作步骤：
   - 正念观察（Mindfulness）的具体练习方法
   - 认知解离（Cognitive Defusion）的操作步骤
   - 价值澄清（Values Clarification）的引导问题
   - 承诺行动（Committed Action）的计划制定
5. # 日常正念练习计划 — **用表格呈现**，列：时间段、练习内容、时长、频率
6. # 建议与提醒 — 注意事项和何时寻求专业帮助`

  const systemMap = {
    'medication': medicationSystem,
    'therapy-cbt': cbtSystem,
    'therapy-act': actSystem,
  }
  const system = systemMap[req.body.type] || analysisSystem
  const userMsg = req.body.type === 'medication' ? '请给出综合用药建议。' :
    req.body.type === 'therapy-cbt' ? '请制定 CBT 治疗方案。' :
    req.body.type === 'therapy-act' ? '请制定 ACT 治疗方案。' :
    '请综合分析这些测评结果。'

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
        model: req.body.model || 'agnes-2.0-flash',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userMsg },
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
