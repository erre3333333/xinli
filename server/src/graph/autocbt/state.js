/**
 * AutoCBT 状态定义
 * 基于论文: AutoCBT: An Autonomous Multi-agent Framework for CBT
 * https://arxiv.org/abs/2501.09426
 * 
 * 状态结构:
 * - messages: 对话历史
 * - counsellorDraft: 咨询师草稿回复
 * - supervisorAdvice: 各监督者建议
 * - routingDecision: 路由决策
 * - memory: 短期/长期记忆
 * - confidence: 咨询师回复信心分数
 */

import { Annotation, messagesStateReducer } from '@langchain/langgraph'

// CBT 五大核心原则对应的监督者
export const SUPERVISOR_TYPES = {
  EMPATHY: 'empathy',           // 共情验证
  IDENTIFICATION: 'identification', // 认知扭曲识别
  REFLECTION: 'reflection',     // 反思挑战
  STRATEGY: 'strategy',         // 策略提供
  ENCOURAGEMENT: 'encouragement', // 鼓励前瞻
}

// 路由策略类型
export const ROUTING_STRATEGIES = {
  LOOPBACK: 'LOOPBACK',
  UNICAST: 'UNICAST',
  MULTICAST: 'MULTICAST',
  BROADCAST: 'BROADCAST',
  ENDCAST: 'ENDCAST',
}

export const AutoCBTState = Annotation.Root({
  // 对话消息
  messages: Annotation({
    reducer: messagesStateReducer,
    default: () => [],
  }),

  // 咨询师草稿回复（待改进）
  counsellorDraft: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => '',
  }),

  // 最终回复
  finalReply: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => '',
  }),

  // 各监督者的建议
  supervisorAdvice: Annotation({
    reducer: (a, b) => ({ ...a, ...b }),
    default: () => ({
      [SUPERVISOR_TYPES.EMPATHY]: null,
      [SUPERVISOR_TYPES.IDENTIFICATION]: null,
      [SUPERVISOR_TYPES.REFLECTION]: null,
      [SUPERVISOR_TYPES.STRATEGY]: null,
      [SUPERVISOR_TYPES.ENCOURAGEMENT]: null,
    }),
  }),

  // 路由决策
  routingDecision: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => ({
      strategy: ROUTING_STRATEGIES.LOOPBACK,
      targets: [],
      reason: '',
    }),
  }),

  // 信心分数 (0-1)
  confidence: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => 0.5,
  }),

  // 迭代次数
  iteration: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => 0,
  }),

  // 最大迭代次数
  maxIterations: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => 5,
  }),

  // 已调用的监督者列表
  visitedSupervisors: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),

  // 短期记忆（最近 N 条消息）
  shortTermMemory: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),

  // 长期记忆（摘要，滑动窗口）
  longTermMemory: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),

  // 认知扭曲检测结果
  cognitiveDistortions: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),

  // CBT 评分（六大维度）— 预留字段，未来可由监督者节点填充
  cbtScores: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => ({
      empathy: 0,
      identification: 0,
      reflection: 0,
      strategy: 0,
      encouragement: 0,
      relevance: 0,
    }),
  }),

  // 待处理的监督者队列（用于 MULTICAST/BROADCAST）
  pendingSupervisors: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => [],
  }),

  // 路由循环检测
  routingLoop: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => false,
  }),

  // 错误
  error: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),

  // 模型
  model: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => 'agnes-2.0-flash',
  }),
})
