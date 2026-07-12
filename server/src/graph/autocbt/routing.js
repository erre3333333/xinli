/**
 * 路由策略模块
 * 实现论文中定义的 5 种路由策略：
 * LOOPBACK, UNICAST, MULTICAST, BROADCAST, ENDCast
 */

import { ROUTING_STRATEGIES } from './state.js'

/**
 * 执行路由决策
 * @param {Object} state - 当前状态
 * @returns {Promise<string>} 下一个节点名称
 */
export async function executeRouting(state) {
  const { routingDecision, confidence, iteration, maxIterations, routingLoop, pendingSupervisors } = state
  const { strategy, targets, reason } = routingDecision

  console.log(`[AutoCBT Routing] 策略: ${strategy}, 信心: ${confidence.toFixed(2)}, 迭代: ${iteration}/${maxIterations}, 待处理监督者: ${pendingSupervisors.length}`)

  // 如果信心足够高，直接结束
  if (confidence >= 0.8) {
    console.log('[AutoCBT Routing] 信心充足，选择 ENDCAST')
    return ROUTING_STRATEGIES.ENDCAST
  }

  // 如果达到最大迭代次数，强制结束
  if (iteration >= maxIterations) {
    console.log('[AutoCBT Routing] 达到最大迭代次数，强制结束')
    return ROUTING_STRATEGIES.ENDCAST
  }

  // 如果检测到路由循环，强制结束
  if (routingLoop) {
    console.log('[AutoCBT Routing] 检测到路由循环，强制结束')
    return ROUTING_STRATEGIES.ENDCAST
  }

  // 优先处理待处理的监督者队列（MULTICAST/BROADCAST）
  if (pendingSupervisors && pendingSupervisors.length > 0) {
    const nextSupervisor = pendingSupervisors[0]
    console.log(`[AutoCBT Routing] 队列处理: ${nextSupervisor}`)
    return `supervisor_${nextSupervisor}`
  }

  // 根据策略决定下一步
  switch (strategy) {
    case ROUTING_STRATEGIES.LOOPBACK:
      // 继续当前对话，不咨询监督者
      console.log('[AutoCBT Routing] LOOPBACK - 继续当前对话')
      return 'counsellor'

    case ROUTING_STRATEGIES.UNICAST:
      // 发送给单个监督者（选择第一个目标）
      if (targets && targets.length > 0) {
        console.log(`[AutoCBT Routing] UNICAST - 发送给: ${targets[0]}`)
        return `supervisor_${targets[0]}`
      }
      // 如果没有指定目标，默认发送 empathy
      console.log('[AutoCBT Routing] UNICAST - 默认发送给 empathy')
      return 'supervisor_empathy'

    case ROUTING_STRATEGIES.MULTICAST:
      // 发送给多个监督者（按顺序处理）— 将剩余目标放入队列
      if (targets && targets.length > 0) {
        console.log(`[AutoCBT Routing] MULTICAST - 按顺序发送给: ${targets.join(', ')}`)
        // 先处理第一个，其余入队
        return `supervisor_${targets[0]}`
      }
      return 'counsellor'

    case ROUTING_STRATEGIES.BROADCAST:
      // 发送给所有监督者 — 将全部监督者入队
      console.log('[AutoCBT Routing] BROADCAST - 发送给所有监督者')
      return 'supervisor_empathy' // 从第一个开始，其余由队列处理

    case ROUTING_STRATEGIES.ENDCAST:
      // 终止通信，回复用户
      console.log('[AutoCBT Routing] ENDCast - 终止通信')
      return 'final_reply'

    default:
      console.log('[AutoCBT Routing] 未知策略，默认 LOOPBACK')
      return 'counsellor'
  }
}

/**
 * 整合所有监督者的建议
 * @param {Object} state - 包含所有监督者建议的状态
 * @returns {string} 整合后的改进建议
 */
export function integrateSupervisorAdvice(state) {
  const { supervisorAdvice, counsellorDraft } = state
  let improvementTips = []

  if (supervisorAdvice.empathy?.advice?.suggestions) {
    improvementTips.push(`共情改进: ${supervisorAdvice.empathy.advice.suggestions}`)
  }
  if (supervisorAdvice.identification?.advice?.suggestions) {
    improvementTips.push(`认知扭曲识别: ${supervisorAdvice.identification.advice.suggestions}`)
  }
  if (supervisorAdvice.reflection?.advice?.suggested_questions) {
    improvementTips.push(`反思问题: ${supervisorAdvice.reflection.advice.suggested_questions.join('; ')}`)
  }
  if (supervisorAdvice.strategy?.suggested_strategies) {
    improvementTips.push(`策略建议: ${supervisorAdvice.strategy.suggested_strategies.join('; ')}`)
  }
  if (supervisorAdvice.encouragement?.empowerment_messages) {
    improvementTips.push(`鼓励信息: ${supervisorAdvice.encouragement.empowerment_messages.join('; ')}`)
  }

  return improvementTips.join('\n')
}
