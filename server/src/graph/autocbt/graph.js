/**
 * AutoCBT LangGraph 拓扑构建
 * 实现论文中的多 Agent 架构
 * 
 * 节点:
 * - counsellor: 咨询师 Agent (a₀)
 * - supervisor_empathy: 共情监督者
 * - supervisor_identification: 认知扭曲识别监督者
 * - supervisor_reflection: 反思挑战监督者
 * - supervisor_strategy: 策略提供监督者
 * - supervisor_encouragement: 鼓励前瞻监督者
 * - final_reply: 最终回复生成
 * 
 * 边:
 * - 动态路由基于咨询师决策
 */

import { StateGraph, START, END } from '@langchain/langgraph'
import { AutoCBTState, SUPERVISOR_TYPES, ROUTING_STRATEGIES } from './state.js'
import { counsellorNode } from './nodes/counsellor.js'
import { callSupervisor, SUPERVISOR_CONFIG } from './nodes/supervisors.js'
import { executeRouting, integrateSupervisorAdvice } from './routing.js'
import { updateShortTermMemory, updateLongTermMemory } from './memory.js'
import { callLLM } from '../llm.js'

/**
 * 监督者节点生成器
 * 为每个监督者类型创建对应的节点函数
 */
function createSupervisorNode(type) {
  return async (state) => {
    const { counsellorDraft, messages, model, visitedSupervisors } = state
    
    // 获取用户最新消息
    const userMessage = [...messages].reverse().find(m => m.role === 'user' || m.type === 'human')
    const userContent = userMessage?.content || userMessage?.text || ''
    
    // 获取对话历史
    const conversationHistory = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-6)

    // 调用监督者
    const result = await callSupervisor(type, {
      draft_reply: counsellorDraft,
      user_message: userContent,
      conversation_history: conversationHistory,
      model,
    })

    // 更新短期和长期记忆
    const shortTermMemory = updateShortTermMemory(messages)
    const longTermMemory = updateLongTermMemory(messages)

    return {
      supervisorAdvice: {
        ...state.supervisorAdvice,
        [type]: result,
      },
      shortTermMemory,
      longTermMemory,
    }
  }
}

// 创建所有监督者节点
const supervisorNodes = {
  [SUPERVISOR_TYPES.EMPATHY]: createSupervisorNode(SUPERVISOR_TYPES.EMPATHY),
  [SUPERVISOR_TYPES.IDENTIFICATION]: createSupervisorNode(SUPERVISOR_TYPES.IDENTIFICATION),
  [SUPERVISOR_TYPES.REFLECTION]: createSupervisorNode(SUPERVISOR_TYPES.REFLECTION),
  [SUPERVISOR_TYPES.STRATEGY]: createSupervisorNode(SUPERVISOR_TYPES.STRATEGY),
  [SUPERVISOR_TYPES.ENCOURAGEMENT]: createSupervisorNode(SUPERVISOR_TYPES.ENCOURAGEMENT),
}

/**
 * 最终回复节点
 * 整合所有监督者建议，生成最终回复
 */
async function finalReplyNode(state) {
  const { counsellorDraft, supervisorAdvice, messages, model } = state
  
  // 整合监督者建议
  const improvementTips = integrateSupervisorAdvice(state)
  
  // 获取用户最新消息
  const userMessage = [...messages].reverse().find(m => m.role === 'user' || m.type === 'human')
  const userContent = userMessage?.content || userMessage?.text || ''

  const systemPrompt = `你是一位专业的认知行为疗法（CBT）咨询师。

## 任务
基于以下信息，生成最终的咨询回复：

**用户消息**: ${userContent}

**咨询师初始草稿**:
${counsellorDraft}

${improvementTips ? `**监督者改进建议**:\n${improvementTips}` : ''}

## 要求
- 回复要温暖、真诚、有同理心
- 整合监督者的建议改进初始草稿
- 回复长度适中（100-300字）
- 如果是中文用户，用中文回复；英文用户用英文回复
- 避免空洞的建议，提供具体的、个性化的回应`;

  try {
    const response = await callLLM({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: '请生成最终回复。' },
      ],
      model,
    })

    return {
      finalReply: response,
      confidence: 0.9,
    }
  } catch (e) {
    console.error('[Final Reply] 错误:', e)
    return {
      finalReply: counsellorDraft || '抱歉，我暂时无法处理你的消息。',
      confidence: 0.5,
    }
  }
}

/**
 * 构建 AutoCBT Graph
 */
function buildAutoCBTGraph() {
  const builder = new StateGraph(AutoCBTState)

  // 添加咨询师节点
  builder.addNode('counsellor', counsellorNode)

  // 添加所有监督者节点
  for (const [type, node] of Object.entries(supervisorNodes)) {
    builder.addNode(`supervisor_${type}`, node)
  }

  // 添加最终回复节点
  builder.addNode('final_reply', finalReplyNode)

  // 添加条件边：从 START 到 counsellor
  builder.addEdge(START, 'counsellor')

  // 添加条件边：从 counsellor 到下一个节点（基于路由决策）
  builder.addConditionalEdges(
    'counsellor',
    async (state) => {
      const routing = await executeRouting(state)
      
      if (routing === ROUTING_STRATEGIES.ENDCAST || routing === 'final_reply') {
        // 对于 MULTICAST/BROADCAST，先将剩余监督者入队
        const { routingDecision } = state
        const { strategy, targets } = routingDecision || {}
        if ((strategy === ROUTING_STRATEGIES.MULTICAST || strategy === ROUTING_STRATEGIES.BROADCAST) && targets && targets.length > 1) {
          // 第一个已在 routingDecision.targets[0] 中被处理，剩余入队
          return {
            __next__: 'final_reply',
            pendingSupervisors: targets.slice(1),
          }
        }
        return 'final_reply'
      }
      
      if (routing.startsWith('supervisor_')) {
        return routing
      }
      
      return 'counsellor'
    },
    {
      'counsellor': 'counsellor',
      'final_reply': 'final_reply',
    }
  )

  // 从每个监督者回到 counsellor（继续路由决策）
  for (const type of Object.keys(supervisorNodes)) {
    builder.addConditionalEdges(
      `supervisor_${type}`,
      async (state) => {
        // 监督者完成后，从队列中移除已处理的，继续下一个或回到 counsellor
        const { pendingSupervisors } = state
        if (pendingSupervisors && pendingSupervisors.length > 0) {
          // 还有剩余的监督者待处理，返回当前节点处理下一个
          return {
            __next__: 'counsellor',
            pendingSupervisors: pendingSupervisors.slice(1),
          }
        }
        // 队列空了，回到咨询师进行下一轮路由决策
        return 'counsellor'
      }
    )
  }

  // 从 final_reply 到 END
  builder.addEdge('final_reply', END)

  return builder.compile()
}

// 导出编译后的图
export const autocbtGraph = buildAutoCBTGraph()
