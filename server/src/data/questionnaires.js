// 服务器端量表定义（供 LangGraph Agents 使用）
export const SCALES = [
  { id: 'phq-9', title: 'PHQ-9 抑郁症筛查量表', category: 'depression', time: '3分钟', desc: '评估过去两周抑郁症状', maxScore: 27, severityRanges: [
    { min: 0, max: 4, label: '无抑郁症状' }, { min: 5, max: 9, label: '轻度抑郁' },
    { min: 10, max: 14, label: '中度抑郁' }, { min: 15, max: 19, label: '中重度抑郁' }, { min: 20, max: 27, label: '重度抑郁' },
  ]},
  { id: 'gad-7', title: 'GAD-7 广泛性焦虑量表', category: 'anxiety', time: '2分钟', desc: '评估过去两周焦虑症状', maxScore: 21, severityRanges: [
    { min: 0, max: 4, label: '无焦虑症状' }, { min: 5, max: 9, label: '轻度焦虑' },
    { min: 10, max: 14, label: '中度焦虑' }, { min: 15, max: 21, label: '重度焦虑' },
  ]},
  { id: 'hama', title: 'HAMA 汉密尔顿焦虑量表', category: 'anxiety', time: '8分钟', desc: '临床用焦虑严重程度评估，14项', maxScore: 56, severityRanges: [
    { min: 0, max: 7, label: '无焦虑症状' }, { min: 8, max: 14, label: '轻度焦虑' },
    { min: 15, max: 23, label: '中度焦虑' }, { min: 24, max: 56, label: '重度焦虑' },
  ]},
  { id: 'stai', title: 'STAI 状态-特质焦虑问卷', category: 'anxiety', time: '10分钟', desc: '区分状态焦虑和特质焦虑，各20项', maxScore: 160, severityRanges: [
    { min: 40, max: 79, label: '正常范围' }, { min: 80, max: 99, label: '轻度焦虑' },
    { min: 100, max: 119, label: '中度焦虑' }, { min: 120, max: 160, label: '重度焦虑' },
  ]},
  { id: 'adis', title: 'ADIS 焦虑障碍访谈量表', category: 'anxiety', time: '15分钟', desc: '基于DSM-5的焦虑障碍诊断访谈筛查，涵盖惊恐发作、广场恐惧、社交焦虑、广泛性焦虑、特定恐惧症', maxScore: 40, severityRanges: [
    { min: 0, max: 8, label: '焦虑症状较少' }, { min: 9, max: 16, label: '轻度焦虑' },
    { min: 17, max: 24, label: '中度焦虑' }, { min: 25, max: 40, label: '重度焦虑' },
  ]},
  { id: 'gds', title: 'GDS 老年抑郁量表', category: 'depression', time: '5分钟', desc: '老年抑郁筛查，30项是否判断题', maxScore: 30, severityRanges: [
    { min: 0, max: 9, label: '正常范围' }, { min: 10, max: 19, label: '轻度抑郁' },
    { min: 20, max: 30, label: '重度抑郁' },
  ]},
  { id: 'sds', title: 'SDS 抑郁自评量表', category: 'depression', time: '5分钟', desc: 'Zung 抑郁自评，涵盖情感/躯体/精神运动性症状', maxScore: 80, severityRanges: [
    { min: 20, max: 39, label: '正常范围' }, { min: 40, max: 47, label: '轻度抑郁' },
    { min: 48, max: 55, label: '中度抑郁' }, { min: 56, max: 80, label: '重度抑郁' },
  ]},
  { id: 'bdi', title: 'BDI 贝克抑郁量表', category: 'depression', time: '5分钟', desc: 'Beck 抑郁量表，涵盖情感/认知/动机/躯体症状', maxScore: 63, severityRanges: [
    { min: 0, max: 13, label: '正常或轻微' }, { min: 14, max: 19, label: '轻度抑郁' },
    { min: 20, max: 28, label: '中度抑郁' }, { min: 29, max: 63, label: '重度抑郁' },
  ]},
  { id: 'hamd', title: 'HAMD 汉密尔顿抑郁量表', category: 'depression', time: '8分钟', desc: '临床用抑郁严重程度评估，17项', maxScore: 52, severityRanges: [
    { min: 0, max: 7, label: '正常范围' }, { min: 8, max: 13, label: '轻度抑郁' },
    { min: 14, max: 18, label: '中度抑郁' }, { min: 19, max: 22, label: '中重度抑郁' }, { min: 23, max: 52, label: '重度抑郁' },
  ]},
  { id: 'das', title: 'DAS 功能失调性态度量表', category: 'depression', time: '15分钟', desc: '40题评估7维度功能失调性信念：完美主义、寻求认可、脆弱感等', maxScore: 280, severityRanges: [
    { min: 40, max: 119, label: '功能失调信念较少' }, { min: 120, max: 179, label: '轻度功能失调信念' },
    { min: 180, max: 219, label: '中度功能失调信念' }, { min: 220, max: 280, label: '重度功能失调信念' },
  ]},
  { id: 'isi', title: 'ISI 失眠严重指数量表', category: 'sleep', time: '3分钟', desc: '评估失眠严重程度', maxScore: 28, severityRanges: [
    { min: 0, max: 7, label: '无临床失眠' }, { min: 8, max: 14, label: '亚阈值失眠' },
    { min: 15, max: 21, label: '中度失眠' }, { min: 22, max: 28, label: '重度失眠' },
  ]},
  { id: 'cdc', title: '认知扭曲检查表', category: 'cognition', time: '3分钟', desc: '识别10种常见认知扭曲', maxScore: 40, severityRanges: [
    { min: 0, max: 10, label: '认知扭曲较少' }, { min: 11, max: 20, label: '轻度认知扭曲' },
    { min: 21, max: 30, label: '中度认知扭曲' }, { min: 31, max: 40, label: '重度认知扭曲' },
  ]},
  { id: 'burns-depression', title: '伯恩斯抑郁自评量表', category: 'depression', time: '5分钟', desc: 'Burns 抑郁症状清单，25项', maxScore: 75, severityRanges: [
    { min: 0, max: 10, label: '正常范围' }, { min: 11, max: 25, label: '轻度抑郁' },
    { min: 26, max: 40, label: '中度抑郁' }, { min: 41, max: 55, label: '中重度抑郁' }, { min: 56, max: 75, label: '重度抑郁' },
  ]},
  // ===== 儿童情绪管理 =====
  { id: 'cers', title: 'CERS 儿童情绪调节能力评估', category: 'child-emotion', time: '5分钟', desc: '评估儿童识别、表达和调节情绪的能力', maxScore: 40, severityRanges: [
    { min: 0, max: 16, label: '情绪调节能力良好' }, { min: 17, max: 24, label: '轻度情绪调节困难' },
    { min: 25, max: 32, label: '中度情绪调节困难' }, { min: 33, max: 40, label: '重度情绪调节困难' },
  ]},
  { id: 'sdq-child', title: 'SDQ 儿童困难与优势问卷', category: 'child-emotion', time: '5分钟', desc: '评估儿童情绪症状、行为问题、多动、同伴关系和亲社会行为', maxScore: 40, severityRanges: [
    { min: 0, max: 13, label: '正常范围' }, { min: 14, max: 16, label: '边缘水平' },
    { min: 17, max: 40, label: '异常范围' },
  ]},
  // ===== 青少年成长咨询 =====
  { id: 'psci', title: 'PSCI 青少年自我概念量表', category: 'adolescent', time: '5分钟', desc: '评估青少年自我认知、自尊水平和自我价值感', maxScore: 60, severityRanges: [
    { min: 0, max: 24, label: '自我概念积极' }, { min: 25, max: 36, label: '自我概念一般' },
    { min: 37, max: 48, label: '自我概念偏低' }, { min: 49, max: 60, label: '自我概念消极' },
  ]},
  { id: 'yapa', title: 'YAPA 青少年适应力评估', category: 'adolescent', time: '5分钟', desc: '评估青少年在学业、社交、情绪和家庭方面的适应状况', maxScore: 50, severityRanges: [
    { min: 0, max: 20, label: '适应良好' }, { min: 21, max: 30, label: '轻度适应困难' },
    { min: 31, max: 40, label: '中度适应困难' }, { min: 41, max: 50, label: '重度适应困难' },
  ]},
  // ===== 正念减压训练 =====
  { id: 'maas', title: 'MAAS 正念注意觉知量表', category: 'mindfulness', time: '3分钟', desc: '评估日常生活中的正念觉知水平', maxScore: 54, severityRanges: [
    { min: 0, max: 18, label: '正念水平较低（需加强练习）' }, { min: 19, max: 36, label: '正念水平中等' },
    { min: 37, max: 54, label: '正念水平较高' },
  ]},
  { id: 'ffmq', title: 'FFMQ 五因素正念量表（简版）', category: 'mindfulness', time: '5分钟', desc: '从观察、描述、觉知行动、不评判、不反应五个维度评估正念', maxScore: 60, severityRanges: [
    { min: 0, max: 24, label: '正念水平较低' }, { min: 25, max: 36, label: '正念水平中等' },
    { min: 37, max: 48, label: '正念水平良好' }, { min: 49, max: 60, label: '正念水平优秀' },
  ]},
  // ===== 社交焦虑突破 =====
  { id: 'sias', title: 'SIAS 社交互动焦虑量表', category: 'social-anxiety', time: '3分钟', desc: '评估社交互动场景中的焦虑程度', maxScore: 60, severityRanges: [
    { min: 0, max: 22, label: '社交焦虑较轻' }, { min: 23, max: 34, label: '轻度社交焦虑' },
    { min: 35, max: 46, label: '中度社交焦虑' }, { min: 47, max: 60, label: '重度社交焦虑' },
  ]},
  { id: 'sad', title: 'SAD 社交回避与苦恼量表', category: 'social-anxiety', time: '3分钟', desc: '评估社交回避行为和社交情境中的苦恼程度', maxScore: 28, severityRanges: [
    { min: 0, max: 7, label: '社交回避较少' }, { min: 8, max: 14, label: '轻度社交回避' },
    { min: 15, max: 21, label: '中度社交回避' }, { min: 22, max: 28, label: '重度社交回避/苦恼' },
  ]},
  // ===== 自主神经功能 =====
  { id: 'scopa-aut', title: 'SCOPA-AUT 自主神经结局量表', category: 'autonomic', time: '6分钟', desc: '评估自主神经功能障碍，23项', maxScore: 69, severityRanges: [
    { min: 0, max: 14, label: '自主神经功能正常' }, { min: 15, max: 29, label: '轻度功能障碍' },
    { min: 30, max: 44, label: '中度功能障碍' }, { min: 45, max: 69, label: '重度功能障碍' },
  ]},
  // ===== 认知功能 =====
  { id: 'moca', title: 'MoCA 蒙特利尔认知评价', category: 'cognitive', time: '8分钟', desc: '认知功能自评筛查，15项', maxScore: 30, severityRanges: [
    { min: 0, max: 5, label: '认知功能正常' }, { min: 6, max: 10, label: '轻度认知下降' },
    { min: 11, max: 20, label: '中度认知下降' }, { min: 21, max: 30, label: '重度认知下降' },
  ]},
  { id: 'mmse', title: 'MMSE 简易精神状态测试', category: 'cognitive', time: '6分钟', desc: '认知功能自评筛查，10项', maxScore: 30, severityRanges: [
    { min: 0, max: 4, label: '认知功能正常' }, { min: 5, max: 9, label: '轻度认知下降' },
    { min: 10, max: 19, label: '中度认知下降' }, { min: 20, max: 30, label: '重度认知下降' },
  ]},
]

export function getScaleById(id) {
  return SCALES.find(s => s.id === id)
}

export function recommendScales(symptoms) {
  const keyword = symptoms.toLowerCase()
  const matches = []
  if (/抑郁|低落|悲伤|绝望|无价值|兴趣减退|自杀|老年|退休|孤独|sad|depress|hopeless|geriatric|elderly/i.test(keyword)) {
    matches.push('phq-9', 'sds', 'bdi', 'burns-depression', 'hamd', 'gds', 'das')
  }
  if (/焦虑|紧张|担忧|恐惧|不安|恐慌|anxiety|anxious|worry|panic|心慌|手抖|烦躁|害怕/i.test(keyword)) {
    matches.push('gad-7', 'hama', 'stai', 'adis')
  }
  if (/失眠|入睡|早醒|睡眠|insomnia|sleep/i.test(keyword)) {
    matches.push('isi')
  }
  if (/思维|认知|扭曲|自动化|negative|thought|cogniti/i.test(keyword)) {
    matches.push('cdc')
  }
  if (/儿童|孩子|情绪|行为|脾气|叛逆|亲子|child|emotion|temper/i.test(keyword)) {
    matches.push('cers', 'sdq-child')
  }
  if (/青少年|自我|认同|学业|同伴|青春期|adolescent|teen|identity/i.test(keyword)) {
    matches.push('psci', 'yapa')
  }
  if (/正念|减压|压力|专注|放松|mindful|stress|relax|meditation/i.test(keyword)) {
    matches.push('maas', 'ffmq')
  }
  if (/社交|焦虑|害怕|表达|拒绝|紧张|shy|social|anxiety|public/i.test(keyword)) {
    matches.push('sias', 'sad')
  }
  if (/自主神经|自主|植物神经|出汗|头晕|排尿|便秘|吞咽|体位性|低血压|autonomic|dysautonomia|pd|帕金森/i.test(keyword)) {
    matches.push('scopa-aut')
  }
  if (/认知|记忆|健忘|痴呆|思维|反应慢|注意力|confusion|memory|cogniti|dementia|alzheimer|mci|moca|mmse/i.test(keyword)) {
    matches.push('moca', 'mmse')
  }
  if (matches.length === 0) {
    return { primary: [SCALES[0], SCALES[1]], all: SCALES }
  }
  const unique = [...new Set(matches)]
  return {
    primary: unique.slice(0, 3).map(id => getScaleById(id)).filter(Boolean),
    all: unique.map(id => getScaleById(id)).filter(Boolean),
  }
}
