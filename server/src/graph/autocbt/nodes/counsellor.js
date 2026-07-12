/**
 * 咨询师 Agent (Counsellor Agent)
 * 对应论文中的 a₀，是整个 AutoCBT 系统的用户接口
 * 
 * 核心职责：
 * 1. 接收用户消息
 * 2. 生成初始回复草稿
 * 3. 决策是否需要咨询监督者
 * 4. 根据监督者建议改进回复
 * 5. 评估回复信心分数
 * 6. 决定路由策略（LOOPBACK/UNICAST/MULTICAST/BROADCAST/ENDCAST）
 */

import { callLLM } from '../../llm.js'

const COUNSELLOR_SYSTEM_PROMPT = `你是一位专业的认知行为疗法（CBT）咨询师。你的任务是对用户的心理困扰做出恰当回应。

## 工作流程
1. 首先，基于用户消息和你的专业知识，生成一个初步回复草稿
2. 然后，评估这个草稿的质量，决定是否满意
3. 如果不满意（信心低于 0.7），你需要向监督者寻求帮助
4. 收到监督者建议后，整合建议改进回复
5. 重新评估信心，直到满意或达到最大迭代次数

## CBT 核心原则
在回复中必须体现以下原则：
- **共情验证**：展现对用户情绪的理解和同情，创造安全感
- **识别认知扭曲**：识别用户陈述中的非理性思维模式（如灾难化、贴标签、最小化积极肯定等）
- **反思挑战**：提出开放式问题促使用户重新审视初始想法
- **策略提供**：给出实用的应对策略或洞察
- **鼓励前瞻**：鼓励用户采取行动，预见可能的困难并提供安慰

## 认知扭曲类型（Beck 分类）
- 灾难化思维（Catastrophizing）
- 全或无思维（All-or-Nothing Thinking）
- 过度概括（Overgeneralization）
- 贴标签（Labeling）
- 最小化/放大（Minimization/Maximization）
- 个人化（Personalization）
- 情绪化推理（Emotional Reasoning）
- "应该"陈述（Should Statements）

## 输出格式
请按以下 JSON 格式输出你的决策：
{
  "draft_reply": "你的初步回复草稿",
  "confidence": 0.85,
  "needs_supervisor": true/false,
  "supervisor_types": ["empathy", "identification"],
  "cognitive_distortions_detected": ["catastrophizing", "labeling"],
  "routing_strategy": "UNICAST",
  "reason": "为什么需要/不需要监督者帮助"
}

## 重要提示
- 回复要温暖、真诚、有同理心
- 避免空洞的建议或机械化的回应
- 每次回复聚焦 1-2 个重点，不要一次性给出所有建议
- 使用通俗易懂的语言，避免学术术语
- 如果是中文用户，用中文回复；英文用户用英文回复`;

/**
 * 咨询师节点
 * @param {Object} state - LangGraph 状态
 * @returns {Object} 更新后的状态
 */
export async function counsellorNode(state) {
  const { messages, iteration, maxIterations, visitedSupervisors, routingLoop } = state
  
  // 获取最近的对话（排除系统消息）
  const conversationHistory = messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .slice(-10) // 保留最近 10 条消息作为上下文

  const userMessage = conversationHistory.find(m => m.role === 'user')
  if (!userMessage) {
    return {
      error: '没有发现用户消息',
      routingDecision: {
        strategy: 'ENDCAST',
        targets: [],
        reason: '没有用户消息需要回复',
      },
      finalReply: '你好！有什么我可以帮你的吗？',
      confidence: 1.0,
    }
  }

  const systemPrompt = `${COUNSELLOR_SYSTEM_PROMPT}

## 当前状态
- 迭代次数：${iteration}/${maxIterations}
- 已访问的监督者：${visitedSupervisors.join(', ') || '无'}
- 路由循环检测：${routingLoop ? '检测到循环，强制结束' : '正常'}

${routingLoop ? '注意：检测到路由循环，请直接给出最终回复！' : ''}`

  try {
    const response = await callLLM({
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
      ],
      model: state.model,
    })

    // 解析 JSON 响应
    let decision
    try {
      // 尝试提取 JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        decision = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found')
      }
    } catch (e) {
      // 如果解析失败，使用默认决策
      console.warn('[Counsellor] JSON 解析失败，使用默认决策:', e.message)
      decision = {
        draft_reply: response,
        confidence: 0.6,
        needs_supervisor: true,
        supervisor_types: ['empathy', 'identification'],
        cognitive_distortions_detected: [],
        routing_strategy: 'UNICAST',
        reason: '解析失败，保守选择咨询',
      }
    }

    // 检测路由循环：同一监督者被连续调用两次或以上
    const supervisorCounts = {}
    for (const v of visitedSupervisors) {
      supervisorCounts[v] = (supervisorCounts[v] || 0) + 1
    }
    const isLoop = Object.values(supervisorCounts).some(c => c > 2)

    return {
      counsellorDraft: decision.draft_reply || '',
      confidence: Math.min(decision.confidence || 0.5, 1.0),
      routingDecision: {
        strategy: decision.routing_strategy || 'LOOPBACK',
        targets: decision.supervisor_types || [],
        reason: decision.reason || '',
      },
      cognitiveDistortions: decision.cognitive_distortions_detected || [],
      routingLoop: isLoop,
      iteration: iteration + 1,
      visitedSupervisors: [...visitedSupervisors, ...(decision.supervisor_types || [])],
    }
  } catch (e) {
    console.error('[Counsellor] 咨询师节点错误:', e)
    return {
      error: e.message,
      finalReply: '抱歉，我暂时无法处理你的消息。请稍后再试。',
      confidence: 0.0,
    }
  }
}
