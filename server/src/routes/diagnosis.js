import { Router } from 'express'
import { diagnosisGraph } from '../graph/index.js'
import { callLLM } from '../graph/llm.js'
import { getScaleById, recommendScales, SCALES } from '../data/questionnaires.js'
import { getDb } from '../data/database.js'

const router = Router()

function queryAll(sql, params = []) {
  const db = getDb()
  const stmt = db.prepare(sql)
  if (params.length) stmt.bind(params)
  const rows = []
  while (stmt.step()) rows.push(stmt.getAsObject())
  stmt.free()
  return rows
}

function getMedicalHistory(userId) {
  if (!userId) return ''
  try {
    const records = queryAll(
      `SELECT record_type, title, summary, doctor_type, created_at
       FROM medical_records WHERE user_id = ?
       ORDER BY created_at DESC LIMIT 10`, [userId]
    )
    if (!records.length) return ''
    const text = records.map(r =>
      `[${r.created_at}] ${r.title || r.record_type} | 医生: ${r.doctor_type || '未知'} | 摘要: ${r.summary || '无'}`
    ).join('\n')
    return `\n\n## 患者历史病历\n${text}\n\n请参考以上历史记录，结合本次对话进行诊断。`
  } catch {
    return ''
  }
}

const PSYCHIATRIST_BASE = `你是一位从业 30 年的精神科主任医师。...`
const PSYCHOLOGIST_BASE = `你是一位从业 30 年的心理科主任医师...`

// 共享流处理
async function streamAI(req, res, systemPrompt, bodyFields) {
  const { model } = req.body
  const messages = [{ role: 'system', content: systemPrompt }]
  if (bodyFields.history) {
    for (const msg of bodyFields.history) messages.push({ role: msg.role, content: msg.content })
  }
  if (bodyFields.userContent) messages.push({ role: 'user', content: bodyFields.userContent })

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 120000)
    const aiRes = await fetch('https://apihub.agnes-ai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AGNES_API_KEY}`,
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
    let fullText = ''

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
              const c = parsed.choices?.[0]?.delta?.content || ''
              if (c) { fullText += c; res.write(c) }
            } catch { }
          }
        }
      }
    } catch (streamErr) {
      if (!res.writableEnded) res.write(`\n\n[连接中断: ${streamErr.message}]`)
    }

    // 返回完整文本（用于后续处理）
    if (!res.writableEnded) res.end()
    return fullText
  } catch (e) {
    if (!res.writableEnded) {
      res.write(`连接 AI 服务失败: ${e.message}`)
      res.end()
    }
    return ''
  }
}

// ===== 带有 LangGraph 支持的聊天端点 =====
// 精神科 - Graph 版本
router.post('/diagnosis/psychiatrist/graph', async (req, res) => {
  const { message, history, model, scaleResults, userId } = req.body
  if (!message) return res.status(400).json({ error: '缺少消息内容' })

  const medicalHistory = getMedicalHistory(userId)
  const state = {
    messages: [...(history || []), { role: 'user', content: message }],
    activeAgent: 'psychiatrist',
    model: model || 'agnes-2.0-flash',
    userId: userId || null,
    medicalHistory,
    ...(scaleResults?.length ? { scaleResults } : {}),
  }

  try {
    const result = await diagnosisGraph.invoke(state)
    const lastMsg = result.messages?.[result.messages.length - 1]

    // 检查是否有量表推荐
    if (result.currentScaleData) {
      return res.json({
        type: 'scale_recommendation',
        scales: result.currentScaleData.scales,
        requestedBy: result.currentScaleData.requestedBy,
      })
    }

    // 正常返回 AI 回复
    res.json({
      type: 'message',
      content: lastMsg?.content || '',
      psychiatristSummary: result.psychiatristSummary || '',
      psychiatristDone: result.psychiatristDone || false,
      psychologistSummary: result.psychologistSummary || '',
      psychologistDone: result.psychologistDone || false,
      treatmentDone: result.treatmentDone || false,
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 心理科 - Graph 版本
router.post('/diagnosis/psychologist/graph', async (req, res) => {
  const { message, history, model, scaleResults, usePsyLLM, userId } = req.body
  if (!message) return res.status(400).json({ error: '缺少消息内容' })

  const medicalHistory = getMedicalHistory(userId)
  const state = {
    messages: [...(history || []), { role: 'user', content: message }],
    activeAgent: 'psychologist',
    model: model || 'agnes-2.0-flash',
    usePsyLLM: !!usePsyLLM,
    userId: userId || null,
    medicalHistory,
    ...(scaleResults?.length ? { scaleResults } : {}),
  }

  try {
    const result = await diagnosisGraph.invoke(state)
    const lastMsg = result.messages?.[result.messages.length - 1]

    if (result.currentScaleData) {
      return res.json({
        type: 'scale_recommendation',
        scales: result.currentScaleData.scales,
        requestedBy: result.currentScaleData.requestedBy,
      })
    }

    res.json({
      type: 'message',
      content: lastMsg?.content || '',
      psychiatristSummary: result.psychiatristSummary || '',
      psychiatristDone: result.psychiatristDone || false,
      psychologistSummary: result.psychologistSummary || '',
      psychologistDone: result.psychologistDone || false,
      treatmentDone: result.treatmentDone || false,
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ===== 保持原有流式端点 =====
router.post('/diagnosis/psychiatrist', async (req, res) => {
  const text = await streamAI(req, res, PSYCHIATRIST_SYSTEM, {
    history: req.body.history,
    userContent: req.body.message,
  })
  // 如果流中检测到量表推荐，会在前端处理
})

router.post('/diagnosis/psychologist', async (req, res) => {
  await streamAI(req, res, PSYCHOLOGIST_SYSTEM, {
    history: req.body.history,
    userContent: req.body.message,
  })
})

// 量表查询端点
router.get('/diagnosis/scales', (req, res) => {
  const { symptom } = req.query
  if (symptom) return res.json(recommendScales(symptom))
  res.json(SCALES)
})

router.get('/diagnosis/scales/:id', (req, res) => {
  const scale = getScaleById(req.params.id)
  if (!scale) return res.status(404).json({ error: '量表不存在' })
  res.json(scale)
})

// 量表评分端点
router.post('/diagnosis/scale-score', (req, res) => {
  const { scaleId, answers } = req.body
  const scale = getScaleById(scaleId)
  if (!scale) return res.status(404).json({ error: '量表不存在' })

  const totalScore = answers.reduce((sum, a) => sum + (a.value || 0), 0)
  const severity = scale.severityRanges.find(r => totalScore >= r.min && totalScore <= r.max)
  res.json({
    scaleId,
    scaleName: scale.title,
    score: totalScore,
    maxScore: scale.maxScore,
    severity: severity?.label || '未知',
  })
})

// 治疗方案（使用 callLLM 非流式，免费模型更稳定）
router.post('/diagnosis/treatment', async (req, res) => {
  const { psychiatristSummary, psychologistSummary, scaleResults, model } = req.body
  if (!psychiatristSummary && !psychologistSummary) {
    return res.status(400).json({ error: '缺少诊断摘要' })
  }

  const scaleSection = scaleResults?.length
    ? `\n\n## 量表评估结果\n${scaleResults.map(r => `- ${r.scaleName}（${r.scaleId}）: ${r.score}分, ${r.severity}`).join('\n')}`
    : ''

  const combined = `## 精神科主任医师诊断\n${psychiatristSummary || '（尚未完成）'}\n\n## 心理科主任医师诊断\n${psychologistSummary || '（尚未完成）'}${scaleSection}`

  try {
    const response = await callLLM({
      messages: [
        { role: 'system', content: '你是一位资深临床治疗专家。根据两位医生的诊断和量表结果，制定整合式治疗方案。' },
        { role: 'user', content: `请综合以下信息制定治疗方案：\n\n${combined}` },
      ],
      model: model || 'agnes-2.0-flash',
    })
    res.json({ content: response })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ===== 服务类咨询 Graph 端点（儿童情绪、青少年、正念、社交焦虑） =====
router.post('/diagnosis/service/graph', async (req, res) => {
  const { message, history, model, serviceType, scaleResults, userId } = req.body
  if (!message) return res.status(400).json({ error: '缺少消息内容' })
  if (!serviceType) return res.status(400).json({ error: '缺少服务类型' })

  const medicalHistory = getMedicalHistory(userId)
  const state = {
    messages: [...(history || []), { role: 'user', content: message }],
    activeAgent: serviceType,
    serviceType,
    model: model || 'agnes-2.0-flash',
    userId: userId || null,
    medicalHistory,
    ...(scaleResults?.length ? { scaleResults } : {}),
  }

  try {
    const result = await diagnosisGraph.invoke(state)
    const lastMsg = result.messages?.[result.messages.length - 1]

    if (result.currentScaleData) {
      return res.json({
        type: 'scale_recommendation',
        scales: result.currentScaleData.scales,
        requestedBy: result.currentScaleData.requestedBy,
      })
    }

    res.json({
      type: 'message',
      content: lastMsg?.content || '',
      serviceSummary: result.serviceSummary || '',
      serviceDone: result.serviceDone || false,
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
