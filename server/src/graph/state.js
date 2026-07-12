import { Annotation, messagesStateReducer } from '@langchain/langgraph'

export const GraphState = Annotation.Root({
  messages: Annotation({
    reducer: messagesStateReducer,
    default: () => [],
  }),
  activeAgent: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => 'psychiatrist',
  }),
  // 服务类型（child-emotion, adolescent, mindfulness, social-anxiety）
  serviceType: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
  psychiatristSummary: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => '',
  }),
  psychologistSummary: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => '',
  }),
  psychiatristDone: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => false,
  }),
  psychologistDone: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => false,
  }),
  serviceSummary: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => '',
  }),
  serviceDone: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => false,
  }),
  // 量表相关
  scaleRecommendation: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
  scaleResults: Annotation({
    reducer: (a, b) => (b == null ? a : Array.isArray(b) ? b : [...(a || []), b]),
    default: () => [],
  }),
  // 当前处理的量表
  currentScaleId: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
  currentScaleData: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
  // 治疗方案
  treatmentPlan: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => '',
  }),
  treatmentDone: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => false,
  }),
  // 用户 ID 和医疗历史
  userId: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
  medicalHistory: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => '',
  }),
  // PsyLLM 开关（用户选择）
  usePsyLLM: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => false,
  }),
  // 错误和模型
  error: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
  model: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => 'agnes-2.0-flash',
  }),
})
