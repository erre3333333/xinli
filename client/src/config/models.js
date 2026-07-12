export const PATIENT_TYPES = [
  {
    id: 'depression',
    label: '抑郁症',
    description: '持续情绪低落、失去兴趣、自我否定',
    color: '#7e9b7c',
  },
  {
    id: 'anxiety',
    label: '焦虑症',
    description: '过度担忧、紧张不安、躯体症状',
    color: '#e8a555',
  },
  {
    id: 'ocd',
    label: '强迫症',
    description: '反复想法与行为、无法自控',
    color: '#f26b5c',
  },
  {
    id: 'bipolar',
    label: '双相情感障碍',
    description: '情绪极端波动、躁狂与抑郁交替',
    color: '#b08fa8',
  },
  {
    id: 'psychosis',
    label: '精神病',
    description: '现实感知障碍、思维混乱',
    color: '#8db5c0',
  },
  {
    id: 'ptsd',
    label: '创伤后应激',
    description: '创伤经历后的持续恐惧与回避',
    color: '#b58a7a',
  },
  {
    id: 'eating',
    label: '进食障碍',
    description: '对食物、体重、体型的过度关注',
    color: '#c49a6a',
  },
  {
    id: 'adhd',
    label: '注意缺陷多动',
    description: '注意力涣散、冲动、难以静坐',
    color: '#8a9ab5',
  },
  {
    id: 'child-emotion',
    label: '儿童情绪管理',
    description: '帮助孩子识别和表达情绪，建立健康情绪调节能力',
    color: '#E8A0A0',
  },
  {
    id: 'adolescent',
    label: '青少年成长咨询',
    description: '应对青春期挑战，促进自我认知与健康成长',
    color: '#A0B8E0',
  },
  {
    id: 'mindfulness',
    label: '正念减压训练',
    description: '通过正念练习减轻压力，提升专注力与情绪平衡',
    color: '#A0D0B0',
  },
  {
    id: 'social-anxiety',
    label: '社交焦虑突破',
    description: '克服社交恐惧，建立自信的人际交往能力',
    color: '#D0A070',
  },
]

export const MODELS = [
  { id: 'agnes-2.0-flash', name: 'Agnes 2.0 Flash', provider: 'Agnes', vision: false },
  { id: 'agnes-1.5-flash', name: 'Agnes 1.5 Flash', provider: 'Agnes', vision: false },
]

export function getVisionModels() {
  return MODELS.filter((m) => m.vision)
}

export function getNextModel(currentId) {
  const idx = MODELS.findIndex((m) => m.id === currentId)
  if (idx === -1 || idx >= MODELS.length - 1) return null
  return MODELS[idx + 1].id
}
