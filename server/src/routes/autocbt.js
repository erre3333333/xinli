/**
 * AutoCBT API 端点
 * POST /api/autocbt/chat - 发起 AutoCBT 对话
 */

import { Router } from 'express'
import { autocbtGraph } from '../graph/autocbt/graph.js'

const router = Router()

router.post('/chat', async (req, res) => {
  const { message, history, model, sessionId } = req.body

  if (!message) {
    return res.status(400).json({ error: '缺少消息内容' })
  }

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-cache')

  try {
    // 构建初始状态
    const state = {
      messages: [
        ...(history || []).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message },
      ],
      activeAgent: 'autocbt',
      model: model || 'agnes-2.0-flash',
      iteration: 0,
      confidence: 0.5,
      visitedSupervisors: [],
      supervisorAdvice: {},
    }

    // 调用 AutoCBT Graph
    const result = await autocbtGraph.invoke(state)

    // 提取最终回复
    const finalReply = result.finalReply || result.counsellorDraft || '抱歉，我无法生成回复。'

    res.json({
      type: 'message',
      content: finalReply,
      confidence: result.confidence,
      iteration: result.iteration,
      cognitiveDistortions: result.cognitiveDistortions || [],
      cbtScores: result.cbtScores || {},
      routingLog: {
        visitedSupervisors: result.visitedSupervisors || [],
        finalStrategy: result.routingDecision?.strategy || 'ENDCAST',
      },
    })
  } catch (e) {
    console.error('[AutoCBT] 错误:', e)
    res.status(500).json({ error: e.message })
  }
})

// 流式响应版本
router.post('/chat/stream', async (req, res) => {
  const { message, history, model } = req.body

  if (!message) {
    return res.status(400).json({ error: '缺少消息内容' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const state = {
      messages: [
        ...(history || []).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message },
      ],
      activeAgent: 'autocbt',
      model: model || 'agnes-2.0-flash',
      iteration: 0,
      confidence: 0.5,
      visitedSupervisors: [],
      supervisorAdvice: {},
    }

    // 发送开始事件
    res.write('event: start\ndata: {"message": "AutoCBT 开始处理..."}\n\n')

    // 调用 AutoCBT Graph
    const result = await autocbtGraph.invoke(state)

    // 发送最终回复
    const finalReply = result.finalReply || result.counsellorDraft || '抱歉，我无法生成回复。'
    const safeContent = JSON.stringify(finalReply).slice(1, -1) // 安全转义特殊字符
    const safeConfidence = typeof result.confidence === 'number' ? result.confidence : 0.5
    
    res.write(`event: message\ndata: {"content": "${safeContent}", "confidence": ${safeConfidence}}\n\n`)
    
    // 发送路由日志
    res.write(`event: routing_log\ndata: {"visitedSupervisors": ${JSON.stringify(result.visitedSupervisors || [])}, "iteration": ${result.iteration || 0}}\n\n`)

    res.write('event: end\ndata: {}\n\n')
    res.end()
  } catch (e) {
    console.error('[AutoCBT Stream] 错误:', e)
    res.write(`event: error\ndata: {"error": "${JSON.stringify(e.message).slice(1, -1)}"}\n\n`)
    res.end()
  }
})

export default router
