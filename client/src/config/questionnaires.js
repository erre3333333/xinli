export const QUESTIONNAIRES = {

  // ===== PHQ-9：抑郁症 =====
  depression: [
    {
      id: 'phq-9',
      title: 'PHQ-9 抑郁症筛查量表',
      subtitle: 'Patient Health Questionnaire-9',
      time: '约 3 分钟',
      desc: '国际通用的抑郁症状自评工具，评估过去两周的情绪状态。',
      questions: [
        { id: 'phq_1', text: '做事时提不起劲或没有兴趣', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
        { id: 'phq_2', text: '感到心情低落、沮丧或绝望', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
        { id: 'phq_3', text: '入睡困难、睡不安稳或睡眠过多', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
        { id: 'phq_4', text: '感觉疲倦或没有活力', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
        { id: 'phq_5', text: '食欲不振或吃太多', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
        { id: 'phq_6', text: '觉得自己很糟——或觉得自己很失败，或让自己或家人失望', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
        { id: 'phq_7', text: '注意力不集中——如阅读报纸或看电视时', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
        { id: 'phq_8', text: '动作或说话速度缓慢到别人已经觉察？或正好相反——烦躁不安、坐立不安、动来动去', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
        { id: 'phq_9', text: '有不如死掉或用某种方式伤害自己的念头', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 4, severity: '无抑郁症状', level: 'minimal' },
          { min: 5, max: 9, severity: '轻度抑郁', level: 'mild' },
          { min: 10, max: 14, severity: '中度抑郁', level: 'moderate' },
          { min: 15, max: 19, severity: '中重度抑郁', level: 'moderately-severe' },
          { min: 20, max: 27, severity: '重度抑郁', level: 'severe' },
        ],
        note: '总分 ≥ 10 分建议寻求专业评估。第 9 题≥1 分表示存在自伤风险，请立即联系心理热线。',
      },
      analysis: {
        minimal: '您的得分在正常范围内。如果您感到困扰，定期运动、保持社交联系和良好的睡眠习惯有助于维持心理健康。',
        mild: '您可能存在轻度抑郁症状。建议：1) 保持规律作息和适度运动；2) 与信任的人交流感受；3) 学习正念呼吸或渐进式肌肉放松；4) 如症状持续超过两周，建议咨询心理医生。',
        moderate: '您目前处于中度抑郁水平。强烈建议：1) 尽快预约心理咨询或精神科门诊；2) 认知行为疗法（CBT）对中度抑郁有充分循证支持；3) 医生可能会评估是否需要抗抑郁药物；4) 避免独处和社交隔离。',
        'moderately-severe': '您的抑郁症状已达到中重度水平。请立即寻求专业帮助：1) 尽快联系精神科医生进行全面评估；2) 药物治疗与心理治疗联合是首选方案；3) 如出现自杀念头，立即拨打心理援助热线 400-161-9995 或前往急诊。',
        severe: '您的抑郁症状已达到重度水平。这是需要立即干预的紧急情况：1) 请尽快前往精神专科医院就诊；2) 药物治疗是必要的；3) 需要专业心理治疗与药物联合干预；4) 如出现自杀想法或计划，请立即拨打 120 或心理援助热线 400-161-9995。',
      },
      methods: {
        cbt: '认知行为疗法（CBT）：识别和改变负面思维模式与行为，是抑郁症的一线心理治疗方法。',
        ipt: '人际关系疗法（IPT）：聚焦于改善人际关系问题，对抑郁症状有显著效果。',
        medication: '药物治疗：SSRI 类抗抑郁药（如氟西汀、舍曲林、艾司西酞普兰）是临床常用一线药物，需精神科医生处方。',
        lifestyle: '生活方式干预：有氧运动每周 3-5 次、规律作息、光照疗法、正念冥想均可作为辅助手段。',
      },
    },

    // ===== ISI：失眠严重指数量表 =====
    {
      id: 'isi',
      title: 'ISI 失眠严重指数量表',
      subtitle: 'Insomnia Severity Index',
      time: '约 3 分钟',
      desc: '评估过去两周的失眠严重程度，涵盖入睡、维持睡眠、早醒及日间功能等方面。',
      questions: [
        { id: 'isi_1', text: '入睡困难', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'isi_2', text: '维持睡眠困难（易醒、醒后难再入睡）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'isi_3', text: '早醒（比期望的起床时间早醒）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'isi_4', text: '对您目前的睡眠模式感到不满意', options: [
          { value: 0, label: '非常满意' }, { value: 1, label: '满意' },
          { value: 2, label: '一般' }, { value: 3, label: '不满意' }, { value: 4, label: '非常不满意' },
        ]},
        { id: 'isi_5', text: '您的睡眠问题在多大程度上干扰了您的日间功能（如疲劳、情绪、注意力、记忆力）', options: [
          { value: 0, label: '完全无干扰' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'isi_6', text: '他人是否注意到您的睡眠问题对生活质量的负面影响', options: [
          { value: 0, label: '未注意到' }, { value: 1, label: '轻微' },
          { value: 2, label: '有些' }, { value: 3, label: '较多' }, { value: 4, label: '非常明显' },
        ]},
        { id: 'isi_7', text: '您对目前的睡眠问题感到担忧/痛苦的程度', options: [
          { value: 0, label: '完全不担心' }, { value: 1, label: '轻微' },
          { value: 2, label: '有些' }, { value: 3, label: '较多' }, { value: 4, label: '非常担心' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 7, severity: '无临床显著失眠', level: 'minimal' },
          { min: 8, max: 14, severity: '亚阈值失眠', level: 'mild' },
          { min: 15, max: 21, severity: '中度失眠', level: 'moderate' },
          { min: 22, max: 28, severity: '重度失眠', level: 'severe' },
        ],
        note: 'ISI 总分范围 0-28。≥ 8 分提示存在失眠问题，≥ 15 分提示中度以上失眠，建议寻求专业评估。',
      },
      analysis: {
        minimal: '您的 ISI 得分在正常范围内。保持规律的作息时间、睡前一小时减少屏幕使用有助于维持良好睡眠。',
        mild: '存在亚阈值失眠。建议：1) 建立固定的作息时间，即使周末也保持一致；2) 睡前进行放松活动（温水浴、阅读、正念呼吸）；3) 限制咖啡因（下午 2 点后不摄入）和酒精；4) 如持续超过一个月，可尝试 CBT-I 自助方法。',
        moderate: '中度失眠。建议：1) 寻求 CBT-I（失眠认知行为疗法）治疗——这是失眠的一线心理治疗；2) 刺激控制疗法：只在困倦时才上床，不在床上做与睡眠无关的事；3) 睡眠限制疗法：缩短卧床时间增加睡眠效率；4) 医生可能评估是否需要短期助眠药物。',
        severe: '重度失眠。请尽快就诊：1) 失眠专科或精神科评估；2) CBT-I 是首选治疗方案，严重者可联合药物治疗；3) 避免长期自行使用安眠药（可能产生依赖）；4) 评估是否存在抑郁、焦虑等共病问题。',
      },
      methods: {
        cbti: 'CBT-I（失眠认知行为疗法）：包括刺激控制、睡眠限制、认知重建、放松训练和睡眠卫生教育，是慢性失眠的一线治疗。',
        stimulus: '刺激控制疗法：只在困倦时上床，若 20 分钟未入睡则起床离开卧室，重新建立"床=睡眠"的条件反射。',
        medication: '药物治疗：非苯二氮䓬类（如唑吡坦、右佐匹克隆）和褪黑素受体激动剂（如雷美替胺）短期使用需医生指导。',
        hygiene: '睡眠卫生教育：保持卧室安静凉爽黑暗、规律运动（但避免睡前剧烈运动）、避免睡前大餐、限制午睡（≤30 分钟）。',
      },
    },

    // ===== SDS：Zung 抑郁自评量表 =====
    {
      id: 'sds',
      title: 'SDS 抑郁自评量表',
      subtitle: 'Zung Self-Rating Depression Scale',
      time: '约 5 分钟',
      desc: 'Zung 于 1965 年编制的经典抑郁自评工具，涵盖情感、躯体、精神运动性及心理 4 组症状。',
      questions: [
        { id: 'sds_1', text: '我感到情绪沮丧、郁闷', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_2', text: '我感到早上状况最好（反向）', options: [
          { value: 4, label: '没有或很少时间' }, { value: 3, label: '少部分时间' },
          { value: 2, label: '相当多时间' }, { value: 1, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_3', text: '我要哭或想哭', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_4', text: '我晚上睡眠不好', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_5', text: '我吃饭像平时一样多（反向）', options: [
          { value: 4, label: '没有或很少时间' }, { value: 3, label: '少部分时间' },
          { value: 2, label: '相当多时间' }, { value: 1, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_6', text: '我与异性亲密接触时和以往一样感觉愉快（反向）', options: [
          { value: 4, label: '没有或很少时间' }, { value: 3, label: '少部分时间' },
          { value: 2, label: '相当多时间' }, { value: 1, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_7', text: '我感到体重在减轻', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_8', text: '我有便秘的困扰', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_9', text: '我的心跳比平时快', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_10', text: '我无缘无故感到疲劳', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_11', text: '我的头脑像往常一样清楚（反向）', options: [
          { value: 4, label: '没有或很少时间' }, { value: 3, label: '少部分时间' },
          { value: 2, label: '相当多时间' }, { value: 1, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_12', text: '我做事情像平时一样不感到困难（反向）', options: [
          { value: 4, label: '没有或很少时间' }, { value: 3, label: '少部分时间' },
          { value: 2, label: '相当多时间' }, { value: 1, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_13', text: '我坐卧不安，难以保持平静', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_14', text: '我对未来抱有希望（反向）', options: [
          { value: 4, label: '没有或很少时间' }, { value: 3, label: '少部分时间' },
          { value: 2, label: '相当多时间' }, { value: 1, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_15', text: '我比平时更容易生气', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_16', text: '我觉得做决定很容易（反向）', options: [
          { value: 4, label: '没有或很少时间' }, { value: 3, label: '少部分时间' },
          { value: 2, label: '相当多时间' }, { value: 1, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_17', text: '我觉得自己是有用的、被需要的人（反向）', options: [
          { value: 4, label: '没有或很少时间' }, { value: 3, label: '少部分时间' },
          { value: 2, label: '相当多时间' }, { value: 1, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_18', text: '我的生活过得很有意思（反向）', options: [
          { value: 4, label: '没有或很少时间' }, { value: 3, label: '少部分时间' },
          { value: 2, label: '相当多时间' }, { value: 1, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_19', text: '如果我死了，别人会过得更好', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sds_20', text: '我仍然喜欢平时喜欢的东西（反向）', options: [
          { value: 4, label: '没有或很少时间' }, { value: 3, label: '少部分时间' },
          { value: 2, label: '相当多时间' }, { value: 1, label: '绝大部分或全部时间' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 20, max: 39, severity: '正常范围', level: 'minimal' },
          { min: 40, max: 47, severity: '轻度抑郁', level: 'mild' },
          { min: 48, max: 55, severity: '中度抑郁', level: 'moderate' },
          { min: 56, max: 80, severity: '重度抑郁', level: 'severe' },
        ],
        note: 'SDS 粗分范围 20-80。标准分 = 粗分 × 1.25。粗分 ≥ 40 分提示可能存在抑郁症状，建议进一步评估。第 19 题涉及自杀念头，如≥3 分请立即拨打心理援助热线 400-161-9995。',
      },
      analysis: {
        minimal: 'SDS 得分在正常范围。继续保持健康的生活方式，调节情绪与压力。',
        mild: '轻度抑郁水平。建议：1) 保持规律作息和适度运动；2) 练习正念冥想或腹式呼吸；3) 与朋友或家人保持交流；4) 如情绪持续低落超过两周，建议寻求专业帮助。',
        moderate: '中度抑郁。建议：1) 尽快预约心理咨询或精神科门诊；2) 认知行为疗法（CBT）有充分证据支持其效果；3) 医生可能评估是否需要药物治疗；4) 避免长期独处，保持基本社交。',
        severe: '重度抑郁。请立即寻求专业帮助：1) 尽快前往精神专科医院就诊；2) 药物联合心理治疗是最有效的方案；3) 如出现自杀想法，请立即拨打 120 或心理援助热线 400-161-9995。',
      },
      methods: {
        cbt: '认知行为疗法（CBT）：识别和重构负面思维模式，配合行为激活，是抑郁症一线心理治疗。',
        act: '接纳承诺疗法（ACT）：学会与负面情绪和想法共处，减少经验性回避，按照价值方向行动。',
        medication: '药物治疗：SSRI 类（如氟西汀、帕罗西汀、舍曲林、艾司西酞普兰）是临床一线用药，需医生处方。',
        exercise: '运动疗法：有氧运动（快走、慢跑、游泳）每周 3-5 次，每次 30-45 分钟，可有效改善轻中度抑郁。',
      },
    },

    // ===== BDI：贝克抑郁量表 =====
    {
      id: 'bdi',
      title: 'BDI 贝克抑郁量表',
      subtitle: 'Beck Depression Inventory',
      time: '约 5 分钟',
      desc: 'Beck 于 1961 年编制的经典抑郁自评量表，涵盖情感、认知、动机和躯体症状。',
      questions: [
        { id: 'bdi_1', text: '悲伤', options: [
          { value: 0, label: '我不感到悲伤' }, { value: 1, label: '我感到悲伤' },
          { value: 2, label: '我一直感到悲伤，无法摆脱' }, { value: 3, label: '我极度悲伤，无法忍受' },
        ]},
        { id: 'bdi_2', text: '悲观', options: [
          { value: 0, label: '我对未来不感到气馁' }, { value: 1, label: '我对未来比以往更感到气馁' },
          { value: 2, label: '我感到没有什么值得期待的' }, { value: 3, label: '我觉得未来无望，情况无法改善' },
        ]},
        { id: 'bdi_3', text: '失败感', options: [
          { value: 0, label: '我不觉得自己是失败者' }, { value: 1, label: '我觉得自己比一般人更容易失败' },
          { value: 2, label: '回顾我的人生，我看到的是失败' }, { value: 3, label: '我觉得自己是一个彻底失败的人' },
        ]},
        { id: 'bdi_4', text: '失去愉悦', options: [
          { value: 0, label: '我像以往一样从事物中获得满足' }, { value: 1, label: '我不像以往那样享受事物' },
          { value: 2, label: '我从任何事物中都无法获得真正的满足' }, { value: 3, label: '我感到不满或厌倦一切' },
        ]},
        { id: 'bdi_5', text: '内疚感', options: [
          { value: 0, label: '我不特别感到内疚' }, { value: 1, label: '我在很多时间里感到内疚' },
          { value: 2, label: '我在大部分时间里感到内疚' }, { value: 3, label: '我一直感到内疚' },
        ]},
        { id: 'bdi_6', text: '惩罚感', options: [
          { value: 0, label: '我不觉得我正受到惩罚' }, { value: 1, label: '我觉得我可能会受到惩罚' },
          { value: 2, label: '我期望受到惩罚' }, { value: 3, label: '我觉得我正受到惩罚' },
        ]},
        { id: 'bdi_7', text: '自我失望', options: [
          { value: 0, label: '我对自己感到失望' }, { value: 1, label: '我对自己感到失望' },
          { value: 2, label: '我讨厌自己' }, { value: 3, label: '我恨自己' },
        ]},
        { id: 'bdi_8', text: '自我批评', options: [
          { value: 0, label: '我不觉得自己比别人差' }, { value: 1, label: '我批评自己的弱点和错误' },
          { value: 2, label: '我总是因自己的错误而责备自己' }, { value: 3, label: '我为发生的一切坏事责备自己' },
        ]},
        { id: 'bdi_9', text: '自杀念头', options: [
          { value: 0, label: '我没有任何自杀的念头' }, { value: 1, label: '我有自杀的念头但不会去做' },
          { value: 2, label: '我想自杀' }, { value: 3, label: '如果有机会我会自杀' },
        ]},
        { id: 'bdi_10', text: '哭泣', options: [
          { value: 0, label: '我不比以往更爱哭' }, { value: 1, label: '我比以往更爱哭' },
          { value: 2, label: '我经常哭' }, { value: 3, label: '我一直想哭但哭不出来' },
        ]},
        { id: 'bdi_11', text: '烦躁', options: [
          { value: 0, label: '我不比以往更烦躁' }, { value: 1, label: '我比以往更容易烦躁' },
          { value: 2, label: '我一直很烦躁' }, { value: 3, label: '任何事都让我烦躁' },
        ]},
        { id: 'bdi_12', text: '失去兴趣', options: [
          { value: 0, label: '我对他人没有失去兴趣' }, { value: 1, label: '我对他人的兴趣比以往少了' },
          { value: 2, label: '我对他人的兴趣大部分都失去了' }, { value: 3, label: '我对他人失去了全部兴趣' },
        ]},
        { id: 'bdi_13', text: '犹豫不决', options: [
          { value: 0, label: '我做决定和以往一样好' }, { value: 1, label: '我推迟做决定' },
          { value: 2, label: '我做决定比以往更困难' }, { value: 3, label: '我再也做不了任何决定' },
        ]},
        { id: 'bdi_14', text: '无价值感', options: [
          { value: 0, label: '我不觉得自己没有价值' }, { value: 1, label: '我不像以往那样觉得自己有价值' },
          { value: 2, label: '我比以往更觉得自己没有价值' }, { value: 3, label: '我完全没有价值' },
        ]},
        { id: 'bdi_15', text: '精力丧失', options: [
          { value: 0, label: '我的精力和以往一样' }, { value: 1, label: '我的精力不如以往' },
          { value: 2, label: '我没有足够的精力做任何事' }, { value: 3, label: '我没有精力做任何事' },
        ]},
        { id: 'bdi_16', text: '睡眠变化', options: [
          { value: 0, label: '我的睡眠和以往一样好' }, { value: 1, label: '我睡得不如以往好' },
          { value: 2, label: '我比平时早醒 1-2 小时' }, { value: 3, label: '我比平时早醒 2 小时以上' },
        ]},
        { id: 'bdi_17', text: '易怒', options: [
          { value: 0, label: '我不比以往更容易累' }, { value: 1, label: '我比以往更容易累' },
          { value: 2, label: '几乎任何事都让我累' }, { value: 3, label: '我太累了无法做任何事' },
        ]},
        { id: 'bdi_18', text: '食欲变化', options: [
          { value: 0, label: '我的食欲和以往一样' }, { value: 1, label: '我的食欲不如以往' },
          { value: 2, label: '我的食欲比以往差很多' }, { value: 3, label: '我完全没有食欲' },
        ]},
        { id: 'bdi_19', text: '体重变化', options: [
          { value: 0, label: '最近我的体重没有明显变化' }, { value: 1, label: '我体重减轻超过 2.5 公斤' },
          { value: 2, label: '我体重减轻超过 5 公斤' }, { value: 3, label: '我体重减轻超过 7.5 公斤' },
        ]},
        { id: 'bdi_20', text: '健康担忧', options: [
          { value: 0, label: '我不比以往更担心我的健康' }, { value: 1, label: '我担心身体问题如疼痛、胃部不适等' },
          { value: 2, label: '我非常担心身体问题' }, { value: 3, label: '我非常担心身体问题，无法想其他事' },
        ]},
        { id: 'bdi_21', text: '性兴趣丧失', options: [
          { value: 0, label: '我对性的兴趣最近没有变化' }, { value: 1, label: '我对性的兴趣比以往减少' },
          { value: 2, label: '我对性的兴趣大幅减少' }, { value: 3, label: '我完全失去了对性的兴趣' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 13, severity: '正常或轻微抑郁', level: 'minimal' },
          { min: 14, max: 19, severity: '轻度抑郁', level: 'mild' },
          { min: 20, max: 28, severity: '中度抑郁', level: 'moderate' },
          { min: 29, max: 63, severity: '重度抑郁', level: 'severe' },
        ],
        note: 'BDI 总分范围 0-63。总分 ≥ 14 分提示可能存在抑郁症状。第 9 题≥1 分表示存在自杀风险，请立即拨打心理援助热线 400-161-9995。',
      },
      analysis: {
        minimal: 'BDI 得分在正常范围。保持规律作息和适当运动，定期关注自己的情绪状态。',
        mild: '轻度抑郁水平。建议：1) 规律作息和适度有氧运动；2) 正念冥想或腹式呼吸练习；3) 与信任的人保持交流；4) 如持续超过两周，建议心理咨询。',
        moderate: '中度抑郁。建议：1) 尽快预约心理咨询或精神科门诊；2) CBT 是抑郁症一线心理治疗；3) 医生可能会评估是否需要抗抑郁药物；4) 建立日常结构，避免社交孤立。',
        severe: '重度抑郁。请立即寻求专业帮助：1) 尽快前往精神专科医院；2) 药物与心理治疗联合是最有效方案；3) 如出现自杀念头，请拨打 120 或心理援助热线 400-161-9995。',
      },
      methods: {
        cbt: '认知行为疗法（CBT）：识别和重构负面思维，行为激活改善情绪。',
        act: '接纳承诺疗法（ACT）：与负面想法解离，按价值方向行动。',
        medication: '药物治疗：SSRI（氟西汀、舍曲林、艾司西酞普兰）是一线药物。',
        exercise: '运动疗法：有氧运动每周 3-5 次，每次 30 分钟，可改善轻中度抑郁。',
      },
    },

    // ===== 认知扭曲检查表 =====
    {
      id: 'cdc',
      title: '认知扭曲检查表',
      subtitle: 'Cognitive Distortions Checklist',
      time: '约 3 分钟',
      desc: '识别自动化思维中的 10 种常见认知扭曲模式，是认知行为疗法（CBT）的核心自我觉察工具。',
      questions: [
        { id: 'cdc_1', text: '非黑即白思维：事情只有"完美"和"彻底失败"两种极端，没有中间地带', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cdc_2', text: '过度概括：因为一件坏事发生，就认为它会一直重复发生', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cdc_3', text: '心理过滤：只关注负面细节，忽略了所有正面之处', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cdc_4', text: '否定正面体验：拒绝接受正面经历，认为"这不算数"或"任何人都能做到"', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cdc_5', text: '妄下结论：在没有充分证据时做负面推断（包括读心术和算命式推理）', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cdc_6', text: '夸大/贬低：夸大问题的严重性（灾难化），或贬低自己的优点和成就', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cdc_7', text: '情绪化推理：因为"感觉"糟糕，就认定现实也是如此糟糕', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cdc_8', text: '"应该"陈述：对自己或他人使用"应该""必须""应当"来鞭策或要求', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cdc_9', text: '贴标签：用"我是个失败者""他很差劲"等标签替代客观描述', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cdc_10', text: '个人化和归咎：将不属于自己的责任归咎于自己，或将问题全部推给他人', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 10, severity: '认知扭曲较少', level: 'minimal' },
          { min: 11, max: 20, severity: '轻度认知扭曲', level: 'mild' },
          { min: 21, max: 30, severity: '中度认知扭曲', level: 'moderate' },
          { min: 31, max: 40, severity: '重度认知扭曲', level: 'severe' },
        ],
        note: '总分范围 0-40。分数越高表示越频繁使用认知扭曲。每个扭曲维度独立查看，最高的 2-3 项可作为 CBT 认知重建的重点干预目标。',
      },
      analysis: {
        minimal: '您的认知扭曲使用频率较低。继续保持健康的思维习惯，定期自我觉察有助于预防情绪问题。',
        mild: '轻度认知扭曲。建议：1) 记录每周出现最频繁的 2-3 种扭曲类型；2) 学习"思维记录表"（Thought Record）识别自动化思维；3) 练习用更平衡客观的替代思维回应扭曲；4) 正念冥想有助于培养对思维的觉察而不陷入其中。',
        moderate: '中度认知扭曲。建议：1) 认知行为疗法（CBT）是解决认知扭曲最有效的方法；2) 每天使用思维记录表追踪最突出的扭曲模式；3) 学习苏格拉底式提问挑战自动化思维；4) 建议寻求 CBT 取向心理咨询师的专业帮助。',
        severe: '重度认知扭曲。建议：1) 尽快寻求 CBT 取向的心理治疗；2) 这些扭曲模式可能是抑郁或焦虑的重要维持因素；3) 学习认知重建技术，逐步替代扭曲的自动化思维；4) 建议同时评估是否存在抑郁或焦虑障碍，以获得综合治疗。',
      },
      methods: {
        thoughtRecord: '思维记录表（Thought Record）：记录情境→自动化思维→认知扭曲类型→替代思维，是 CBT 的核心工具。',
        socratic: '苏格拉底式提问：用"证据是什么？""有没有其他可能的解释？""最坏的结果是什么？我能应对吗？"来挑战扭曲思维。',
        decatastrophizing: '去灾难化（What-if 技术）：将"万一…"的恐惧具体化，制定应对计划，打破灾难化思维循环。',
        exposure: '行为实验：设计小实验来检验扭曲想法的真实性，用实际体验替代猜测。',
      },
    },

    // ===== 伯恩斯抑郁自评量表 =====
    {
      id: 'burns-depression',
      title: '伯恩斯抑郁自评量表',
      subtitle: 'Burns Depression Checklist',
      time: '约 5 分钟',
      desc: 'David D. Burns 编制的抑郁症状清单，涵盖情绪、认知、动机、躯体 4 个维度共 25 项。',
      questions: [
        { id: 'bdc_1', text: '感到悲伤、情绪低落', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_2', text: '对未来感到气馁或绝望', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_3', text: '自我价值感低', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_4', text: '感到不如别人或能力不足', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_5', text: '感到内疚，或对自己不满', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_6', text: '对自己感到失望', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_7', text: '对自己过于苛刻或自责', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_8', text: '难以做决定', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_9', text: '对他人失去兴趣', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_10', text: '对生活失去兴趣', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_11', text: '缺乏动力或做事吃力', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_12', text: '感到不堪重负、压力过大', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_13', text: '难以集中注意力', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_14', text: '精力不足、感到疲倦', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_15', text: '对以往喜欢的活动失去快乐', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_16', text: '自怜自艾', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_17', text: '容易流泪或想哭', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_18', text: '觉得生活没有意义', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_19', text: '有自杀想法或觉得死了更好', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_20', text: '感到被困住或无法改变现状', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_21', text: '睡得过多或很难醒来', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_22', text: '入睡困难或半夜醒来', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_23', text: '食欲发生变化（增加或减少）', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_24', text: '体重明显变化（增加或减少）', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bdc_25', text: '过度关注身体不适或健康问题', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 10, severity: '正常范围', level: 'minimal' },
          { min: 11, max: 25, severity: '轻度抑郁', level: 'mild' },
          { min: 26, max: 40, severity: '中度抑郁', level: 'moderate' },
          { min: 41, max: 55, severity: '中重度抑郁', level: 'moderately-severe' },
          { min: 56, max: 75, severity: '重度抑郁', level: 'severe' },
        ],
        note: '伯恩斯抑郁自评量表总分范围 0-75。≥ 11 分提示可能存在轻度抑郁，≥ 26 分提示中度及以上。第 19 题（自杀想法）≥ 1 分需立即关注，请拨打心理援助热线 400-161-9995。',
      },
      analysis: {
        minimal: '伯恩斯抑郁评分在正常范围内。保持规律的作息、适度的运动和社交活动有助于维持心理健康。',
        mild: '轻度抑郁水平。建议：1) 保持规律作息和适度有氧运动；2) 练习正念冥想或记感恩日记；3) 与信任的人保持交流；4) 尝试行为激活（多做曾经带来快乐的事情）；5) 如持续超过两周，建议心理咨询。',
        moderate: '中度抑郁。建议：1) 尽快预约心理咨询或精神科门诊；2) 认知行为疗法（CBT）和行为激活对中度抑郁有良好效果；3) 医生可能评估是否需要抗抑郁药物；4) 建立日常结构，避免社交孤立。',
        'moderately-severe': '中重度抑郁。请尽快寻求专业帮助：1) 精神科医生评估是必要的；2) 药物与心理治疗联合是最有效方案；3) 增加日常活动量，从最小目标开始；4) 如出现自杀念头，请立即拨打 400-161-9995。',
        severe: '重度抑郁。需要立即干预：1) 请尽快前往精神专科医院就诊；2) 药物治疗是必要的；3) 需要专业心理治疗与药物联合干预；4) 如出现自杀想法或计划，请立即拨打 120 或心理援助热线 400-161-9995。',
      },
      methods: {
        cbt: '认知行为疗法（CBT）：识别和重构负面思维，配合行为激活改善情绪。',
        act: '接纳承诺疗法（ACT）：与负面想法解离，按价值方向行动。',
        ba: '行为激活：通过逐步增加有意义的活动来改善情绪，是治疗抑郁症的核心行为技术。',
        medication: '药物治疗：SSRI 类（如氟西汀、舍曲林、艾司西酞普兰）是一线药物，需精神科医生处方。',
        exercise: '运动疗法：有氧运动每周 3-5 次，每次 30 分钟，可有效改善轻中度抑郁。',
      },
    },
    // ===== HAMD-17：汉密尔顿抑郁量表 =====
    {
      id: 'hamd',
      title: 'HAMD 汉密尔顿抑郁量表',
      subtitle: 'Hamilton Depression Rating Scale-17',
      time: '约 8 分钟',
      desc: '经典的抑郁严重程度评估工具，涵盖情绪、躯体、认知等 17 个维度，广泛用于临床评估和疗效监测。',
      questions: [
        { id: 'hamd_1', text: '抑郁情绪（感到悲伤、绝望、无助、无价值）', options: [
          { value: 0, label: '无' }, { value: 1, label: '仅在询问时才表达' },
          { value: 2, label: '主动表达抑郁情绪' }, { value: 3, label: '非语言也传达抑郁（表情、姿势、声音）' }, { value: 4, label: '几乎完全沉浸在抑郁情绪中' },
        ]},
        { id: 'hamd_2', text: '内疚感', options: [
          { value: 0, label: '无' }, { value: 1, label: '自我责备，认为自己连累了他人' },
          { value: 2, label: '有内疚想法或反复思考过去的错误' }, { value: 3, label: '认为当前的疾病是对自己的惩罚' }, { value: 4, label: '有罪恶妄想或指责性幻听' },
        ]},
        { id: 'hamd_3', text: '自杀倾向', options: [
          { value: 0, label: '无' }, { value: 1, label: '觉得活着没有意义' },
          { value: 2, label: '希望自己已经死了，或有任何自杀想法' }, { value: 3, label: '有自杀念头或姿态' }, { value: 4, label: '有自杀企图' },
        ]},
        { id: 'hamd_4', text: '入睡困难（在最近一周内）', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '偶尔入睡困难（超过半小时）' },
          { value: 2, label: '每晚都有入睡困难' },
        ]},
        { id: 'hamd_5', text: '睡眠浅或中途觉醒', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '夜间不安或睡眠浅' },
          { value: 2, label: '夜间醒来（任何原因导致的起床，上厕所除外）' },
        ]},
        { id: 'hamd_6', text: '早醒（比平时早醒 1 小时以上）', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '早上醒来但能再入睡' },
          { value: 2, label: '早上醒来后无法再入睡' },
        ]},
        { id: 'hamd_7', text: '工作和兴趣', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '感到无能力、疲倦或对活动兴趣下降' },
          { value: 2, label: '对日常活动（工作、爱好）失去兴趣' }, { value: 3, label: '活动时间减少或工作效率下降' }, { value: 4, label: '因疾病停止工作' },
        ]},
        { id: 'hamd_8', text: '迟滞（思维和言语缓慢，注意力难以集中）', options: [
          { value: 0, label: '正常语速和思维' }, { value: 1, label: '交谈时稍迟缓' },
          { value: 2, label: '交谈明显迟缓' }, { value: 3, label: '交谈困难' }, { value: 4, label: '完全木僵' },
        ]},
        { id: 'hamd_9', text: '激越（坐立不安、来回走动、搓手等）', options: [
          { value: 0, label: '无' }, { value: 1, label: '坐立不安' },
          { value: 2, label: '手脚不停、拉扯衣服等' }, { value: 3, label: '在房间来回走动' }, { value: 4, label: '搓手、咬指甲、扯头发等' },
        ]},
        { id: 'hamd_10', text: '精神性焦虑（紧张、担忧、恐惧、易怒）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '严重（几乎一直处于恐惧状态）' },
        ]},
        { id: 'hamd_11', text: '躯体性焦虑（心慌、口干、胃部不适、出汗、发抖等）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '严重（影响日常生活）' },
        ]},
        { id: 'hamd_12', text: '胃肠道症状（食欲不振、需要通便药）', options: [
          { value: 0, label: '无' }, { value: 1, label: '食欲减退但能正常进食' },
          { value: 2, label: '需督促才能进食或需通便药物' },
        ]},
        { id: 'hamd_13', text: '全身症状（四肢沉重、背痛、头痛、肌肉酸痛、乏力）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度全身症状' },
          { value: 2, label: '重度或频繁的全身症状' },
        ]},
        { id: 'hamd_14', text: '性症状（性欲减退或月经紊乱）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度性欲减退' },
          { value: 2, label: '严重性欲丧失' },
        ]},
        { id: 'hamd_15', text: '疑病（对身体健康的过分关注）', options: [
          { value: 0, label: '无' }, { value: 1, label: '过度关注身体' },
          { value: 2, label: '坚信有病但可被说服' }, { value: 3, label: '坚信有病且无法被说服' }, { value: 4, label: '疑病妄想' },
        ]},
        { id: 'hamd_16', text: '体重减轻', options: [
          { value: 0, label: '无' }, { value: 1, label: '可能因疾病体重减轻' },
          { value: 2, label: '明确体重减轻' },
        ]},
        { id: 'hamd_17', text: '自知力（对自己抑郁状态的认识程度）', options: [
          { value: 0, label: '认识到自己抑郁或有病' }, { value: 1, label: '认识到有病但归因于其他原因' },
          { value: 2, label: '完全否认有病' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 7, severity: '正常范围', level: 'minimal' },
          { min: 8, max: 13, severity: '轻度抑郁', level: 'mild' },
          { min: 14, max: 18, severity: '中度抑郁', level: 'moderate' },
          { min: 19, max: 22, severity: '中重度抑郁', level: 'moderately-severe' },
          { min: 23, max: 52, severity: '重度抑郁', level: 'severe' },
        ],
        note: 'HAMD-17 总分范围 0-52。≥ 8 分提示可能存在抑郁，≥ 14 分提示中度抑郁，建议精神科评估。第 3 题（自杀倾向）≥ 2 分需立即关注，请拨打心理援助热线 400-161-9995。',
      },
      analysis: {
        minimal: 'HAMD 得分在正常范围。您的情绪状态良好，建议保持规律作息和健康生活方式。',
        mild: '轻度抑郁水平。建议：1) 规律作息和适度有氧运动；2) 正念冥想或腹式呼吸练习；3) 与信任的人保持交流；4) 如持续超过两周，建议心理咨询。',
        moderate: '中度抑郁。建议：1) 尽快预约精神科门诊进行全面评估；2) 药物治疗与心理治疗联合是常用方案；3) 认知行为疗法（CBT）有充分证据支持；4) 建立日常结构，避免社交孤立。',
        'moderately-severe': '中重度抑郁。请尽快寻求专业帮助：1) 精神科医生评估是必要的；2) 通常需要药物治疗与心理治疗联合；3) 增加日常活动量，从最小目标开始；4) 如出现自杀念头，请立即拨打 400-161-9995。',
        severe: '重度抑郁。需要立即干预：1) 请尽快前往精神专科医院就诊；2) 药物治疗是必要的；3) 需要专业心理治疗与药物联合干预；4) 如出现自杀想法或计划，请立即拨打 120 或心理援助热线 400-161-9995。',
      },
      methods: {
        cbt: '认知行为疗法（CBT）：识别和重构负面思维模式，配合行为激活改善情绪。',
        medication: '药物治疗：SSRI 类（氟西汀、舍曲林、艾司西酞普兰）是一线抗抑郁药物，需精神科医生处方。',
        ipt: '人际关系疗法（IPT）：聚焦于改善人际关系问题，对抑郁症状有显著效果。',
        exercise: '运动疗法：有氧运动每周 3-5 次，每次 30-45 分钟，可有效改善轻中度抑郁。',
      },
    },

    // ===== GDS：老年抑郁量表 =====
    {
      id: 'gds',
      title: 'GDS 老年抑郁量表',
      subtitle: 'Geriatric Depression Scale-30',
      time: '约 5 分钟',
      desc: '专为老年人设计的抑郁筛查工具，采用是否判断题，避免复杂的李克特量表，适合认知功能可能下降的老年人群。',
      questions: [
        { id: 'gds_1', text: '你对你的生活基本上满意吗？（反向）', options: [
          { value: 1, label: '否' }, { value: 0, label: '是' },
        ]},
        { id: 'gds_2', text: '你是否放弃了很多活动和兴趣？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_3', text: '你是否觉得生活很空虚？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_4', text: '你是否经常感到无聊？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_5', text: '你对未来充满希望吗？（反向）', options: [
          { value: 1, label: '否' }, { value: 0, label: '是' },
        ]},
        { id: 'gds_6', text: '你是否被无法摆脱的想法所困扰？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_7', text: '你大多数时候精神好吗？（反向）', options: [
          { value: 1, label: '否' }, { value: 0, label: '是' },
        ]},
        { id: 'gds_8', text: '你是否害怕会发生不好的事情？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_9', text: '你大多数时候感到快乐吗？（反向）', options: [
          { value: 1, label: '否' }, { value: 0, label: '是' },
        ]},
        { id: 'gds_10', text: '你是否经常感到无助？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_11', text: '你是否经常坐立不安、无法安静？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_12', text: '你是否宁愿待在家里而不愿出去做新的事情？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_13', text: '你是否经常担心未来？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_14', text: '你是否觉得记忆力比大多数人差？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_15', text: '你认为现在的生活很美好吗？（反向）', options: [
          { value: 1, label: '否' }, { value: 0, label: '是' },
        ]},
        { id: 'gds_16', text: '你是否经常感到情绪低落？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_17', text: '你是否觉得现在的生活很没有价值？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_18', text: '你是否非常担心过去的事情？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_19', text: '你觉得生活很令人兴奋吗？（反向）', options: [
          { value: 1, label: '否' }, { value: 0, label: '是' },
        ]},
        { id: 'gds_20', text: '你是否觉得开始做新的事情很困难？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_21', text: '你觉得自己精力充沛吗？（反向）', options: [
          { value: 1, label: '否' }, { value: 0, label: '是' },
        ]},
        { id: 'gds_22', text: '你是否觉得自己的处境没有希望？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_23', text: '你是否觉得大多数人比你过得好？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_24', text: '你是否经常因小事而伤心？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_25', text: '你是否经常感到想哭？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_26', text: '你是否难以集中注意力？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_27', text: '你早上起床时感觉好吗？（反向）', options: [
          { value: 1, label: '否' }, { value: 0, label: '是' },
        ]},
        { id: 'gds_28', text: '你是否避免参加社交活动？', options: [
          { value: 1, label: '是' }, { value: 0, label: '否' },
        ]},
        { id: 'gds_29', text: '你做决定容易吗？（反向）', options: [
          { value: 1, label: '否' }, { value: 0, label: '是' },
        ]},
        { id: 'gds_30', text: '你的思维和以前一样清晰吗？（反向）', options: [
          { value: 1, label: '否' }, { value: 0, label: '是' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 9, severity: '正常范围', level: 'minimal' },
          { min: 10, max: 19, severity: '轻度抑郁', level: 'mild' },
          { min: 20, max: 30, severity: '重度抑郁', level: 'severe' },
        ],
        note: 'GDS 总分范围 0-30。≥ 10 分提示可能存在抑郁症状，≥ 20 分提示重度抑郁。GDS 专为老年人设计，使用是否判断题降低了认知负荷。',
      },
      analysis: {
        minimal: 'GDS 得分在正常范围。保持社交活动、规律作息和适当运动对维持老年人心理健康非常重要。',
        mild: '轻度抑郁水平。建议：1) 鼓励参加社区活动和社交聚会；2) 保持日常作息和适度运动（如散步、太极）；3) 关注躯体疾病对情绪的影响；4) 如持续超过两周，建议心理科或老年科就诊。',
        severe: '重度抑郁水平。请尽快寻求专业帮助：1) 老年精神科或心理科全面评估；2) 药物治疗（SSRI 类在老年人中需注意药物相互作用）；3) 认知行为疗法（CBT）对老年抑郁同样有效；4) 关注营养状况和躯体共病问题。',
      },
      methods: {
        cbt: '认知行为疗法（CBT）：调整与衰老、健康、孤独相关的负面思维，增加行为激活。',
        medication: '药物治疗：SSRI（舍曲林、艾司西酞普兰）在老年人中相对安全，需关注药物相互作用。',
        social: '社交促进：鼓励参与社区活动、老年大学、志愿服务等，减少社交隔离。',
        exercise: '运动干预：太极、散步、广场舞等低强度有氧运动可显著改善老年抑郁症状。',
      },
    },

    // ===== DAS：功能失调性态度量表（40题完整版） =====
    {
      id: 'das',
      title: 'DAS 功能失调性态度量表',
      subtitle: 'Dysfunctional Attitude Scale-A',
      time: '约 15 分钟',
      desc: '基于 Beck 认知理论的经典量表，评估 7 个维度的功能失调性信念：完美主义、寻求认可、脆弱感、取悦他人、强制性信念、寻求赞赏、依赖性。总分越高功能失调信念越强。',
      questions: [
        { id: 'das_1', text: '如果我不能做到最好，我就不值得被尊重。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_2', text: '犯错误是可以接受的，因为每个人都会犯错。（反）', options: [
          { value: 1, label: '完全同意' }, { value: 2, label: '很同意' },
          { value: 3, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 5, label: '稍不同意' }, { value: 6, label: '很不同意' }, { value: 7, label: '完全不同意' },
        ]},
        { id: 'das_3', text: '如果别人批评我，说明我一无是处。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_4', text: '我必须得到身边所有人的认可才能感到快乐。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_5', text: '如果我在重要的事情上失败了，我就是一个彻底的失败者。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_6', text: '不需要别人称赞，我也能对自己的成就感到满意。（反）', options: [
          { value: 1, label: '完全同意' }, { value: 2, label: '很同意' },
          { value: 3, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 5, label: '稍不同意' }, { value: 6, label: '很不同意' }, { value: 7, label: '完全不同意' },
        ]},
        { id: 'das_7', text: '我的价值在很大程度上取决于别人怎么看我。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_8', text: '如果一个人有才能，就应该在任何领域都表现优秀。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_9', text: '有时不把事情做到完美也是可以接受的。（反）', options: [
          { value: 1, label: '完全同意' }, { value: 2, label: '很同意' },
          { value: 3, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 5, label: '稍不同意' }, { value: 6, label: '很不同意' }, { value: 7, label: '完全不同意' },
        ]},
        { id: 'das_10', text: '如果我在社交场合中说错话，那将是灾难性的。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_11', text: '我需要比别人更优秀才能获得自我价值感。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_12', text: '即使没有恋爱关系，我也可以过得很快乐。（反）', options: [
          { value: 1, label: '完全同意' }, { value: 2, label: '很同意' },
          { value: 3, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 5, label: '稍不同意' }, { value: 6, label: '很不同意' }, { value: 7, label: '完全不同意' },
        ]},
        { id: 'das_13', text: '我应该总是尽力取悦他人，即使牺牲自己的需求。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_14', text: '如果我没有达到自己设定的标准，就证明我不够好。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_15', text: '我的幸福感取决于我是否被他人接纳。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_16', text: '即使没有人赞同我，我也可以坚持自己的决定。（反）', options: [
          { value: 1, label: '完全同意' }, { value: 2, label: '很同意' },
          { value: 3, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 5, label: '稍不同意' }, { value: 6, label: '很不同意' }, { value: 7, label: '完全不同意' },
        ]},
        { id: 'das_17', text: '如果别人发现我的缺点，他们就不会再喜欢我。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_18', text: '我不能容忍自己犯任何错误。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_19', text: '如果我向别人求助，就说明我是弱者。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_20', text: '有些问题不需要立即解决也可以接受。（反）', options: [
          { value: 1, label: '完全同意' }, { value: 2, label: '很同意' },
          { value: 3, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 5, label: '稍不同意' }, { value: 6, label: '很不同意' }, { value: 7, label: '完全不同意' },
        ]},
        { id: 'das_21', text: '我的价值完全取决于我的成就和表现。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_22', text: '如果我是主动向别人打招呼的人，会很没面子。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_23', text: '如果我不完美，别人就不会接纳我。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_24', text: '我必须时刻控制自己的情绪才算强者。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_25', text: '即使不是所有问题都有答案，生活也可以很好。（反）', options: [
          { value: 1, label: '完全同意' }, { value: 2, label: '很同意' },
          { value: 3, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 5, label: '稍不同意' }, { value: 6, label: '很不同意' }, { value: 7, label: '完全不同意' },
        ]},
        { id: 'das_26', text: '如果我让别人失望了，一切就都完了。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_27', text: '我应该能够轻松应对所有挑战。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_28', text: '如果我不比别人好，就说明我很差劲。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_29', text: '即使被批评，也不代表我是一个失败的人。（反）', options: [
          { value: 1, label: '完全同意' }, { value: 2, label: '很同意' },
          { value: 3, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 5, label: '稍不同意' }, { value: 6, label: '很不同意' }, { value: 7, label: '完全不同意' },
        ]},
        { id: 'das_30', text: '如果我不能每次都成功，我就会让别人失望。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_31', text: '任何问题的解决都应该有完美的方案。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_32', text: '如果我的表现没有获得认可，那就是失败。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_33', text: '感到悲伤或焦虑是正常的情绪反应。（反）', options: [
          { value: 1, label: '完全同意' }, { value: 2, label: '很同意' },
          { value: 3, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 5, label: '稍不同意' }, { value: 6, label: '很不同意' }, { value: 7, label: '完全不同意' },
        ]},
        { id: 'das_34', text: '我必须不断证明自己的价值才能被社会接纳。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_35', text: '如果我没有每天都有所成就，我就虚度了光阴。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_36', text: '我的价值与我的工作表现直接相关。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_37', text: '即使不被所有人喜欢，我也可以幸福。（反）', options: [
          { value: 1, label: '完全同意' }, { value: 2, label: '很同意' },
          { value: 3, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 5, label: '稍不同意' }, { value: 6, label: '很不同意' }, { value: 7, label: '完全不同意' },
        ]},
        { id: 'das_38', text: '如果我拒绝了别人，我会感到非常内疚。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_39', text: '任何问题都有解决方案，我必须找到它。', options: [
          { value: 7, label: '完全同意' }, { value: 6, label: '很同意' },
          { value: 5, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 3, label: '稍不同意' }, { value: 2, label: '很不同意' }, { value: 1, label: '完全不同意' },
        ]},
        { id: 'das_40', text: '请求帮助是正常且可接受的行为。（反）', options: [
          { value: 1, label: '完全同意' }, { value: 2, label: '很同意' },
          { value: 3, label: '稍同意' }, { value: 4, label: '中立' },
          { value: 5, label: '稍不同意' }, { value: 6, label: '很不同意' }, { value: 7, label: '完全不同意' },
        ]},
      ],
      dimensions: [
        {
          id: 'perfectionism',
          name: '完美主义/绩效评价',
          items: [0, 2, 4, 7, 10, 13, 17, 20, 25, 26, 27, 29, 30, 33, 34, 35, 38],
          desc: '对成就和完美的严格要求，认为任何失败或不足都意味着个人价值的丧失',
        },
        {
          id: 'approval',
          name: '寻求认可',
          items: [3, 6, 9, 14, 15, 16, 21, 22, 28, 31, 36],
          desc: '过度依赖他人的评价和认可来维持自我价值感，害怕被拒绝或否定',
        },
        {
          id: 'dependency',
          name: '脆弱感/依赖性',
          items: [1, 5, 8, 11, 12, 18, 19, 23, 24, 32, 37, 39],
          desc: '对自身应对能力的怀疑，认为必须依赖他人或控制一切才能应对困难',
        },
      ],
      scoring: {
        ranges: [
          { min: 40, max: 119, severity: '功能失调信念较少', level: 'minimal' },
          { min: 120, max: 179, severity: '轻度功能失调信念', level: 'mild' },
          { min: 180, max: 219, severity: '中度功能失调信念', level: 'moderate' },
          { min: 220, max: 280, severity: '重度功能失调信念', level: 'severe' },
        ],
        note: 'DAS-A 总分范围 40-280。≥ 120 分提示存在功能失调性信念。第2、6、9、12、16、20、25、29、33、37、40 题为反向计分（已预置反向分值）。各维度参考：第1/3/5/8/18/28/31/34/36 反映完美主义，第4/7/11/15/17/22/23/32 反映寻求认可，第10/13/14/19/24/26/27/30/35/38/39 反映脆弱感/强制性信念/依赖性。≥ 180 分建议寻求认知行为治疗。',
      },
      analysis: {
        minimal: '您的 DAS 得分在正常范围，表明没有明显的功能失调性信念。您能够灵活看待自己和他人，具有健康的认知模式。建议保持正念觉知和积极的生活方式，持续维护心理健康。',
        mild: '轻度功能失调性信念水平。建议：1) 关注最常出现的自动化思维模式（如"必须""应该"类绝对化语言）；2) 练习认知重构，挑战非理性信念；3) 正念冥想帮助识别和接纳内在信念；4) 阅读认知行为疗法自助读物。',
        moderate: '中度功能失调性信念水平，可能存在抑郁认知易感性。建议：1) 尽快寻求 CBT（认知行为疗法）专业治疗；2) 系统学习识别和重构核心信念（图式疗法可能有帮助）；3) 记录思维日记，追踪功能失调性信念与情绪波动的关系；4) 结合行为实验验证负面预测。',
        severe: '重度功能失调性信念水平，提示存在显著的抑郁认知易感性。请尽快寻求专业帮助：1) 精神科医生进行全面评估，排除抑郁或焦虑障碍；2) 长期认知行为治疗或图式疗法是必要的；3) 可能需要药物联合治疗以改善认知僵化；4) 建立支持网络，避免社会退缩。',
      },
      methods: {
        cbt: '认知行为疗法（CBT）：通过认知重构识别和挑战功能失调性信念，是改变核心信念的一线心理治疗。',
        schema: '图式疗法：针对深层的早期适应不良图式进行长期治疗，结合认知、体验和行为技术。',
        mindfulness: '正念认知疗法（MBCT）：培养对自动化思维的觉察能力，学会与负面信念解离而非认同。',
        behavioral: '行为实验：设计小实验检验负面预测的有效性，通过实际经验修正功能失调性信念。',
        medication: '药物治疗：SSRI/SNRI 抗抑郁药可改善情绪状态，为心理治疗创造更好的参与条件。',
      },
    },
  ],

  // ===== GAD-7：焦虑症 =====
  anxiety: [
    {
      id: 'gad-7',
      title: 'GAD-7 广泛性焦虑量表',
      subtitle: 'Generalized Anxiety Disorder-7',
      time: '约 2 分钟',
      desc: '国际通用的焦虑症状自评工具，评估过去两周的焦虑体验频率。',
      questions: [
        { id: 'gad_1', text: '感到紧张、焦虑或烦躁', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
        { id: 'gad_2', text: '无法停止或控制担忧', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
        { id: 'gad_3', text: '对各种事情过度担忧', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
        { id: 'gad_4', text: '难以放松', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
        { id: 'gad_5', text: '烦躁不安，难以静坐', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
        { id: 'gad_6', text: '容易烦躁或易怒', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
        { id: 'gad_7', text: '感到害怕——好像有什么可怕的事情会发生', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有几天' },
          { value: 2, label: '超过一半的天数' }, { value: 3, label: '几乎每天' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 4, severity: '无焦虑症状', level: 'minimal' },
          { min: 5, max: 9, severity: '轻度焦虑', level: 'mild' },
          { min: 10, max: 14, severity: '中度焦虑', level: 'moderate' },
          { min: 15, max: 21, severity: '重度焦虑', level: 'severe' },
        ],
        note: '总分 ≥ 10 分建议寻求专业评估。GAD-7 是筛查工具，诊断需临床面谈确认。',
      },
      analysis: {
        minimal: '得分正常。保持现有生活习惯，定期运动、正念呼吸有助于预防焦虑。',
        mild: '轻度焦虑水平。建议：1) 练习腹式呼吸（4-7-8 呼吸法）；2) 限制咖啡因和酒精摄入；3) 每天安排 20 分钟"担忧时段"集中处理焦虑；4) 如社交功能受影响，可考虑心理咨询。',
        moderate: '中度焦虑。建议：1) 寻求专业心理咨询（CBT 效果最佳）；2) 学习渐进式肌肉放松；3) 规律有氧运动可显著降低焦虑水平；4) 医生可能评估是否需要抗焦虑药物。',
        severe: '重度焦虑。请尽快寻求专业帮助：1) 精神科医生评估是必要的；2) 心理治疗与药物联合效果最佳；3) SSRI 和 SNRI 类药物是一线选择；4) 避免自我用药（如酒精、镇静剂）。', 
      },
      methods: {
        cbt: '认知行为疗法（CBT）：通过认知重建和行为暴露技术，有效减少焦虑症状，是焦虑症的一线心理治疗。',
        act: '接纳承诺疗法（ACT）：学习与焦虑想法共处而非对抗，减少回避行为。',
        relaxation: '放松训练：渐进式肌肉放松、腹式呼吸、正念冥想均可降低生理唤醒水平。',
        medication: '药物治疗：SSRI（如艾司西酞普兰、舍曲林）和 SNRI（如文拉法辛）是焦虑症一线药物。',
      },
    },

    // ===== SAS：Zung 焦虑自评量表 =====
    {
      id: 'sas',
      title: 'SAS 焦虑自评量表',
      subtitle: 'Zung Self-Rating Anxiety Scale',
      time: '约 5 分钟',
      desc: 'Zung 于 1971 年编制的经典焦虑自评工具，涵盖焦虑的情感、躯体、运动及自主神经症状。',
      questions: [
        { id: 'sas_1', text: '我感到比平时更容易紧张和着急', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_2', text: '我无缘无故地感到害怕', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_3', text: '我容易心里烦乱或感到很惊恐', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_4', text: '我觉得我可能将要发疯', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_5', text: '我觉得一切都很好，也不会发生什么不幸（反向）', options: [
          { value: 4, label: '没有或很少时间' }, { value: 3, label: '少部分时间' },
          { value: 2, label: '相当多时间' }, { value: 1, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_6', text: '我手脚发抖打战', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_7', text: '我因为头痛、颈痛或背痛而困扰', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_8', text: '我感到容易衰弱和疲乏', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_9', text: '我觉得心平气和，并且容易安静坐着（反向）', options: [
          { value: 4, label: '没有或很少时间' }, { value: 3, label: '少部分时间' },
          { value: 2, label: '相当多时间' }, { value: 1, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_10', text: '我感到心跳得很快', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_11', text: '我因为一阵阵头晕而困扰', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_12', text: '我有晕倒发作或觉得要晕倒似的', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_13', text: '我呼气吸气都感到很容易（反向）', options: [
          { value: 4, label: '没有或很少时间' }, { value: 3, label: '少部分时间' },
          { value: 2, label: '相当多时间' }, { value: 1, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_14', text: '我感到手脚麻木和刺痛', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_15', text: '我因为胃痛和消化不良而困扰', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_16', text: '我常常要小便', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_17', text: '我的手通常是干燥温暖的（反向）', options: [
          { value: 4, label: '没有或很少时间' }, { value: 3, label: '少部分时间' },
          { value: 2, label: '相当多时间' }, { value: 1, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_18', text: '我容易脸红发热', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_19', text: '我容易入睡并且一夜睡得很好（反向）', options: [
          { value: 4, label: '没有或很少时间' }, { value: 3, label: '少部分时间' },
          { value: 2, label: '相当多时间' }, { value: 1, label: '绝大部分或全部时间' },
        ]},
        { id: 'sas_20', text: '我做噩梦', options: [
          { value: 1, label: '没有或很少时间' }, { value: 2, label: '少部分时间' },
          { value: 3, label: '相当多时间' }, { value: 4, label: '绝大部分或全部时间' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 20, max: 39, severity: '正常范围', level: 'minimal' },
          { min: 40, max: 47, severity: '轻度焦虑', level: 'mild' },
          { min: 48, max: 55, severity: '中度焦虑', level: 'moderate' },
          { min: 56, max: 80, severity: '重度焦虑', level: 'severe' },
        ],
        note: 'SAS 粗分范围 20-80。标准分 = 粗分 × 1.25。粗分 ≥ 40 分提示可能存在焦虑症状，建议进一步评估。',
      },
      analysis: {
        minimal: 'SAS 得分在正常范围。保持健康的生活方式，适度运动有助于维持情绪稳定。',
        mild: '轻度焦虑水平。建议：1) 练习腹式呼吸（4-7-8 呼吸法：吸气 4 秒-屏气 7 秒-呼气 8 秒）；2) 减少咖啡因和酒精摄入；3) 每天安排固定的放松时间；4) 如持续困扰，可考虑心理咨询。',
        moderate: '中度焦虑。建议：1) 寻求专业心理咨询（CBT 效果最佳）；2) 渐进式肌肉放松训练；3) 规律有氧运动可显著减轻焦虑；4) 医生可能评估是否需要短期抗焦虑药物。',
        severe: '重度焦虑。请尽快寻求专业帮助：1) 精神科医生评估是必要的；2) 心理治疗与药物联合效果最优；3) SSRI/SNRI 类是一线药物选择；4) 急性期可短期使用苯二氮䓬类药物。',
      },
      methods: {
        cbt: '认知行为疗法（CBT）：通过认知重建纠正灾难化思维，结合行为暴露减少回避。',
        relaxation: '放松训练：渐进式肌肉放松、腹式呼吸、正念冥想、引导想象均对焦虑有效。',
        medication: '药物治疗：SSRI（如艾司西酞普兰、帕罗西汀）和 SNRI（如文拉法辛、度洛西汀）是焦虑症一线药物。',
        exercise: '运动疗法：有氧运动（中高强度）每周 3-5 次可显著降低焦虑水平，效果可持续至运动后数小时。',
      },
    },

    // ===== BAI：贝克焦虑量表 =====
    {
      id: 'bai',
      title: 'BAI 贝克焦虑量表',
      subtitle: 'Beck Anxiety Inventory',
      time: '约 5 分钟',
      desc: 'Beck 于 1988 年编制的焦虑症状自评量表，重点评估焦虑的躯体症状维度。',
      questions: [
        { id: 'bai_1', text: '身体麻木或刺痛感', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度，不影响我' },
          { value: 2, label: '中度，有些不舒服' }, { value: 3, label: '重度，难以忍受' },
        ]},
        { id: 'bai_2', text: '身体发热', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_3', text: '走路不稳', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_4', text: '无法放松', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_5', text: '害怕最坏的事情发生', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_6', text: '头晕或头昏', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_7', text: '心跳过快或心悸', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_8', text: '不安或紧张', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_9', text: '恐惧', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_10', text: '紧张', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_11', text: '窒息感', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_12', text: '手抖', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_13', text: '身体摇晃', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_14', text: '害怕失控', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_15', text: '呼吸困难', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_16', text: '害怕死亡', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_17', text: '恐慌', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_18', text: '消化不良或腹部不适', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_19', text: '晕厥感', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_20', text: '面部潮红', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
        { id: 'bai_21', text: '出汗（不是因天热）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 7, severity: '无或轻微焦虑', level: 'minimal' },
          { min: 8, max: 15, severity: '轻度焦虑', level: 'mild' },
          { min: 16, max: 25, severity: '中度焦虑', level: 'moderate' },
          { min: 26, max: 63, severity: '重度焦虑', level: 'severe' },
        ],
        note: 'BAI 总分范围 0-63。≥ 16 分提示中度以上焦虑，建议寻求专业评估。BAI 更侧重焦虑的躯体症状。',
      },
      analysis: {
        minimal: 'BAI 得分正常。保持现有生活习惯，正念呼吸和规律运动可帮助维持情绪平衡。',
        mild: '轻度焦虑。建议：1) 腹式呼吸练习（4-7-8 呼吸法）；2) 限制咖啡因和酒精；3) 渐进式肌肉放松；4) 如持续困扰可咨询心理医生。',
        moderate: '中度焦虑。建议：1) 寻求专业心理咨询（CBT 效果最佳）；2) 规律有氧运动可显著降低焦虑；3) 学习放松技巧；4) 医生可能评估是否需要药物治疗。',
        severe: '重度焦虑。请尽快寻求专业帮助：1) 精神科评估是必要的；2) 心理治疗与药物联合效果最优；3) SSRI/SNRI 是焦虑症一线药物。',
      },
      methods: {
        cbt: '认知行为疗法（CBT）：通过认知重建和暴露技术减少焦虑。',
        relaxation: '放松训练：渐进式肌肉放松、腹式呼吸、正念冥想。',
        medication: '药物治疗：SSRI 和 SNRI 是焦虑症一线药物。',
        exercise: '运动疗法：有氧运动可显著降低焦虑水平。',
      },
    },

    // ===== 伯恩斯焦虑量表 =====
    {
      id: 'burns-anxiety',
      title: '伯恩斯焦虑量表',
      subtitle: 'Burns Anxiety Inventory',
      time: '约 5 分钟',
      desc: 'David D. Burns 编制的焦虑自评量表，覆盖焦虑感受、焦虑思维和躯体症状三个维度共 33 项。',
      questions: [
        { id: 'bai_1', text: '焦虑、紧张、担忧或恐惧', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_2', text: '感觉周围的事物不真实、陌生或模糊', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_3', text: '感觉身体的一部分不属于自己，或感觉自己与身体分离', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_4', text: '突然出现意外的惊恐发作', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_5', text: '感觉即将有坏事发生的不祥预感', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_6', text: '感觉紧张、压力大或坐立不安', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_7', text: '注意力难以集中', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_8', text: '思维奔逸或无法控制的想法', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_9', text: '令人恐惧的幻想或白日梦', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_10', text: '担心自己会发疯、失控或精神失常', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_11', text: '害怕死亡或患上严重疾病', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_12', text: '自我怀疑或犹豫不决', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_13', text: '害怕自己在别人面前出丑或显得无能', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_14', text: '害怕独自一人或被抛弃', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_15', text: '害怕被批评或被拒绝', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_16', text: '害怕可怕的事情即将发生', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_17', text: '心悸、心跳加速或心律不齐', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_18', text: '胸部压迫感或疼痛', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_19', text: '手脚发麻或刺痛感', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_20', text: '胃部不适、翻腾感或腹部不适', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_21', text: '便秘或腹泻', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_22', text: '坐立不安或难以静坐', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_23', text: '身体颤抖或发抖', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_24', text: '尿频或尿急', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_25', text: '喉咙有异物感或吞咽困难', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_26', text: '出汗或手心潮湿', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_27', text: '头晕、头昏或感觉站不稳', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_28', text: '紧张性头痛', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_29', text: '入睡困难或睡眠中断', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_30', text: '疲劳、虚弱或精力不足', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_31', text: '磨牙或咬紧牙关', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_32', text: '口干', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
        { id: 'bai_33', text: '肌肉紧张、酸痛或抽筋', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻微' },
          { value: 2, label: '中等' }, { value: 3, label: '严重' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 10, severity: '无或轻微焦虑', level: 'minimal' },
          { min: 11, max: 25, severity: '轻度焦虑', level: 'mild' },
          { min: 26, max: 50, severity: '中度焦虑', level: 'moderate' },
          { min: 51, max: 75, severity: '重度焦虑', level: 'severe' },
          { min: 76, max: 99, severity: '极重度焦虑', level: 'severe' },
        ],
        note: '伯恩斯焦虑量表总分范围 0-99。≥ 26 分提示中度以上焦虑，建议寻求专业评估。量表中焦虑感受（1-6 题）、焦虑思维（7-16 题）和躯体症状（17-33 题）三个维度可分别查看。',
      },
      analysis: {
        minimal: '得分在正常范围。保持现有的健康习惯，定期运动、正念呼吸和充足睡眠有助于维持情绪平衡。',
        mild: '轻度焦虑水平。建议：1) 练习腹式呼吸（4-7-8 呼吸法）；2) 减少咖啡因和酒精摄入；3) 建立规律的作息和运动习惯；4) 关注三个维度中得分较高的方面，针对性调整。',
        moderate: '中度焦虑。建议：1) 寻求专业心理咨询（CBT 效果最佳）；2) 认知行为疗法可帮助识别和改变焦虑思维模式；3) 规律有氧运动可显著降低焦虑水平；4) 医生可能评估是否需要药物治疗。',
        severe: '重度焦虑。请尽快寻求专业帮助：1) 精神科医生评估是必要的；2) 心理治疗与药物联合效果最优；3) SSRI 和 SNRI 类药物是一线选择；4) 学习焦虑管理技巧（放松训练、正念冥想）作为辅助。',
      },
      methods: {
        cbt: '认知行为疗法（CBT）：通过认知重建调整灾难化思维，结合暴露技术减少回避行为。',
        relaxation: '放松训练：渐进式肌肉放松、腹式呼吸、正念冥想均可降低生理唤醒水平。',
        medication: '药物治疗：SSRI（如艾司西酞普兰、舍曲林）和 SNRI（如文拉法辛）是焦虑症一线药物。',
        exercise: '运动疗法：有氧运动每周 3-5 次，每次 30-45 分钟，可显著降低焦虑水平。',
      },
    },

    // ===== HAMA：汉密尔顿焦虑量表 =====
    {
      id: 'hama',
      title: 'HAMA 汉密尔顿焦虑量表',
      subtitle: 'Hamilton Anxiety Rating Scale',
      time: '约 8 分钟',
      desc: '经典的临床医生评定焦虑量表，涵盖精神性焦虑和躯体性焦虑两个维度共 14 项，广泛用于焦虑严重程度评估。',
      questions: [
        { id: 'hama_1', text: '焦虑心境（担忧、坏预感、恐惧、易怒、紧张）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'hama_2', text: '紧张感（紧张、疲劳、易惊、无法放松）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'hama_3', text: '恐惧（怕黑、怕生人、怕独处、怕动物、怕拥挤）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'hama_4', text: '失眠（入睡困难、夜间惊醒、早醒、多梦、噩梦）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'hama_5', text: '认知功能（记忆力差、注意力不集中、思维困难）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'hama_6', text: '抑郁心境（缺乏兴趣、对爱好无快感、早醒、情绪波动）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'hama_7', text: '躯体性焦虑：运动系统（肌肉酸痛、抽筋、咬紧牙关、坐立不安）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'hama_8', text: '躯体性焦虑：感觉系统（耳鸣、视力模糊、潮热、刺痛感）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'hama_9', text: '心血管系统症状（心悸、胸痛、心跳加速、晕厥感）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'hama_10', text: '呼吸系统症状（胸闷、窒息感、叹气、呼吸困难）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'hama_11', text: '消化系统症状（吞咽困难、胃部不适、腹胀、腹泻、便秘）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'hama_12', text: '泌尿生殖系统症状（尿频、尿急、痛经、性欲减退、早泄）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'hama_13', text: '自主神经症状（口干、脸红、苍白、出汗、头晕、紧张性头痛）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'hama_14', text: '会谈时的行为表现（坐立不安、搓手、颤抖、皱眉、叹息、面色紧张）', options: [
          { value: 0, label: '无' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 7, severity: '无焦虑症状', level: 'minimal' },
          { min: 8, max: 14, severity: '轻度焦虑', level: 'mild' },
          { min: 15, max: 23, severity: '中度焦虑', level: 'moderate' },
          { min: 24, max: 56, severity: '重度焦虑', level: 'severe' },
        ],
        note: 'HAMA 总分范围 0-56。≥ 8 分提示可能存在焦虑，≥ 15 分提示中度焦虑，建议专业评估。第 1-6 项为精神性焦虑分，第 7-14 项为躯体性焦虑分。',
      },
      analysis: {
        minimal: 'HAMA 得分在正常范围。您的焦虑水平不高，继续保持规律作息和适度运动。',
        mild: '轻度焦虑水平。建议：1) 练习放松技巧（腹式呼吸、渐进式肌肉放松）；2) 限制咖啡因和酒精摄入；3) 规律有氧运动；4) 如持续困扰超过两周，建议心理咨询。',
        moderate: '中度焦虑。建议：1) 尽快寻求专业心理咨询（CBT 效果最佳）；2) 认知行为疗法帮助识别和调整焦虑思维；3) 医生可能评估是否需要抗焦虑药物；4) 学习正念减压技巧。',
        severe: '重度焦虑。请尽快寻求专业帮助：1) 精神科医生全面评估是必要的；2) 心理治疗与药物联合效果最优；3) SSRI/SNRI 是焦虑症一线药物；4) 急性期可能需要短期使用苯二氮䓬类药物。',
      },
      methods: {
        cbt: '认知行为疗法（CBT）：通过认知重建调整灾难化思维，结合行为暴露减少回避。',
        relaxation: '放松训练：渐进式肌肉放松、腹式呼吸、正念冥想、引导想象均对焦虑有效。',
        medication: '药物治疗：SSRI（艾司西酞普兰、帕罗西汀）和 SNRI（文拉法辛、度洛西汀）是焦虑症一线药物。',
        exercise: '运动疗法：有氧运动每周 3-5 次可显著降低焦虑水平。',
      },
    },

    // ===== STAI：状态-特质焦虑问卷 =====
    {
      id: 'stai',
      title: 'STAI 状态-特质焦虑问卷',
      subtitle: 'State-Trait Anxiety Inventory',
      time: '约 10 分钟',
      desc: 'Spielberger 编制的经典焦虑评估工具，区分"状态焦虑"（当下的暂时性焦虑）和"特质焦虑"（稳定的人格倾向），各 20 题。',
      questions: [
        { id: 'stai_s1', text: '我感到平静（状态·反向）', options: [
          { value: 4, label: '完全没有' }, { value: 3, label: '有些' },
          { value: 2, label: '中等' }, { value: 1, label: '非常明显' },
        ]},
        { id: 'stai_s2', text: '我感到安全（状态·反向）', options: [
          { value: 4, label: '完全没有' }, { value: 3, label: '有些' },
          { value: 2, label: '中等' }, { value: 1, label: '非常明显' },
        ]},
        { id: 'stai_s3', text: '我感到紧张', options: [
          { value: 1, label: '完全没有' }, { value: 2, label: '有些' },
          { value: 3, label: '中等' }, { value: 4, label: '非常明显' },
        ]},
        { id: 'stai_s4', text: '我感到受约束', options: [
          { value: 1, label: '完全没有' }, { value: 2, label: '有些' },
          { value: 3, label: '中等' }, { value: 4, label: '非常明显' },
        ]},
        { id: 'stai_s5', text: '我感到安逸（状态·反向）', options: [
          { value: 4, label: '完全没有' }, { value: 3, label: '有些' },
          { value: 2, label: '中等' }, { value: 1, label: '非常明显' },
        ]},
        { id: 'stai_s6', text: '我感到心烦意乱', options: [
          { value: 1, label: '完全没有' }, { value: 2, label: '有些' },
          { value: 3, label: '中等' }, { value: 4, label: '非常明显' },
        ]},
        { id: 'stai_s7', text: '我担心可能发生不好的事情', options: [
          { value: 1, label: '完全没有' }, { value: 2, label: '有些' },
          { value: 3, label: '中等' }, { value: 4, label: '非常明显' },
        ]},
        { id: 'stai_s8', text: '我感到满足（状态·反向）', options: [
          { value: 4, label: '完全没有' }, { value: 3, label: '有些' },
          { value: 2, label: '中等' }, { value: 1, label: '非常明显' },
        ]},
        { id: 'stai_s9', text: '我感到害怕', options: [
          { value: 1, label: '完全没有' }, { value: 2, label: '有些' },
          { value: 3, label: '中等' }, { value: 4, label: '非常明显' },
        ]},
        { id: 'stai_s10', text: '我感到舒适（状态·反向）', options: [
          { value: 4, label: '完全没有' }, { value: 3, label: '有些' },
          { value: 2, label: '中等' }, { value: 1, label: '非常明显' },
        ]},
        { id: 'stai_s11', text: '我缺乏自信（状态·反向）', options: [
          { value: 4, label: '完全没有' }, { value: 3, label: '有些' },
          { value: 2, label: '中等' }, { value: 1, label: '非常明显' },
        ]},
        { id: 'stai_s12', text: '我感到紧张不安', options: [
          { value: 1, label: '完全没有' }, { value: 2, label: '有些' },
          { value: 3, label: '中等' }, { value: 4, label: '非常明显' },
        ]},
        { id: 'stai_s13', text: '我内心感到不安', options: [
          { value: 1, label: '完全没有' }, { value: 2, label: '有些' },
          { value: 3, label: '中等' }, { value: 4, label: '非常明显' },
        ]},
        { id: 'stai_s14', text: '我犹豫不决', options: [
          { value: 1, label: '完全没有' }, { value: 2, label: '有些' },
          { value: 3, label: '中等' }, { value: 4, label: '非常明显' },
        ]},
        { id: 'stai_s15', text: '我感到轻松（状态·反向）', options: [
          { value: 4, label: '完全没有' }, { value: 3, label: '有些' },
          { value: 2, label: '中等' }, { value: 1, label: '非常明显' },
        ]},
        { id: 'stai_s16', text: '我内心感到满足（状态·反向）', options: [
          { value: 4, label: '完全没有' }, { value: 3, label: '有些' },
          { value: 2, label: '中等' }, { value: 1, label: '非常明显' },
        ]},
        { id: 'stai_s17', text: '我担忧', options: [
          { value: 1, label: '完全没有' }, { value: 2, label: '有些' },
          { value: 3, label: '中等' }, { value: 4, label: '非常明显' },
        ]},
        { id: 'stai_s18', text: '我感到慌乱', options: [
          { value: 1, label: '完全没有' }, { value: 2, label: '有些' },
          { value: 3, label: '中等' }, { value: 4, label: '非常明显' },
        ]},
        { id: 'stai_s19', text: '我感到镇定（状态·反向）', options: [
          { value: 4, label: '完全没有' }, { value: 3, label: '有些' },
          { value: 2, label: '中等' }, { value: 1, label: '非常明显' },
        ]},
        { id: 'stai_s20', text: '我感到愉快（状态·反向）', options: [
          { value: 4, label: '完全没有' }, { value: 3, label: '有些' },
          { value: 2, label: '中等' }, { value: 1, label: '非常明显' },
        ]},
        { id: 'stai_t1', text: '我感到愉快（特质·反向）', options: [
          { value: 4, label: '几乎没有' }, { value: 3, label: '有些' },
          { value: 2, label: '经常' }, { value: 1, label: '几乎总是' },
        ]},
        { id: 'stai_t2', text: '我容易疲劳', options: [
          { value: 1, label: '几乎没有' }, { value: 2, label: '有些' },
          { value: 3, label: '经常' }, { value: 4, label: '几乎总是' },
        ]},
        { id: 'stai_t3', text: '我容易哭', options: [
          { value: 1, label: '几乎没有' }, { value: 2, label: '有些' },
          { value: 3, label: '经常' }, { value: 4, label: '几乎总是' },
        ]},
        { id: 'stai_t4', text: '我希望自己能像别人那样快乐', options: [
          { value: 1, label: '几乎没有' }, { value: 2, label: '有些' },
          { value: 3, label: '经常' }, { value: 4, label: '几乎总是' },
        ]},
        { id: 'stai_t5', text: '我优柔寡断，容易失去机会', options: [
          { value: 1, label: '几乎没有' }, { value: 2, label: '有些' },
          { value: 3, label: '经常' }, { value: 4, label: '几乎总是' },
        ]},
        { id: 'stai_t6', text: '我感到平静（特质·反向）', options: [
          { value: 4, label: '几乎没有' }, { value: 3, label: '有些' },
          { value: 2, label: '经常' }, { value: 1, label: '几乎总是' },
        ]},
        { id: 'stai_t7', text: '我冷静、沉着、理智（特质·反向）', options: [
          { value: 4, label: '几乎没有' }, { value: 3, label: '有些' },
          { value: 2, label: '经常' }, { value: 1, label: '几乎总是' },
        ]},
        { id: 'stai_t8', text: '我觉得困难越积越多，无法克服', options: [
          { value: 1, label: '几乎没有' }, { value: 2, label: '有些' },
          { value: 3, label: '经常' }, { value: 4, label: '几乎总是' },
        ]},
        { id: 'stai_t9', text: '我过分担忧一些无关紧要的事情', options: [
          { value: 1, label: '几乎没有' }, { value: 2, label: '有些' },
          { value: 3, label: '经常' }, { value: 4, label: '几乎总是' },
        ]},
        { id: 'stai_t10', text: '我幸福感很强（特质·反向）', options: [
          { value: 4, label: '几乎没有' }, { value: 3, label: '有些' },
          { value: 2, label: '经常' }, { value: 1, label: '几乎总是' },
        ]},
        { id: 'stai_t11', text: '我容易因小事而烦恼', options: [
          { value: 1, label: '几乎没有' }, { value: 2, label: '有些' },
          { value: 3, label: '经常' }, { value: 4, label: '几乎总是' },
        ]},
        { id: 'stai_t12', text: '我缺乏自信（特质）', options: [
          { value: 1, label: '几乎没有' }, { value: 2, label: '有些' },
          { value: 3, label: '经常' }, { value: 4, label: '几乎总是' },
        ]},
        { id: 'stai_t13', text: '我感到安全（特质·反向）', options: [
          { value: 4, label: '几乎没有' }, { value: 3, label: '有些' },
          { value: 2, label: '经常' }, { value: 1, label: '几乎总是' },
        ]},
        { id: 'stai_t14', text: '我努力避免面对危机或困难', options: [
          { value: 1, label: '几乎没有' }, { value: 2, label: '有些' },
          { value: 3, label: '经常' }, { value: 4, label: '几乎总是' },
        ]},
        { id: 'stai_t15', text: '我感到忧郁', options: [
          { value: 1, label: '几乎没有' }, { value: 2, label: '有些' },
          { value: 3, label: '经常' }, { value: 4, label: '几乎总是' },
        ]},
        { id: 'stai_t16', text: '我感到满足（特质·反向）', options: [
          { value: 4, label: '几乎没有' }, { value: 3, label: '有些' },
          { value: 2, label: '经常' }, { value: 1, label: '几乎总是' },
        ]},
        { id: 'stai_t17', text: '有些无关紧要的想法困扰我', options: [
          { value: 1, label: '几乎没有' }, { value: 2, label: '有些' },
          { value: 3, label: '经常' }, { value: 4, label: '几乎总是' },
        ]},
        { id: 'stai_t18', text: '我容易失望，把事情看得很严重', options: [
          { value: 1, label: '几乎没有' }, { value: 2, label: '有些' },
          { value: 3, label: '经常' }, { value: 4, label: '几乎总是' },
        ]},
        { id: 'stai_t19', text: '我是一个情绪稳定的人（特质·反向）', options: [
          { value: 4, label: '几乎没有' }, { value: 3, label: '有些' },
          { value: 2, label: '经常' }, { value: 1, label: '几乎总是' },
        ]},
        { id: 'stai_t20', text: '我陷入紧张状态，难以平复', options: [
          { value: 1, label: '几乎没有' }, { value: 2, label: '有些' },
          { value: 3, label: '经常' }, { value: 4, label: '几乎总是' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 40, max: 79, severity: '正常范围', level: 'minimal' },
          { min: 80, max: 99, severity: '轻度焦虑', level: 'mild' },
          { min: 100, max: 119, severity: '中度焦虑', level: 'moderate' },
          { min: 120, max: 160, severity: '重度焦虑', level: 'severe' },
        ],
        note: 'STAI 总分范围 40-160（S-AI 20-80 + T-AI 20-80）。状态焦虑反映当前紧张水平，特质焦虑反映稳定的人格倾向。建议分别查看两个分量表得分。',
      },
      analysis: {
        minimal: 'STAI 得分在正常范围。您的状态和特质焦虑水平均不高，继续保持健康的生活方式。',
        mild: '轻度焦虑水平。建议：1) 学习放松技巧（腹式呼吸、正念冥想）；2) 规律运动；3) 减少咖啡因和酒精摄入；4) 如特质焦虑偏高，长期正念练习可帮助降低基线焦虑水平。',
        moderate: '中度焦虑。建议：1) 寻求专业心理咨询（CBT 效果最佳）；2) 区分状态焦虑（针对当下压力源）和特质焦虑（需要长期调整）；3) 认知行为疗法帮助识别和改变焦虑思维模式；4) 医生可能评估是否需要药物治疗。',
        severe: '重度焦虑。请尽快寻求专业帮助：1) 精神科医生全面评估；2) 心理治疗与药物联合效果最优；3) 关注状态焦虑是否由特定应激事件触发，特质焦虑则需更长期的心理干预；4) 学习焦虑管理技巧辅助治疗。',
      },
      methods: {
        cbt: '认知行为疗法（CBT）：通过认知重建调整焦虑思维，行为暴露减少回避。',
        mindfulness: '正念减压（MBSR）：8 周正念训练可显著降低特质焦虑水平。',
        medication: '药物治疗：SSRI（艾司西酞普兰、舍曲林）和 SNRI（文拉法辛）是焦虑症一线药物。',
        relaxation: '放松训练：渐进式肌肉放松、腹式呼吸、引导想象均可有效降低状态焦虑。',
      },
    },

    // ===== ADIS：焦虑障碍访谈筛查 =====
    {
      id: 'adis',
      title: 'ADIS 焦虑障碍访谈量表',
      subtitle: 'Anxiety Disorders Interview Schedule for DSM-5',
      time: '约 15 分钟',
      desc: '基于 DSM-5 的焦虑障碍诊断访谈筛查，涵盖惊恐发作、广场恐惧、社交焦虑、广泛性焦虑和特定恐惧症五大核心领域。',
      questions: [
        { id: 'adis_1', text: '惊恐发作：你是否经历过突然出现的强烈恐惧或不适感，在几分钟内达到高峰，伴有心悸、出汗、发抖、气短、窒息感、胸痛、恶心、头晕、发冷/发热、麻木、现实解体或害怕失控/发疯/死亡？', options: [
          { value: 0, label: '从未有过' }, { value: 1, label: '有过，但很少（每年≤2次）' },
          { value: 2, label: '偶尔发生（每月1-3次）' }, { value: 3, label: '经常发生（每周≥1次）' }, { value: 4, label: '频繁发生（几乎每天）' },
        ]},
        { id: 'adis_2', text: '对惊恐发作的担忧：你是否持续担心再次出现惊恐发作，或担心发作意味着你"发疯"、失控或有严重身体疾病？', options: [
          { value: 0, label: '完全不担心' }, { value: 1, label: '轻度担心' },
          { value: 2, label: '中度担心，有时影响生活' }, { value: 3, label: '重度担心，经常困扰我' }, { value: 4, label: '极度担心，无法摆脱' },
        ]},
        { id: 'adis_3', text: '广场恐惧：你是否害怕或回避以下场景——乘坐公共交通、处于开放空间、处于密闭空间、排队或人多的地方、独自离家？', options: [
          { value: 0, label: '从不回避' }, { value: 1, label: '偶尔回避，但能应对' },
          { value: 2, label: '有时回避，明显不舒服' }, { value: 3, label: '经常回避，需他人陪伴' }, { value: 4, label: '几乎完全回避，无法出门' },
        ]},
        { id: 'adis_4', text: '社交焦虑：你是否在社交场合中害怕被审视、评价或拒绝——如与人交谈、在他人面前做事、在公众场合吃喝、成为注意的焦点？', options: [
          { value: 0, label: '完全不怕' }, { value: 1, label: '轻度紧张，能应对' },
          { value: 2, label: '中度恐惧，有时回避' }, { value: 3, label: '重度恐惧，经常回避' }, { value: 4, label: '极度恐惧，完全回避社交' },
        ]},
        { id: 'adis_5', text: '社交回避：社交恐惧是否导致你回避社交活动、拒绝邀约、在工作或学校中避免发言或表现？', options: [
          { value: 0, label: '从不回避' }, { value: 1, label: '偶尔回避重要活动' },
          { value: 2, label: '经常回避社交场合' }, { value: 3, label: '大部分社交场合都回避' }, { value: 4, label: '几乎完全社会隔离' },
        ]},
        { id: 'adis_6', text: '广泛性焦虑（过度担忧）：你是否对各种事情（工作、健康、家庭、金钱等）有难以控制的过度担忧，且持续时间超过6个月？', options: [
          { value: 0, label: '几乎不担忧' }, { value: 1, label: '轻度担忧，能控制' },
          { value: 2, label: '中度担忧，难以控制' }, { value: 3, label: '重度担忧，经常无法自控' }, { value: 4, label: '极度担忧，几乎所有时间都在担忧' },
        ]},
        { id: 'adis_7', text: '焦虑躯体症状：你是否经常出现以下症状——坐立不安、容易疲劳、注意力难以集中、易怒、肌肉紧张、睡眠障碍？', options: [
          { value: 0, label: '几乎没有' }, { value: 1, label: '偶尔有其中1-2项' },
          { value: 2, label: '经常有其中2-3项' }, { value: 3, label: '大部分时间有3项以上' }, { value: 4, label: '几乎一直有4项以上' },
        ]},
        { id: 'adis_8', text: '特定恐惧症：你是否对特定对象或情境（如动物、高处、电梯、飞行、打针、血液、黑暗等）有强烈、持续的恐惧，并主动回避？', options: [
          { value: 0, label: '无明显恐惧' }, { value: 1, label: '轻度恐惧，能面对' },
          { value: 2, label: '中度恐惧，有时回避' }, { value: 3, label: '重度恐惧，明显影响生活' }, { value: 4, label: '极度恐惧，完全支配生活' },
        ]},
        { id: 'adis_9', text: '功能损害：焦虑症状是否影响了你的工作/学习、社交关系、家庭生活或日常活动的能力？', options: [
          { value: 0, label: '完全不影响' }, { value: 1, label: '轻度影响' },
          { value: 2, label: '中度影响（有些事做不了）' }, { value: 3, label: '重度影响（很多事情做不了）' }, { value: 4, label: '极度影响（几乎无法正常生活）' },
        ]},
        { id: 'adis_10', text: '总体痛苦程度：总的来说，你因焦虑症状感到痛苦的程度是多少？', options: [
          { value: 0, label: '完全没有痛苦' }, { value: 1, label: '轻度痛苦' },
          { value: 2, label: '中度痛苦' }, { value: 3, label: '重度痛苦' }, { value: 4, label: '极度痛苦' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 8, severity: '焦虑症状较少', level: 'minimal' },
          { min: 9, max: 16, severity: '轻度焦虑', level: 'mild' },
          { min: 17, max: 24, severity: '中度焦虑', level: 'moderate' },
          { min: 25, max: 40, severity: '重度焦虑', level: 'severe' },
        ],
        note: 'ADIS 筛查总分范围 0-40。≥ 9 分提示可能存在焦虑障碍风险，建议进一步临床评估。各维度独立查看可帮助识别最突出的问题领域：第1-2 题反映惊恐障碍、第 3 题反映广场恐惧、第 4-5 题反映社交焦虑、第 6-7 题反映广泛性焦虑、第 8 题反映特定恐惧症。总分 ≥ 17 分建议寻求精神科专业评估。',
      },
      analysis: {
        minimal: '您的 ADIS 筛查得分较低，表明目前焦虑症状较少。建议维持健康的生活方式，规律运动、充足睡眠和有效压力管理是预防焦虑的有效措施。',
        mild: '轻度焦虑症状。建议：1) 关注得分最高的维度，了解自己主要的焦虑来源；2) 练习正念呼吸和渐进式肌肉放松；3) 规律有氧运动（每周 3-5 次）可显著降低焦虑；4) 减少咖啡因和酒精摄入；5) 如症状持续超过两周，建议心理咨询。',
        moderate: '中度焦虑症状，可能存在焦虑障碍风险。建议：1) 尽快寻求专业心理评估以明确诊断；2) 认知行为疗法（CBT）是焦虑障碍的一线心理治疗，含暴露疗法和认知重建；3) 正念减压（MBSR）对广泛性焦虑效果显著；4) 医生可能评估是否需要 SSRI/SNRI 类药物治疗；5) 根据最突出的焦虑领域（惊恐、社交、广泛性等）选择针对性治疗。',
        severe: '重度焦虑症状，提示可能存在焦虑障碍。请尽快寻求专业帮助：1) 精神科医生进行全面评估和诊断；2) 循证心理治疗（CBT/ACT）联合药物治疗效果最优；3) SSRI（艾司西酞普兰、舍曲林）和 SNRI（文拉法辛）是一线药物；4) 急性期可能需要短期使用苯二氮䓬类药物缓解症状；5) 建立支持网络，避免社交孤立。',
      },
      methods: {
        cbt: '认知行为疗法（CBT）：通过认知重建识别和挑战焦虑思维，结合行为暴露打破回避循环，是焦虑障碍的一线心理治疗。',
        exposure: '暴露疗法：在治疗师指导下，逐步面对恐惧情境（想象暴露→现实暴露），学习恐惧会自然消退。',
        act: '接纳承诺疗法（ACT）：学会与焦虑想法解离，不再被恐惧支配，按照个人价值方向行动。',
        mindfulness: '正念减压（MBSR）：8 周正念训练培养对身心体验的觉察，减少自动化的焦虑反应。',
        medication: '药物治疗：SSRI（艾司西酞普兰、舍曲林、帕罗西汀）和 SNRI（文拉法辛、度洛西汀）是焦虑障碍一线药物，需精神科医生处方。',
        lifestyle: '生活方式干预：有氧运动、规律作息、限制咖啡因和酒精、充足的睡眠、建立社交支持网络。',
      },
    },
  ],

  // ===== OCI-R：强迫症 =====
  ocd: [
    {
      id: 'oci-r',
      title: 'OCI-R 强迫症状问卷',
      subtitle: 'Obsessive-Compulsive Inventory-Revised',
      time: '约 5 分钟',
      desc: 'Foa 等人编制的强迫症状自评量表，覆盖洗涤、检查、排序、强迫思维、囤积、中和 6 个维度。',
      questions: [
        { id: 'oci_1', text: '我积攒了太多东西以至于它们碍事', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_2', text: '我反复检查东西', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_3', text: '我感到有冲动去把东西按特定顺序排列', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_4', text: '我感到有冲动去计数——数东西、数数字、数次数', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_5', text: '我发现自己需要触摸东西', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_6', text: '我很难控制自己的思维', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_7', text: '我收集了太多我不需要的东西', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_8', text: '我反复检查门窗、电器等', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_9', text: '如果我被干扰了，感到非常不安，必须重新开始', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_10', text: '我感到有冲动去把东西排列得整整齐齐', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_11', text: '我脑子里反复出现令人不愉快的想法', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_12', text: '我觉得必须反复做同一件事，直到感觉"对了"', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_13', text: '我过度清洁——洗手、洗澡、打扫等次数过多', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_14', text: '我反复检查——即使我知道已经做过了', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_15', text: '我对称感很强——东西必须摆放在正确的位置', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_16', text: '我有令人不愉快的性幻想或宗教想法', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_17', text: '我难以丢弃东西——总是想着"万一以后用得上"', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
        { id: 'oci_18', text: '我必须在脑海里反复说某些话或做某些动作来防止坏事发生', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '有一点' },
          { value: 2, label: '中等程度' }, { value: 3, label: '很多' }, { value: 4, label: '极其多' },
        ]},
      ],
      subscales: [
        { name: '囤积', ids: ['oci_1', 'oci_7', 'oci_17'], max: 12 },
        { name: '检查', ids: ['oci_2', 'oci_8', 'oci_14'], max: 12 },
        { name: '排序', ids: ['oci_3', 'oci_9', 'oci_15'], max: 12 },
        { name: '强迫思维', ids: ['oci_4', 'oci_10', 'oci_16'], max: 12 },
        { name: '清洗', ids: ['oci_5', 'oci_11', 'oci_17'], max: 12 },
        { name: '中和', ids: ['oci_6', 'oci_12', 'oci_18'], max: 12 },
      ],
      scoring: {
        ranges: [
          { min: 0, max: 18, severity: '正常范围', level: 'minimal' },
          { min: 19, max: 36, severity: '轻度强迫症状', level: 'mild' },
          { min: 37, max: 54, severity: '中度强迫症状', level: 'moderate' },
          { min: 55, max: 72, severity: '重度强迫症状', level: 'severe' },
        ],
        note: 'OCI-R 总分范围 0-72。建议同时关注各维度得分以了解具体症状模式。',
      },
      analysis: {
        minimal: 'OCI-R 得分正常。如有轻微强迫倾向，学习顺其自然、不排斥想法的态度有助于预防加重。',
        mild: '轻度强迫症状。建议：1) 学习 ERP（暴露与反应阻止）自助方法；2) 记录触发情境和强迫行为日志；3) 减少回避行为；4) 如影响日常功能，建议 CBT 治疗。',
        moderate: '中度强迫症状。建议：1) 寻求专业心理治疗（ERP 为一线心理治疗）；2) CBT 联合 ERP 效果显著；3) 医生可能评估是否需要 SSRI 药物治疗；4) 每周治疗至少一次。',
        severe: '重度强迫症状。请尽快就诊：1) 精神科全面评估；2) ERP 心理治疗是最有效的心理干预；3) SSRI 药物（如氟西汀、氟伏沙明、舍曲林）常规剂量往往较高；4) 严重者可能需要联合治疗或强化治疗。',
      },
      methods: {
        erp: '暴露与反应阻止（ERP）：逐步暴露于引发强迫思维的情境，同时有意识地阻止强迫行为，是 OCD 的一线心理治疗。',
        cbt: '认知行为疗法（CBT）：处理与强迫相关的功能性失调信念（如过高责任感和完美主义）。',
        medication: '药物治疗：高剂量 SSRI（如氟西汀 40-80mg/日、氟伏沙明、舍曲林）是 OCD 一线药物。联合心理治疗效果最佳。',
        act: '接纳承诺疗法（ACT）：学习与强迫想法解离，减少经验性回避。',
      },
    },
  ],

  // ===== MDQ：双相情感障碍 =====
  bipolar: [
    {
      id: 'mdq',
      title: 'MDQ 心境障碍问卷',
      subtitle: 'Mood Disorder Questionnaire',
      time: '约 3 分钟',
      desc: 'Hirschfeld 等人编制的双相障碍筛查工具，评估是否曾出现持续的躁狂/轻躁狂症状。',
      questions: [
        { id: 'mdq_1', text: '您曾有一段时间感觉自己非常好或非常兴奋，以至于别人认为您不太正常？', options: [
          { value: 0, label: '否' }, { value: 1, label: '是' },
        ]},
        { id: 'mdq_2', text: '您曾有一段时间非常烦躁，以至于对人大喊大叫或动手打架？', options: [
          { value: 0, label: '否' }, { value: 1, label: '是' },
        ]},
        { id: 'mdq_3', text: '您曾有一段时间比平时自信得多？', options: [
          { value: 0, label: '否' }, { value: 1, label: '是' },
        ]},
        { id: 'mdq_4', text: '您曾有一段时间比平时睡得少得多，但您并不觉得缺少睡眠？', options: [
          { value: 0, label: '否' }, { value: 1, label: '是' },
        ]},
        { id: 'mdq_5', text: '您曾有一段时间比平时更健谈或说话更快？', options: [
          { value: 0, label: '否' }, { value: 1, label: '是' },
        ]},
        { id: 'mdq_6', text: '您曾有一段时间感觉思维飞奔，或头脑停不下来？', options: [
          { value: 0, label: '否' }, { value: 1, label: '是' },
        ]},
        { id: 'mdq_7', text: '您曾有一段时间很容易被周围事物分散注意力，难以集中或专注？', options: [
          { value: 0, label: '否' }, { value: 1, label: '是' },
        ]},
        { id: 'mdq_8', text: '您曾有一段时间比平时精力充沛得多？', options: [
          { value: 0, label: '否' }, { value: 1, label: '是' },
        ]},
        { id: 'mdq_9', text: '您曾有一段时间比平时活跃得多，做了很多事？', options: [
          { value: 0, label: '否' }, { value: 1, label: '是' },
        ]},
        { id: 'mdq_10', text: '您曾有一段时间比平时更爱社交或外向，例如半夜给朋友打电话？', options: [
          { value: 0, label: '否' }, { value: 1, label: '是' },
        ]},
        { id: 'mdq_11', text: '您曾有一段时间比平时对性更感兴趣？', options: [
          { value: 0, label: '否' }, { value: 1, label: '是' },
        ]},
        { id: 'mdq_12', text: '您曾做过一些不寻常的、别人可能认为过度、愚蠢或冒险的事？', options: [
          { value: 0, label: '否' }, { value: 1, label: '是' },
        ]},
        { id: 'mdq_13', text: '您曾有一段时间花钱太多，以至于给自己或家庭带来麻烦？', options: [
          { value: 0, label: '否' }, { value: 1, label: '是' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 6, severity: '筛查阴性', level: 'negative' },
          { min: 7, max: 13, severity: '筛查阳性', level: 'positive' },
        ],
        note: 'MDQ 阳性（≥7 个"是"）提示可能存在双相障碍，需由精神科医生做进一步面谈诊断。MDQ 的敏感性约 73%，特异性约 90%。',
      },
      analysis: {
        negative: 'MDQ 筛查阴性。如有情绪波动困扰，建议学习情绪日记和规律作息。双相障碍的确诊需专业面谈，如有家族史仍建议咨询。',
        positive: 'MDQ 筛查阳性，提示可能存在双相关症状。重要提醒：1) 请尽快咨询精神科医生做系统诊断评估；2) 双相障碍常被误诊为单相抑郁，因此即使您仅是抑郁发作也请向医生报告躁狂症状史；3) 如需用药，抗抑郁药单独使用可能诱发躁狂，需配合心境稳定剂。',
      },
      methods: {
        medication: '药物治疗：心境稳定剂（锂盐、丙戊酸钠、拉莫三嗪）是双相障碍的基石。急性期可能联用抗精神病药（如奥氮平、喹硫平）。',
        psychotherapy: '心理治疗：人际与社会节律疗法（IPSRT）、认知行为疗法（CBT）、家庭聚焦疗法（FFT）均可减少复发。',
        psychoeducation: '心理教育：识别早期预警信号（如睡眠减少、言语增多）对预防躁狂发作至关重要。',
        lifestyle: '生活方式管理：保持稳定作息、避免睡眠剥夺、限制咖啡因和酒精、规律运动。',
      },
    },
  ],

  // ===== PQ-16：精神病 =====
  psychosis: [
    {
      id: 'pq-16',
      title: 'PQ-16 前驱期问卷',
      subtitle: 'Prodromal Questionnaire-16',
      time: '约 4 分钟',
      desc: 'Ising 等人编制的精神病风险筛查工具，评估过去一个月的异常体验频率。',
      questions: [
        { id: 'pq_1', text: '我对以前喜欢的事物失去了兴趣', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
        { id: 'pq_2', text: '我经常感到紧张、焦躁或焦虑', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
        { id: 'pq_3', text: '我觉得周围的环境变得奇怪或不真实', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
        { id: 'pq_4', text: '我感觉到有些奇怪或无法解释的事情正在发生', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
        { id: 'pq_5', text: '我感觉被人监视或被议论', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
        { id: 'pq_6', text: '我感到无法用言语解释的奇怪事情正在发生', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
        { id: 'pq_7', text: '我担心别人对我的看法', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
        { id: 'pq_8', text: '我经常感觉自己不是自己', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
        { id: 'pq_9', text: '我感觉有人或某种力量在我周围，即使我看不到任何人', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
        { id: 'pq_10', text: '我有时觉得自己不存在了，或者整个世界不存在了', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
        { id: 'pq_11', text: '我觉得别人能读懂我的想法', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
        { id: 'pq_12', text: '我感觉自己受到某种特殊力量的控制', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
        { id: 'pq_13', text: '我听到声音或响声，但周围并没有人', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
        { id: 'pq_14', text: '我看到了别人看不到的东西', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
        { id: 'pq_15', text: '我觉得自己的思维不属于自己', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
        { id: 'pq_16', text: '我觉得平常的事物有特殊的含义——只有我能理解的那种', options: [
          { value: 0, label: '没有' }, { value: 1, label: '有，轻微困扰' },
          { value: 2, label: '有，中等困扰' }, { value: 3, label: '有，严重困扰' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 6, severity: '筛查阴性', level: 'negative' },
          { min: 7, max: 48, severity: '筛查阳性', level: 'positive' },
        ],
        note: 'PQ-16 总分 ≥ 6 分（含困扰评分）为筛查阳性，建议由精神科医生做进一步评估。评估结果不代表诊断。',
      },
      analysis: {
        negative: 'PQ-16 筛查阴性。如仍感到困扰，建议保持规律的生活方式，与人保持联系，避免长期社交孤立。',
        positive: 'PQ-16 筛查阳性。请务必注意：1) 这仅是一个筛查工具，不代表您患有精神疾病；2) 请尽快到精神专科医院做系统的临床评估；3) 早期干预可以显著改善长期预后；4) 如出现幻听、被害妄想或自伤想法，请立即联系心理热线或前往急诊。',
      },
      methods: {
        early: '早期干预：临床高风险状态（CHR）的早期识别和干预对预防精神病发作至关重要。',
        cbt: '认知行为疗法（CBT-p）：专门针对精神病性症状的 CBT，可减轻阳性症状的困扰。',
        family: '家庭干预：家庭支持和教育可以减少复发率。',
        medication: '抗精神病药物：第二代抗精神病药（如奥氮平、利培酮、阿立哌唑）是一线治疗。用药需在精神科医生指导下进行。',
        rehabilitation: '社会功能康复：职业康复、社交技能训练、心理教育可改善长期预后。',
      },
    },
  ],

  // ===== PCL-5：创伤后应激 =====
  ptsd: [
    {
      id: 'pcl-5',
      title: 'PCL-5 创伤后应激障碍检查表',
      subtitle: 'PTSD Checklist for DSM-5',
      time: '约 8 分钟',
      desc: 'Weathers 等编制的 DSM-5 PTSD 症状自评量表，覆盖闯入、回避、负性认知与情绪、高唤醒 4 个症状簇。',
      questions: [
        { id: 'pcl_1', text: '反复出现令你不安的压力事件记忆、想法或印象？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_2', text: '反复做关于压力事件的不安梦境？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_3', text: '突然感到或表现得好像压力事件真的在再次发生（如重回当时、正在经历）？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_4', text: '当有些事情让您想起压力事件时，感到非常不安？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_5', text: '当有些事情让您想起压力事件时，出现强烈的身体反应（如心跳加速、呼吸困难、出汗）？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_6', text: '回避与压力事件有关的记忆、想法或感受？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_7', text: '回避能让您想起压力事件的外部提醒（如人、地方、对话、活动、物品、情境）？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_8', text: '难以记起压力事件的重要部分？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_9', text: '对自己、他人或世界持有强烈的负面信念（如"我不好"、"没有人可以信任"、"世界完全危险"）？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_10', text: '因为压力事件或其后果而责备自己或他人？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_11', text: '有强烈的负面情绪如恐惧、恐怖、愤怒、内疚或羞耻？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_12', text: '对以前喜欢的活动失去兴趣？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_13', text: '感觉与他人疏远或隔断联系？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_14', text: '难以体验到积极情绪（如无法感到幸福、对亲近的人感受不到爱意）？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_15', text: '易怒、愤怒爆发或攻击行为？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_16', text: '过度冒险或做可能伤害自己的事情？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_17', text: '过度警觉或戒备（如总是警惕周围环境）？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_18', text: '容易受惊吓或吓一跳？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_19', text: '难以集中注意力？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
        { id: 'pcl_20', text: '难以入睡或容易惊醒？', options: [
          { value: 0, label: '完全没有' }, { value: 1, label: '轻度' },
          { value: 2, label: '中度' }, { value: 3, label: '重度' }, { value: 4, label: '极重度' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 7, severity: '无明显症状', level: 'minimal' },
          { min: 8, max: 17, severity: '轻度症状', level: 'mild' },
          { min: 18, max: 37, severity: '中度症状', level: 'moderate' },
          { min: 38, max: 80, severity: '重度症状', level: 'severe' },
        ],
        note: 'PCL-5 总分范围 0-80。临床参考界值为 31-33 分。≥ 33 分提示可能存在 PTSD，建议由精神科医生做结构化面谈确认诊断。',
      },
      analysis: {
        minimal: 'PCL-5 得分在正常范围。创伤经历后一定程度的反应是正常的，大多数人会随时间自然恢复。保持社会支持和规律生活。',
        mild: '轻度PTSD症状。建议：1) 正念减压和放松练习；2) 与信任的人保持联系；3) 避免用酒精或药物应对症状；4) 如症状持续超过一个月，建议咨询心理医生。',
        moderate: '中度PTSD症状。建议：1) 寻求专业心理治疗（PE、CPT、EMDR 均为 PTSD 一线心理治疗）；2) 创伤聚焦 CBT 效果明确；3) 医生可能评估是否需要药物辅助治疗；4) 建立安全感和稳定化策略。',
        severe: '重度PTSD症状。请尽快寻求专业帮助：1) 精神科评估和诊断是必要的；2) 心理治疗与药物联合最有效；3) SSRI（舍曲林、帕罗西汀）是 FDA 批准的 PTSD 药物；4) 如出现自伤念头，请拨打心理援助热线 400-161-9995。',
      },
      methods: {
        pe: '延长暴露疗法（PE）：在治疗师指导下系统面对与创伤相关的记忆和情境，减少回避和恐惧。',
        cpt: '认知加工疗法（CPT）：聚焦于创伤后的负性认知的改变，帮助重建适应性信念。',
        emdr: '眼动脱敏与再加工（EMDR）：通过双侧刺激处理创伤记忆，降低情绪的干扰强度。',
        medication: '药物治疗：舍曲林和帕罗西汀是 FDA 批准用于 PTSD 的 SSRI 药物。',
        stabilization: '稳定化技术： grounding（接地）技术、安全岛想象、容器技术可在急性期帮助稳定情绪。',
      },
    },
  ],

  // ===== EAT-26：进食障碍 =====
  eating: [
    {
      id: 'eat-26',
      title: 'EAT-26 进食态度测试',
      subtitle: 'Eating Attitudes Test-26',
      time: '约 6 分钟',
      desc: 'Garner 等编制的进食态度自评量表，涵盖节食、贪食与食物关注、口腔控制三个维度。',
      questions: [
        { id: 'eat_1', text: '我非常害怕超重', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_2', text: '我即使在饿的时候也避免吃东西', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_3', text: '我发现自己总是在想食物', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_4', text: '我有暴食的经历，感觉无法停止进食', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_5', text: '我把食物切成小块', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_6', text: '我知道所吃食物的热量', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_7', text: '我特别避免吃含碳水化合物的食物（如面包、米饭、土豆等）', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_8', text: '我感觉别人希望我多吃一些', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_9', text: '我吃完后会呕吐', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_10', text: '吃完东西后我感到非常内疚', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_11', text: '我特别想变得更瘦', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_12', text: '我在运动时想着消耗卡路里', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_13', text: '别人觉得我太瘦了', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_14', text: '我一直在想身上有脂肪', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_15', text: '我吃饭比一般人慢', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_16', text: '我避免吃含糖的食物', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_17', text: '我吃减肥食品', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_18', text: '我觉得食物控制了我的生活', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_19', text: '我在进食时能控制自己的食物摄入', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_20', text: '我感觉别人在迫使我吃东西', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_21', text: '我在食物上花太多时间和心思', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_22', text: '吃完甜食后我感到不舒服', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_23', text: '我进行节食行为', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_24', text: '我喜欢胃里空着的感觉', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_25', text: '我有吃完饭就呕吐的冲动', options: [
          { value: 3, label: '总是' }, { value: 2, label: '通常' }, { value: 1, label: '经常' },
          { value: 0, label: '有时' }, { value: 0, label: '很少' }, { value: 0, label: '从不' },
        ]},
        { id: 'eat_26', text: '我喜欢尝试新的美味食物', options: [
          { value: 0, label: '总是' }, { value: 0, label: '通常' }, { value: 0, label: '经常' },
          { value: 1, label: '有时' }, { value: 2, label: '很少' }, { value: 3, label: '从不' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 9, severity: '正常范围', level: 'minimal' },
          { min: 10, max: 19, severity: '临界范围', level: 'borderline' },
          { min: 20, max: 50, severity: '阳性—需进一步评估', level: 'positive' },
          { min: 51, max: 78, severity: '显著阳性—高度关注', level: 'severe' },
        ],
        note: 'EAT-26 总分范围 0-78。总分 ≥ 20 分提示存在进食障碍风险，需由专业医生做进一步临床评估。EAT-26 是筛查工具，不能替代诊断性面谈。',
      },
      analysis: {
        minimal: 'EAT-26 得分在正常范围。保持与食物的健康关系，均衡饮食，避免过度关注体重和外貌。',
        borderline: '临界范围。建议关注自己与食物的关系。如果存在对体重体型的持续忧虑、节食行为或暴食倾向，建议与心理医生或营养师交流。',
        positive: 'EAT-26 筛查阳性。建议：1) 尽快到精神科或进食障碍专科门诊做系统评估；2) 进食障碍是可以治疗的，早期干预效果更佳；3) 认知行为疗法专门用于进食障碍（CBT-E）是首选心理治疗；4) 营养监测和医学评估同样重要。',
        severe: 'EAT-26 显著阳性。请尽快寻求专业帮助：1) 进食障碍可能伴随严重医学并发症，需进行全面的身体检查；2) 神经性厌食症可能需要住院治疗以恢复体重；3) 心理治疗（CBT-E、FBT）联合营养康复是标准方案；4) 如出现严重体重下降、电解质紊乱或自伤想法，请立即前往急诊。',
      },
      methods: {
        cbte: '认知行为疗法强化版（CBT-E）：针对进食障碍的专门 CBT 方案，聚焦饮食规律化、体重担忧和维持因素。',
        fbt: '家庭治疗（FBT）：对于青少年进食障碍，家庭治疗是目前证据最充分的治疗方法。',
        medication: '药物治疗：氟西汀是 FDA 批准用于神经性贪食症和暴食障碍的药物。',
        nutrition: '营养康复：注册营养师参与的饮食计划和营养监测是治疗的重要组成部分。',
        medical: '医学监测：进食障碍可能出现电解质紊乱、心脏问题等严重并发症，需要定期体检。',
      },
    },
  ],

  // ===== 儿童情绪管理 =====
  'child-emotion': [
    {
      id: 'cers',
      title: 'CERS 儿童情绪调节能力评估',
      subtitle: 'Child Emotion Regulation Scale',
      time: '约 5 分钟',
      desc: '评估儿童在识别、表达和调节情绪方面的能力水平，涵盖情绪觉察、表达策略和调节技巧。',
      questions: [
        { id: 'cers_1', text: '孩子能准确说出自己的情绪感受（如"我生气了""我很难过"）', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cers_2', text: '孩子发脾气时，能在合理时间内平静下来', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cers_3', text: '孩子会用适当的方式表达不满（用语言而非哭闹或攻击）', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cers_4', text: '当计划改变时，孩子能灵活调整并接受', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cers_5', text: '孩子能识别他人的情绪（如"妈妈不开心""朋友害怕了"）', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cers_6', text: '遇到挫折时，孩子能主动寻求帮助或安慰', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cers_7', text: '孩子在情绪激动时不会伤害自己或他人', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cers_8', text: '孩子能接受"不能立刻得到想要的东西"的等待', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cers_9', text: '孩子会主动和大人分享自己的感受和经历', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'cers_10', text: '孩子能使用放松技巧（深呼吸、数数等）帮助自己冷静', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 16, severity: '需重点关注', level: 'minimal' },
          { min: 17, max: 24, severity: '轻度困难', level: 'mild' },
          { min: 25, max: 32, severity: '中等水平', level: 'moderate' },
          { min: 33, max: 40, severity: '能力良好', level: 'good' },
        ],
        note: '总分范围 0-40。分数越高说明情绪调节能力越好。每题按频率计分，重点关注得分较低的维度。',
      },
      analysis: {
        minimal: '儿童情绪调节能力需要重点关注。建议寻求儿童心理专业人员评估，进行情绪社交技能训练。',
        mild: '存在轻度情绪调节困难。建议：1) 情绪绘本阅读和角色扮演；2) 建立清晰的情绪表达规则；3) 家长情绪教练技巧培训；4) 正面强化适当情绪表达。',
        moderate: '情绪调节能力处于中等水平。建议：1) 继续培养情绪词汇和表达技巧；2) 情绪温度计等可视化工具；3) 建立冷静角等情绪管理空间；4) 规律作息和充足睡眠有助于情绪稳定。',
        good: '儿童情绪调节能力良好。继续保持积极的亲子沟通和情绪教育环境。',
      },
      methods: {
        emotionCoaching: '情绪教练法：家长帮助孩子识别、理解和调节情绪，将负面情绪视为教育契机。',
        socialStory: '社交故事：用简单故事和图片呈现社交情境和适当反应，提升情绪理解能力。',
        calmDown: '冷静策略：深呼吸、数数、暂停角等帮助孩子在情绪激动时自我安抚。',
        playTherapy: '游戏治疗：通过游戏表达情绪和冲突，促进情绪健康发展。',
      },
    },
    {
      id: 'sdq-child',
      title: 'SDQ 儿童困难与优势问卷',
      subtitle: 'Strengths and Difficulties Questionnaire',
      time: '约 5 分钟',
      desc: '评估儿童的情绪症状、行为问题、多动注意力、同伴关系和亲社会行为五个维度。',
      questions: [
        { id: 'sdq_1', text: '体贴他人的感受', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_2', text: '坐立不安、过分活跃、不能长时间保持安静', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_3', text: '经常头痛、胃痛或身体不适', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_4', text: '乐于与他人分享（食物、玩具、笔等）', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_5', text: '经常发脾气或情绪暴躁', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_6', text: '比较孤僻、倾向于独自玩耍', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_7', text: '通常比较听话、做大人要求做的事情', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_8', text: '担心很多事、经常看起来焦虑', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_9', text: '如果有人受伤或难过，愿意帮忙', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_10', text: '持续坐立不安或不停扭动', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_11', text: '至少有一个好朋友', options: [
          { value: 2, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 0, label: '完全符合' },
        ]},
        { id: 'sdq_12', text: '经常与别的孩子吵架或欺负他们', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_13', text: '经常不快乐、心情沉重或哭泣', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_14', text: '通常被其他孩子喜欢', options: [
          { value: 2, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 0, label: '完全符合' },
        ]},
        { id: 'sdq_15', text: '容易分心、注意力不集中', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_16', text: '做事情前三思（不冲动）', options: [
          { value: 2, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 0, label: '完全符合' },
        ]},
        { id: 'sdq_17', text: '对比自己小的孩子友善', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_18', text: '经常说谎或欺骗', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_19', text: '被别的孩子作弄或欺负', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
        { id: 'sdq_20', text: '经常自愿帮助他人（父母、老师或其他孩子）', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '完全符合' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 13, severity: '正常范围', level: 'normal' },
          { min: 14, max: 16, severity: '边缘水平', level: 'borderline' },
          { min: 17, max: 40, severity: '异常范围', level: 'abnormal' },
        ],
        note: 'SDQ 总分范围 0-40（困难总分）。困难总分 ≥ 17 分为异常，14-16 分为边缘。亲社会行为维度单独计分。',
      },
      analysis: {
        normal: 'SDQ 得分正常。儿童在各发展领域表现良好，建议继续保持积极的家庭环境和社交支持。',
        borderline: '处于边缘水平。建议关注儿童的情绪和行为变化，如持续存在困难，建议儿童心理门诊做进一步评估。',
        abnormal: 'SDQ 显示异常范围。建议尽快到儿童心理或精神科做系统评估。早期干预效果显著。',
      },
      methods: {
        parentTraining: '家长管理培训（PMT）：帮助家长建立有效的行为管理策略和正面管教技巧。',
        socialSkills: '社交技能训练：通过角色扮演和小组活动提升同伴交往能力。',
        schoolSupport: '学校支持：与老师沟通建立课堂行为支持计划。',
        familyTherapy: '家庭治疗：改善亲子互动模式，建立一致的家庭规则。',
      },
    },
  ],

  // ===== 青少年成长咨询 =====
  adolescent: [
    {
      id: 'psci',
      title: 'PSCI 青少年自我概念量表',
      subtitle: 'Perception of Self-Concept Inventory',
      time: '约 5 分钟',
      desc: '评估青少年在学业自我、社交自我、情绪自我和身体自我四个维度的自我认知水平。',
      questions: [
        { id: 'psci_1', text: '我对自己的学习能力感到满意', options: [
          { value: 0, label: '完全不同意' }, { value: 1, label: '不太同意' },
          { value: 2, label: '一般' }, { value: 3, label: '比较同意' }, { value: 4, label: '完全同意' },
        ]},
        { id: 'psci_2', text: '我觉得自己很容易交到朋友', options: [
          { value: 0, label: '完全不同意' }, { value: 1, label: '不太同意' },
          { value: 2, label: '一般' }, { value: 3, label: '比较同意' }, { value: 4, label: '完全同意' },
        ]},
        { id: 'psci_3', text: '我经常对自己的情绪感到困惑', options: [
          { value: 4, label: '完全不同意' }, { value: 3, label: '不太同意' },
          { value: 2, label: '一般' }, { value: 1, label: '比较同意' }, { value: 0, label: '完全同意' },
        ]},
        { id: 'psci_4', text: '我喜欢自己的外表', options: [
          { value: 0, label: '完全不同意' }, { value: 1, label: '不太同意' },
          { value: 2, label: '一般' }, { value: 3, label: '比较同意' }, { value: 4, label: '完全同意' },
        ]},
        { id: 'psci_5', text: '我觉得自己有明确的人生方向', options: [
          { value: 0, label: '完全不同意' }, { value: 1, label: '不太同意' },
          { value: 2, label: '一般' }, { value: 3, label: '比较同意' }, { value: 4, label: '完全同意' },
        ]},
        { id: 'psci_6', text: '在团体中我常常感到不自在', options: [
          { value: 4, label: '完全不同意' }, { value: 3, label: '不太同意' },
          { value: 2, label: '一般' }, { value: 1, label: '比较同意' }, { value: 0, label: '完全同意' },
        ]},
        { id: 'psci_7', text: '我能很好地处理学业压力', options: [
          { value: 0, label: '完全不同意' }, { value: 1, label: '不太同意' },
          { value: 2, label: '一般' }, { value: 3, label: '比较同意' }, { value: 4, label: '完全同意' },
        ]},
        { id: 'psci_8', text: '我觉得别人更喜欢和我做朋友', options: [
          { value: 0, label: '完全不同意' }, { value: 1, label: '不太同意' },
          { value: 2, label: '一般' }, { value: 3, label: '比较同意' }, { value: 4, label: '完全同意' },
        ]},
        { id: 'psci_9', text: '我常常因为小事感到烦躁或沮丧', options: [
          { value: 4, label: '完全不同意' }, { value: 3, label: '不太同意' },
          { value: 2, label: '一般' }, { value: 1, label: '比较同意' }, { value: 0, label: '完全同意' },
        ]},
        { id: 'psci_10', text: '我对自己的身体发育感到满意', options: [
          { value: 0, label: '完全不同意' }, { value: 1, label: '不太同意' },
          { value: 2, label: '一般' }, { value: 3, label: '比较同意' }, { value: 4, label: '完全同意' },
        ]},
        { id: 'psci_11', text: '我相信自己有能力实现目标', options: [
          { value: 0, label: '完全不同意' }, { value: 1, label: '不太同意' },
          { value: 2, label: '一般' }, { value: 3, label: '比较同意' }, { value: 4, label: '完全同意' },
        ]},
        { id: 'psci_12', text: '与父母沟通时我觉得他们不理解我', options: [
          { value: 4, label: '完全不同意' }, { value: 3, label: '不太同意' },
          { value: 2, label: '一般' }, { value: 1, label: '比较同意' }, { value: 0, label: '完全同意' },
        ]},
        { id: 'psci_13', text: '我能坚持完成自己设定的计划', options: [
          { value: 0, label: '完全不同意' }, { value: 1, label: '不太同意' },
          { value: 2, label: '一般' }, { value: 3, label: '比较同意' }, { value: 4, label: '完全同意' },
        ]},
        { id: 'psci_14', text: '我觉得自己是值得被喜欢的', options: [
          { value: 0, label: '完全不同意' }, { value: 1, label: '不太同意' },
          { value: 2, label: '一般' }, { value: 3, label: '比较同意' }, { value: 4, label: '完全同意' },
        ]},
        { id: 'psci_15', text: '面对挑战时我容易放弃', options: [
          { value: 4, label: '完全不同意' }, { value: 3, label: '不太同意' },
          { value: 2, label: '一般' }, { value: 1, label: '比较同意' }, { value: 0, label: '完全同意' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 24, severity: '自我概念积极', level: 'positive' },
          { min: 25, max: 36, severity: '自我概念一般', level: 'average' },
          { min: 37, max: 48, severity: '自我概念偏低', level: 'low' },
          { min: 49, max: 60, severity: '自我概念消极', level: 'negative' },
        ],
        note: '总分范围 0-60。分数越低表示自我概念越积极。建议关注得分最低的维度，针对性发展。',
      },
      analysis: {
        positive: '自我概念积极。青少年对自身有较为正面的认知，继续保持健康的自我认同发展。',
        average: '自我概念处于一般水平。青春期自我认同正在发展中有波动是正常的。建议多参与擅长的活动，增强自信心。',
        low: '自我概念偏低。建议：1) 关注优势领域而非短板；2) 设定小目标逐步积累成就感；3) 与信任的成年人或心理咨询师交流；4) 减少社交媒体上的社会比较。',
        negative: '自我概念消极。建议寻求心理辅导帮助：1) 认知行为疗法有助于调整消极自我认知；2) 探索和强化个人优势；3) 建立支持性社交网络；4) 如伴随抑郁情绪，建议专业评估。',
      },
      methods: {
        strengthBased: '优势取向干预：聚焦青少年已有的优势和资源，增强自我效能感。',
        cbt: '认知行为疗法：识别和调整关于自我的负面自动化思维。',
        narrative: '叙事治疗：帮助青少年重构自我叙事，看到自己故事中的力量和韧性。',
        family: '家庭沟通：改善亲子沟通模式，减少冲突，增强理解和支持。',
      },
    },
    {
      id: 'yapa',
      title: 'YAPA 青少年适应力评估',
      subtitle: 'Youth Adaptation and Wellbeing Assessment',
      time: '约 5 分钟',
      desc: '评估青少年在学业、情绪、社交和家庭四个核心领域的适应状况和整体幸福感。',
      questions: [
        { id: 'yapa_1', text: '我能按时完成学业任务', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'yapa_2', text: '我常常感到孤独', options: [
          { value: 4, label: '从不' }, { value: 3, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 1, label: '经常' }, { value: 0, label: '总是' },
        ]},
        { id: 'yapa_3', text: '我对学习成绩感到焦虑', options: [
          { value: 4, label: '从不' }, { value: 3, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 1, label: '经常' }, { value: 0, label: '总是' },
        ]},
        { id: 'yapa_4', text: '我有可以倾诉心事的朋友', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'yapa_5', text: '我和父母经常发生冲突', options: [
          { value: 4, label: '从不' }, { value: 3, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 1, label: '经常' }, { value: 0, label: '总是' },
        ]},
        { id: 'yapa_6', text: '我对未来感到迷茫', options: [
          { value: 4, label: '从不' }, { value: 3, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 1, label: '经常' }, { value: 0, label: '总是' },
        ]},
        { id: 'yapa_7', text: '参加集体活动时我感到开心', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'yapa_8', text: '我觉得生活压力很大', options: [
          { value: 4, label: '从不' }, { value: 3, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 1, label: '经常' }, { value: 0, label: '总是' },
        ]},
        { id: 'yapa_9', text: '我能有效安排自己的学习和休息时间', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'yapa_10', text: '我在同学中感到被接纳', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'yapa_11', text: '我能和父母商量重要的事情', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'yapa_12', text: '我容易因为小事被激怒', options: [
          { value: 4, label: '从不' }, { value: 3, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 1, label: '经常' }, { value: 0, label: '总是' },
        ]},
        { id: 'yapa_13', text: '我觉得自己的课外生活丰富多彩', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'yapa_14', text: '我有自己信任的成年人可以求助', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
        { id: 'yapa_15', text: '我对自己整体感到满意', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '总是' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 20, severity: '适应良好', level: 'good' },
          { min: 21, max: 30, severity: '轻度适应困难', level: 'mild' },
          { min: 31, max: 40, severity: '中度适应困难', level: 'moderate' },
          { min: 41, max: 50, severity: '重度适应困难', level: 'severe' },
        ],
        note: '总分范围 0-50（反向题已转换）。分数越高表示适应困难越明显。关注失分最多的领域。',
      },
      analysis: {
        good: '适应良好。青少年在学业、情绪、社交和家庭方面发展均衡。继续保持良好的支持网络。',
        mild: '轻度适应困难。青春期面临的变化可能带来短暂不适应。建议通过运动、兴趣爱好的方式释放压力，与信任的人保持沟通。',
        moderate: '中度适应困难。建议：1) 寻求学校心理辅导老师的帮助；2) 学习压力管理和情绪调节技巧；3) 改善亲子沟通，必要时家庭咨询；4) 建立健康的社交联系和支持系统。',
        severe: '重度适应困难。建议尽快寻求专业心理帮助：1) 心理咨询或治疗有助于全面评估和支持；2) 探索青少年友好型心理健康服务；3) 如伴随自伤念头，请立即拨打心理援助热线。',
      },
      methods: {
        counseling: '青少年心理咨询：提供安全空间探索自我认同、人际关系和情绪表达。',
        stress: '压力管理：时间管理训练、放松技巧、正念练习。',
        social: '社交技能训练：同伴沟通技巧、冲突解决、团体活动参与。',
        family: '家庭治疗：改善家庭沟通模式，增进亲子理解和联结。',
      },
    },
  ],

  // ===== 正念减压训练 =====
  mindfulness: [
    {
      id: 'maas',
      title: 'MAAS 正念注意觉知量表',
      subtitle: 'Mindful Attention Awareness Scale',
      time: '约 3 分钟',
      desc: '评估在日常生活中对当下体验的觉知和关注程度，是使用最广的正念水平测量工具。',
      questions: [
        { id: 'maas_1', text: '我可能会经历某种情绪，过一会儿才意识到它', options: [
          { value: 1, label: '几乎总是' }, { value: 2, label: '经常' },
          { value: 3, label: '有时' }, { value: 4, label: '偶尔' }, { value: 5, label: '很少' }, { value: 6, label: '几乎从不' },
        ]},
        { id: 'maas_2', text: '我会因为走神、粗心大意或不在当下而打碎或弄翻东西', options: [
          { value: 1, label: '几乎总是' }, { value: 2, label: '经常' },
          { value: 3, label: '有时' }, { value: 4, label: '偶尔' }, { value: 5, label: '很少' }, { value: 6, label: '几乎从不' },
        ]},
        { id: 'maas_3', text: '我发现自己很难专注于当下的时刻', options: [
          { value: 1, label: '几乎总是' }, { value: 2, label: '经常' },
          { value: 3, label: '有时' }, { value: 4, label: '偶尔' }, { value: 5, label: '很少' }, { value: 6, label: '几乎从不' },
        ]},
        { id: 'maas_4', text: '我走路或开车时倾向于走神，不注意自己在做什么', options: [
          { value: 1, label: '几乎总是' }, { value: 2, label: '经常' },
          { value: 3, label: '有时' }, { value: 4, label: '偶尔' }, { value: 5, label: '很少' }, { value: 6, label: '几乎从不' },
        ]},
        { id: 'maas_5', text: '我倾向于不注意身体的紧张感或不适感', options: [
          { value: 1, label: '几乎总是' }, { value: 2, label: '经常' },
          { value: 3, label: '有时' }, { value: 4, label: '偶尔' }, { value: 5, label: '很少' }, { value: 6, label: '几乎从不' },
        ]},
        { id: 'maas_6', text: '别人一告诉我名字，我几乎立刻就会忘记', options: [
          { value: 1, label: '几乎总是' }, { value: 2, label: '经常' },
          { value: 3, label: '有时' }, { value: 4, label: '偶尔' }, { value: 5, label: '很少' }, { value: 6, label: '几乎从不' },
        ]},
        { id: 'maas_7', text: '我似乎在自动运转，没有太多意识到自己在做什么', options: [
          { value: 1, label: '几乎总是' }, { value: 2, label: '经常' },
          { value: 3, label: '有时' }, { value: 4, label: '偶尔' }, { value: 5, label: '很少' }, { value: 6, label: '几乎从不' },
        ]},
        { id: 'maas_8', text: '我匆忙地完成活动，没有真正注意它们', options: [
          { value: 1, label: '几乎总是' }, { value: 2, label: '经常' },
          { value: 3, label: '有时' }, { value: 4, label: '偶尔' }, { value: 5, label: '很少' }, { value: 6, label: '几乎从不' },
        ]},
        { id: 'maas_9', text: '我过于专注于目标，以至于与当下脱节', options: [
          { value: 1, label: '几乎总是' }, { value: 2, label: '经常' },
          { value: 3, label: '有时' }, { value: 4, label: '偶尔' }, { value: 5, label: '很少' }, { value: 6, label: '几乎从不' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 27, severity: '正念水平较低', level: 'low' },
          { min: 28, max: 40, severity: '正念水平中等', level: 'medium' },
          { min: 41, max: 54, severity: '正念水平较高', level: 'high' },
        ],
        note: 'MAAS 平均分范围 1-6。总分越高说明正念觉知水平越高。较低的得分（尤其是 ≤3 分）表明经常处于"自动驾驶"模式。',
      },
      analysis: {
        low: '正念水平较低。您可能经常处于"自动导航"状态。建议从每天 5 分钟的正念呼吸开始练习。',
        medium: '正念水平中等。已经有了一定的正念觉知基础，建议规律练习以深化体验。',
        high: '正念水平较高。您有良好的日常正念觉知能力，继续坚持练习即可。',
      },
      methods: {
        mindfulBreathing: '正念呼吸：专注于呼吸的进出，当走神时温和地回到呼吸。每天 5-20 分钟。',
        bodyScan: '身体扫描：系统关注身体各部位的感觉，培养身体觉知能力，每次 15-30 分钟。',
        mindfulEating: '正念饮食：用所有感官体验食物，慢慢进食，注意味道、质地和饱足感。',
        walkingMeditation: '行走冥想：步行时关注脚步和身体的感觉，将注意力带到每一步。',
      },
    },
    {
      id: 'ffmq',
      title: 'FFMQ 五因素正念量表（简版）',
      subtitle: 'Five Facet Mindfulness Questionnaire',
      time: '约 5 分钟',
      desc: '从观察、描述、觉知行动、不评判、不反应五个维度评估正念水平。',
      questions: [
        { id: 'ffmq_1', text: '我善于注意到内心的感受和情绪', options: [
          { value: 1, label: '从不或极少' }, { value: 2, label: '较少' },
          { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是或几乎总是' },
        ]},
        { id: 'ffmq_2', text: '我能用词语清晰地描述我的情绪', options: [
          { value: 1, label: '从不或极少' }, { value: 2, label: '较少' },
          { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是或几乎总是' },
        ]},
        { id: 'ffmq_3', text: '我发现自己会走神而不自知', options: [
          { value: 5, label: '从不或极少' }, { value: 4, label: '较少' },
          { value: 3, label: '有时' }, { value: 2, label: '经常' }, { value: 1, label: '总是或几乎总是' },
        ]},
        { id: 'ffmq_4', text: '我批评自己的不理性或不适当的情绪', options: [
          { value: 5, label: '从不或极少' }, { value: 4, label: '较少' },
          { value: 3, label: '有时' }, { value: 2, label: '经常' }, { value: 1, label: '总是或几乎总是' },
        ]},
        { id: 'ffmq_5', text: '我有情绪反应时，能在行动之前先暂停', options: [
          { value: 1, label: '从不或极少' }, { value: 2, label: '较少' },
          { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是或几乎总是' },
        ]},
        { id: 'ffmq_6', text: '我注意观察周围环境中的声音、气味或光线', options: [
          { value: 1, label: '从不或极少' }, { value: 2, label: '较少' },
          { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是或几乎总是' },
        ]},
        { id: 'ffmq_7', text: '我发现自己难以表达内心的想法和感受', options: [
          { value: 5, label: '从不或极少' }, { value: 4, label: '较少' },
          { value: 3, label: '有时' }, { value: 2, label: '经常' }, { value: 1, label: '总是或几乎总是' },
        ]},
        { id: 'ffmq_8', text: '我在做事时容易分心', options: [
          { value: 5, label: '从不或极少' }, { value: 4, label: '较少' },
          { value: 3, label: '有时' }, { value: 2, label: '经常' }, { value: 1, label: '总是或几乎总是' },
        ]},
        { id: 'ffmq_9', text: '我评判自己的想法是好或坏', options: [
          { value: 5, label: '从不或极少' }, { value: 4, label: '较少' },
          { value: 3, label: '有时' }, { value: 2, label: '经常' }, { value: 1, label: '总是或几乎总是' },
        ]},
        { id: 'ffmq_10', text: '我能观察情绪来来去去，而不被它们控制', options: [
          { value: 1, label: '从不或极少' }, { value: 2, label: '较少' },
          { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是或几乎总是' },
        ]},
        { id: 'ffmq_11', text: '即使感到痛苦，我也能保持对当下的觉察', options: [
          { value: 1, label: '从不或极少' }, { value: 2, label: '较少' },
          { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是或几乎总是' },
        ]},
        { id: 'ffmq_12', text: '当我心烦时，我倾向于立即做出反应', options: [
          { value: 5, label: '从不或极少' }, { value: 4, label: '较少' },
          { value: 3, label: '有时' }, { value: 2, label: '经常' }, { value: 1, label: '总是或几乎总是' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 24, severity: '正念水平较低', level: 'low' },
          { min: 25, max: 36, severity: '正念水平中等', level: 'medium' },
          { min: 37, max: 48, severity: '正念水平良好', level: 'good' },
          { min: 49, max: 60, severity: '正念水平优秀', level: 'excellent' },
        ],
        note: 'FFMQ 包含观察、描述、觉知行动、不评判、不反应五个维度。可从各维度得分看具体优势和短板。',
      },
      analysis: {
        low: '正念水平较低。建议从基础的呼吸冥想开始，每天 5-10 分钟，逐步培养觉察习惯。',
        medium: '正念水平中等。已具备初步正念能力，建议规律练习，关注得分较低的维度针对性地加强。',
        good: '正念水平良好。正念练习已有一定基础，建议深化练习，尝试正念 Retreat 或进阶课程。',
        excellent: '正念水平优秀。正念能力较强，可继续维持并探索将正念融入生活的更多方面。',
      },
      methods: {
        observe: '观察维度练习：留意身体感觉、声音、气味等当下感官体验。',
        describe: '描述维度练习：用词语如实描述内心体验，不评判对错。',
        actAware: '觉知行动练习：专注于正在做的事情，一次只做一件事。',
        nonJudge: '不评判练习：观察想法和情绪的到来，不贴上"好"或"坏"的标签。',
        nonReact: '不反应练习：在情绪反应前创造暂停空间，选择回应而非反应。',
      },
    },
  ],

  // ===== 社交焦虑突破 =====
  'social-anxiety': [
    {
      id: 'sias',
      title: 'SIAS 社交互动焦虑量表',
      subtitle: 'Social Interaction Anxiety Scale',
      time: '约 3 分钟',
      desc: '评估在各种社交互动场景中体验到的焦虑程度，聚焦于日常社交中的紧张和恐惧。',
      questions: [
        { id: 'sias_1', text: '我在社交场合中感到紧张', options: [
          { value: 0, label: '完全不符合' }, { value: 1, label: '有点符合' },
          { value: 2, label: '中等符合' }, { value: 3, label: '很符合' }, { value: 4, label: '完全符合' },
        ]},
        { id: 'sias_2', text: '我难以与不太熟悉的人进行交流', options: [
          { value: 0, label: '完全不符合' }, { value: 1, label: '有点符合' },
          { value: 2, label: '中等符合' }, { value: 3, label: '很符合' }, { value: 4, label: '完全符合' },
        ]},
        { id: 'sias_3', text: '我在与人交谈时担心自己会说错话', options: [
          { value: 0, label: '完全不符合' }, { value: 1, label: '有点符合' },
          { value: 2, label: '中等符合' }, { value: 3, label: '很符合' }, { value: 4, label: '完全符合' },
        ]},
        { id: 'sias_4', text: '我在聚会或集体活动中感到不自在', options: [
          { value: 0, label: '完全不符合' }, { value: 1, label: '有点符合' },
          { value: 2, label: '中等符合' }, { value: 3, label: '很符合' }, { value: 4, label: '完全符合' },
        ]},
        { id: 'sias_5', text: '我在与权威人士交谈时特别紧张', options: [
          { value: 0, label: '完全不符合' }, { value: 1, label: '有点符合' },
          { value: 2, label: '中等符合' }, { value: 3, label: '很符合' }, { value: 4, label: '完全符合' },
        ]},
        { id: 'sias_6', text: '我担心别人如何看待我', options: [
          { value: 0, label: '完全不符合' }, { value: 1, label: '有点符合' },
          { value: 2, label: '中等符合' }, { value: 3, label: '很符合' }, { value: 4, label: '完全符合' },
        ]},
        { id: 'sias_7', text: '我害怕在公共场合讲话或发言', options: [
          { value: 0, label: '完全不符合' }, { value: 1, label: '有点符合' },
          { value: 2, label: '中等符合' }, { value: 3, label: '很符合' }, { value: 4, label: '完全符合' },
        ]},
        { id: 'sias_8', text: '当成为众人注意的焦点时我感到恐慌', options: [
          { value: 0, label: '完全不符合' }, { value: 1, label: '有点符合' },
          { value: 2, label: '中等符合' }, { value: 3, label: '很符合' }, { value: 4, label: '完全符合' },
        ]},
        { id: 'sias_9', text: '我很难与人进行眼神交流', options: [
          { value: 0, label: '完全不符合' }, { value: 1, label: '有点符合' },
          { value: 2, label: '中等符合' }, { value: 3, label: '很符合' }, { value: 4, label: '完全符合' },
        ]},
        { id: 'sias_10', text: '我担心自己会在社交场合中出丑', options: [
          { value: 0, label: '完全不符合' }, { value: 1, label: '有点符合' },
          { value: 2, label: '中等符合' }, { value: 3, label: '很符合' }, { value: 4, label: '完全符合' },
        ]},
        { id: 'sias_11', text: '我避免参加社交活动', options: [
          { value: 0, label: '完全不符合' }, { value: 1, label: '有点符合' },
          { value: 2, label: '中等符合' }, { value: 3, label: '很符合' }, { value: 4, label: '完全符合' },
        ]},
        { id: 'sias_12', text: '我在与异性交谈时特别困难', options: [
          { value: 0, label: '完全不符合' }, { value: 1, label: '有点符合' },
          { value: 2, label: '中等符合' }, { value: 3, label: '很符合' }, { value: 4, label: '完全符合' },
        ]},
        { id: 'sias_13', text: '我担心自己说的话题别人不感兴趣', options: [
          { value: 0, label: '完全不符合' }, { value: 1, label: '有点符合' },
          { value: 2, label: '中等符合' }, { value: 3, label: '很符合' }, { value: 4, label: '完全符合' },
        ]},
        { id: 'sias_14', text: '当我不得不与多人交谈时感到不知所措', options: [
          { value: 0, label: '完全不符合' }, { value: 1, label: '有点符合' },
          { value: 2, label: '中等符合' }, { value: 3, label: '很符合' }, { value: 4, label: '完全符合' },
        ]},
        { id: 'sias_15', text: '我在社交活动后反复回想自己的表现', options: [
          { value: 0, label: '完全不符合' }, { value: 1, label: '有点符合' },
          { value: 2, label: '中等符合' }, { value: 3, label: '很符合' }, { value: 4, label: '完全符合' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 22, severity: '社交焦虑较轻', level: 'minimal' },
          { min: 23, max: 34, severity: '轻度社交焦虑', level: 'mild' },
          { min: 35, max: 46, severity: '中度社交焦虑', level: 'moderate' },
          { min: 47, max: 60, severity: '重度社交焦虑', level: 'severe' },
        ],
        note: 'SIAS 总分范围 0-60。≥ 34 分提示存在明显社交焦虑，建议专业评估。',
      },
      analysis: {
        minimal: '社交焦虑较轻。您在社交场合中的紧张感在正常范围内。继续保持和练习社交技能。',
        mild: '轻度社交焦虑。在部分社交场合会感到紧张，但总体上仍能参与。建议通过逐步暴露练习增强自信。',
        moderate: '中度社交焦虑。社交焦虑已对部分生活领域造成干扰。建议：1) CBT 是社交焦虑的一线心理治疗；2) 认知重建帮助识别和调整负面社交信念；3) 逐步暴露练习减少回避行为；4) 社交技能训练提升自信。',
        severe: '重度社交焦虑。社交焦虑已显著影响日常生活。请尽快寻求专业帮助：1) 认知行为疗法（CBT）效果显著；2) 团体 CBT 可提供安全练习环境；3) 医生可能评估是否需要药物辅助。',
      },
      methods: {
        cbt: '认知行为疗法（CBT）：识别和调整"别人会负面评价我"的自动化思维，结合行为暴露减少回避。',
        exposure: '暴露疗法：系统地、逐步地面对恐惧的社交情境，从低焦虑到高焦虑循序渐进。',
        socialSkills: '社交技能训练：学习开启对话、维持对话、表达观点等具体社交技巧。',
        groupTherapy: '团体治疗：在安全的小组环境中练习社交互动，获得同伴反馈和支持。',
        medication: '药物治疗：SSRI（帕罗西汀、舍曲林、艾司西酞普兰）是社交焦虑症一线药物。',
      },
    },
    {
      id: 'sad',
      title: 'SAD 社交回避与苦恼量表',
      subtitle: 'Social Avoidance and Distress Scale',
      time: '约 3 分钟',
      desc: '评估在社交情境中的回避行为和主观苦恼体验，了解社交焦虑的行为和情感两个层面。',
      questions: [
        { id: 'sad_1', text: '即使在不正式的社交场合，我也感到紧张', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '非常符合' },
        ]},
        { id: 'sad_2', text: '我尽量避免与人有太多目光接触', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '非常符合' },
        ]},
        { id: 'sad_3', text: '在社交场合中我感到口干或心跳加速', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '非常符合' },
        ]},
        { id: 'sad_4', text: '我倾向于拒绝社交聚会的邀请', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '非常符合' },
        ]},
        { id: 'sad_5', text: '当我必须在别人面前做事时，我的手会颤抖', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '非常符合' },
        ]},
        { id: 'sad_6', text: '我害怕被问到个人问题', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '非常符合' },
        ]},
        { id: 'sad_7', text: '我在新的社交环境中感到极度不自在', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '非常符合' },
        ]},
        { id: 'sad_8', text: '我经常为社交场合中自己的表现感到尴尬', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '非常符合' },
        ]},
        { id: 'sad_9', text: '我宁愿独自做事情也不愿与别人一起', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '非常符合' },
        ]},
        { id: 'sad_10', text: '当与不熟悉的人交谈时我会脸红或出汗', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '非常符合' },
        ]},
        { id: 'sad_11', text: '我害怕在会议上被点名发言', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '非常符合' },
        ]},
        { id: 'sad_12', text: '我经常找借口逃避社交活动', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '非常符合' },
        ]},
        { id: 'sad_13', text: '我在社交活动之后感到筋疲力尽', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '非常符合' },
        ]},
        { id: 'sad_14', text: '我担心自己在社交场合中会说不出话', options: [
          { value: 0, label: '不符合' }, { value: 1, label: '有点符合' }, { value: 2, label: '非常符合' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 7, severity: '社交回避较少', level: 'minimal' },
          { min: 8, max: 14, severity: '轻度社交回避', level: 'mild' },
          { min: 15, max: 21, severity: '中度社交回避', level: 'moderate' },
          { min: 22, max: 28, severity: '重度社交回避/苦恼', level: 'severe' },
        ],
        note: 'SAD 总分范围 0-28。≥ 15 分提示存在明显社交回避和苦恼，建议寻求专业帮助。',
      },
      analysis: {
        minimal: '社交回避行为较少。您在社交情境中的不适感在可控范围内。继续积极社交，拓展舒适圈。',
        mild: '轻度社交回避。在部分情境下倾向于回避，但仍有主动社交的意愿。建议从低压力社交情境开始逐步尝试。',
        moderate: '中度社交回避。回避行为已开始影响社交生活和人际关系。建议：1) 认知行为疗法的暴露练习效果显著；2) 从焦虑等级最低的情境开始面对；3) 记录社交成功体验，强化积极信念。',
        severe: '重度社交回避/苦恼。社交回避已严重影响生活质量。请尽快寻求专业帮助：1) CBT 是社交焦虑的首选治疗；2) 暴露与反应阻止可有效减少回避行为；3) 团体治疗提供安全的练习环境。',
      },
      methods: {
        exposure: '逐级暴露：列出恐惧的社交情境（1-10 分），从 3 分开始逐步面对，每级重复多次直到焦虑下降。',
        cognitive: '认知重建：识别"别人一定在评判我"等自动化思维，寻找替代性的平衡思维。',
        attention: '注意力训练：将注意力从内部自我关注转向外部环境，减少过度关注自身表现。',
        relaxation: '放松技巧：在社交前使用腹式呼吸或正念快速放松，降低生理唤醒水平。',
      },
    },
  ],

  // ===== ASRS：注意缺陷多动 =====
  adhd: [
    {
      id: 'asrs',
      title: 'ASRS 成人 ADHD 自评量表',
      subtitle: 'Adult ADHD Self-Report Scale',
      time: '约 5 分钟',
      desc: 'WHO 基于 DSM-5 编制的成人 ADHD 筛查工具，涵盖注意缺陷和多动冲动两维度。',
      questions: [
        { id: 'asrs_1', text: '完成项目的最后细节时遇到困难，一旦有挑战性的部分完成后就难以跟进？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_2', text: '当需要做需要条理的任务时，难以把事情安排得井井有条？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_3', text: '难以记住约会或义务（如工作任务或家庭事务）？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_4', text: '当面对需要大量思考的任务时，回避或拖延开始？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_5', text: '当需要久坐时，手脚不停地扭动或坐立不安？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_6', text: '感觉过度活跃，像被马达驱动一样，不得不做事情？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_7', text: '在做无聊或困难的作业时，犯粗心的错误？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_8', text: '在做枯燥或重复的工作时，难以维持注意力？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_9', text: '即使别人直接对你说话时，也难以集中注意力听？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_10', text: '在家里或工作中放错东西或找不到东西？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_11', text: '被周围的活动或噪音分散注意力？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_12', text: '在会议或需要坐着的场合离开座位？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_13', text: '感到不安或烦躁？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_14', text: '在自己独处时难以放松和安静下来？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_15', text: '在社交场合发现自己说话太多？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_16', text: '在别人还没说完话时就接话或替他们说完？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_17', text: '在需要轮流的情境中难以耐心等待？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
        { id: 'asrs_18', text: '在别人忙碌时打断他们？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '很少' },
          { value: 2, label: '有时' }, { value: 3, label: '经常' }, { value: 4, label: '非常频繁' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 16, severity: '可能性较低', level: 'low' },
          { min: 17, max: 23, severity: '可能性中等', level: 'moderate' },
          { min: 24, max: 72, severity: '可能性较高', level: 'high' },
        ],
        note: 'ASRS 总分范围 0-72。Part A（前 6 题）中每项 ≥ 2 分的项目数 ≥ 4 为筛查阳性。总分 ≥ 17 分提示需要进一步评估。ADHD 诊断需要结合童年期症状史、功能损害评估和排除其他精神障碍。',
      },
      analysis: {
        low: 'ASRS 得分较低，ADHD 可能性不高。如仍存在注意力和执行功能困扰，可能与睡眠不足、焦虑或情绪问题有关，建议进一步检查。',
        moderate: 'ASRS 提示中等可能性存在 ADHD。建议：1) 咨询精神科医生做系统诊断评估（包括童年症状回顾和功能损害评估）；2) ADHD 在成人中常被漏诊；3) 药物（哌甲酯、托莫西汀）和心理治疗均有效；4) 结构化策略和外部辅助工具（清单、闹钟、日历）可帮助管理日常功能。',
        high: 'ASRS 提示较高可能性存在 ADHD。请尽快寻求专业评估：1) 成人 ADHD 的诊断需要精神科医生全面评估；2) 药物治疗（中枢兴奋剂如哌甲酯、非兴奋剂如托莫西汀）是一线治疗；3) 认知行为疗法（CBT）可帮助改善执行功能；4) 工作场所的合理调整和教练支持可显著改善生活质量。',
      },
      methods: {
        medication: '药物治疗：中枢兴奋剂（哌甲酯）和非兴奋剂（托莫西汀、安非他酮）是成人 ADHD 一线药物。',
        cbt: '认知行为疗法（CBT）：帮助改善时间管理、组织规划、情绪调节和执行功能策略。',
        coaching: 'ADHD 教练：协助建立外部结构、目标分解和日常执行支持。',
        education: '心理教育：了解 ADHD 的神经生物学基础，消除自我责备，发展适应性策略。',
        structure: '环境调整：建立固定作息、使用清单和提醒工具、减少环境干扰、分解大任务为小步骤。',
      },
    },
  ],

  // ===== SCOPA-AUT：自主神经功能评估 =====
  autonomic: [
    {
      id: 'scopa-aut',
      title: 'SCOPA-AUT 自主神经结局量表',
      subtitle: 'Scales for Outcomes in PD-Autonomic',
      time: '约 6 分钟',
      desc: '评估帕金森病及相关疾病中自主神经功能障碍的严重程度，涵盖消化、泌尿、心血管、体温调节、瞳孔运动及性功能六个维度。本版不含性功能维度（建议另做针对性评估）。',
      questions: [
        { id: 'scopa_1', text: '吞咽食物或液体有困难？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_2', text: '平时或进食时流口水？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_3', text: '饭后感觉过饱或胀气？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_4', text: '感到恶心或想吐？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_5', text: '便秘（每周排便少于 3 次）？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_6', text: '排便时需要过度用力？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_7', text: '排便不尽感或大便失禁？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_8', text: '突然有强烈尿意（尿急）？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_9', text: '白天小便次数过多（超过每 2 小时一次）？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_10', text: '夜间需要起床排尿（夜尿增多）？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_11', text: '不自主漏尿（尿失禁）？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_12', text: '排尿开始困难或犹豫？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_13', text: '排尿后仍有未尽感？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_14', text: '从坐位或卧位站起时感到头晕或眼花？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_15', text: '站立时晕倒？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_16', text: '长时间站立时感到头晕？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_17', text: '白天出汗过多？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_18', text: '夜间出汗过多？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_19', text: '怕热或耐热能力下降？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_20', text: '怕冷或耐寒能力下降？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_21', text: '对强光敏感？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_22', text: '视力模糊或视物不清？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
        { id: 'scopa_23', text: '性功能方面感到困扰？', options: [
          { value: 0, label: '从不' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '经常' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 14, severity: '自主神经功能正常', level: 'minimal' },
          { min: 15, max: 29, severity: '轻度功能障碍', level: 'mild' },
          { min: 30, max: 44, severity: '中度功能障碍', level: 'moderate' },
          { min: 45, max: 69, severity: '重度功能障碍', level: 'severe' },
        ],
        note: 'SCOPA-AUT 总分范围 0-69（23 项，每项 0-3 分）。分数越高表示自主神经功能障碍越严重。性功能维度（1 项）包含在总分中。原量表含 25 项（含 2 项性别特异性项目），本版本采用统一版。',
      },
      analysis: {
        minimal: '自主神经功能在正常范围。如有轻微症状，建议保持规律作息、充足水分摄入和适度运动。',
        mild: '轻度自主神经功能障碍。建议：1) 消化症状：少食多餐、高纤维饮食；2) 排尿症状：盆底肌训练；3) 体位性头晕：缓慢起立、增加水盐摄入；4) 如症状持续或加重，建议神经内科评估。',
        moderate: '中度自主神经功能障碍。建议：1) 寻求神经内科或自主神经专科门诊评估；2) 明确基础疾病（帕金森病、糖尿病等）是否可控；3) 症状对症处理（如止吐药、缓泻剂、抗胆碱能药物等需医生指导）；4) 监测血压变化，预防跌倒。',
        severe: '重度自主神经功能障碍。请尽快寻求专业帮助：1) 神经内科全面评估自主神经功能和基础疾病；2) 可能需要药物治疗（如米多君升压、索利那新改善排尿等）；3) 注意防止体位性低血压导致的跌倒和晕厥；4) 多学科综合管理（神经内科、泌尿科、消化科）。',
      },
      methods: {
        lifestyle: '生活管理：少量多餐、避免过热环境、缓慢体位变换、充足饮水、高纤维饮食。',
        medication: '药物治疗：（需医生指导）米多君（体位性低血压）、索利那新（膀胱过度活动）、聚乙二醇（便秘）等。',
        pelvicFloor: '盆底肌训练：改善尿失禁症状，每日做 Kegel 练习。',
        monitoring: '血压监测：定期测量卧位和站立位血压，记录血压日记。',
      },
    },
  ],

  // ===== MoCA：认知功能评估 =====
  cognitive: [
    {
      id: 'moca',
      title: 'MoCA 蒙特利尔认知评价',
      subtitle: 'Montreal Cognitive Assessment',
      time: '约 8 分钟',
      desc: '评估认知功能的多个领域，包括视空间/执行、命名、记忆、注意、语言、抽象和定向。本版为自评版本，由患者报告日常认知困难，用于初步筛查。',
      questions: [
        { id: 'moca_1', text: '完成需要计划和组织的事情有困难（如按步骤做菜、安排日程）', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '有些困难' }, { value: 2, label: '明显困难' },
        ]},
        { id: 'moca_2', text: '同时处理多项任务或在任务之间切换有困难', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '有些困难' }, { value: 2, label: '明显困难' },
        ]},
        { id: 'moca_3', text: '画图、抄写图形或使用工具时有困难', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '有些困难' }, { value: 2, label: '明显困难' },
        ]},
        { id: 'moca_4', text: '看钟表认时间、判断空间位置有困难', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '有些困难' }, { value: 2, label: '明显困难' },
        ]},
        { id: 'moca_5', text: '想不起常见物品或人的名称', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '有些困难' }, { value: 2, label: '明显困难' },
        ]},
        { id: 'moca_6', text: '别人告诉我新信息后，我很快就忘了', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '有些困难' }, { value: 2, label: '明显困难' },
        ]},
        { id: 'moca_7', text: '忘记刚刚读过或听过的事情', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '有些困难' }, { value: 2, label: '明显困难' },
        ]},
        { id: 'moca_8', text: '难以保持注意力集中（容易分心）', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '有些困难' }, { value: 2, label: '明显困难' },
        ]},
        { id: 'moca_9', text: '心算或简单数字计算有困难', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '有些困难' }, { value: 2, label: '明显困难' },
        ]},
        { id: 'moca_10', text: '难以完整复述别人说过的句子', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '有些困难' }, { value: 2, label: '明显困难' },
        ]},
        { id: 'moca_11', text: '一时想不起恰当的词来表达自己', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '有些困难' }, { value: 2, label: '明显困难' },
        ]},
        { id: 'moca_12', text: '难以理解事物之间的相似性（如苹果和香蕉都是水果）', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '有些困难' }, { value: 2, label: '明显困难' },
        ]},
        { id: 'moca_13', text: '不确定今天的日期（年/月/日）或星期几', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '有些困难' }, { value: 2, label: '明显困难' },
        ]},
        { id: 'moca_14', text: '在熟悉的地方也会迷路或方向感变差', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '有些困难' }, { value: 2, label: '明显困难' },
        ]},
        { id: 'moca_15', text: '做事比以往慢很多，反应变迟钝', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '有些困难' }, { value: 2, label: '明显困难' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 5, severity: '认知功能正常', level: 'minimal' },
          { min: 6, max: 10, severity: '轻度认知功能下降', level: 'mild' },
          { min: 11, max: 20, severity: '中度认知功能下降', level: 'moderate' },
          { min: 21, max: 30, severity: '重度认知功能下降', level: 'severe' },
        ],
        note: 'MoCA 自评版总分范围 0-30（15 项，每项 0-2 分）。分数越高代表自评认知困难越严重。本版为自评筛查版本，不等同于标准 MoCA 操作测验。标准 MoCA 界值 <26 分提示认知功能下降，建议临床正式评估。',
      },
      analysis: {
        minimal: '自我报告认知功能在正常范围。继续保持良好生活习惯、规律运动、充足睡眠和社交活动有助于维持认知健康。',
        mild: '轻度认知功能下降。建议：1) 定期进行认知锻炼（阅读、数独、学习新技能）；2) 控制心血管风险因素（血压、血糖、血脂）；3) 保持社交活动和适度运动；4) 如症状持续进展，建议神经内科评估。',
        moderate: '中度认知功能下降。建议：1) 神经内科认知门诊系统评估（包括标准 MoCA、MMSE 等客观测试）；2) 完善认知功能相关检查（头颅 MRI、血液检查等）；3) 考虑认知康复训练；4) 注意日常安全（药物管理、财务处理等可能需要协助）。',
        severe: '重度认知功能下降。请尽快寻求专业帮助：1) 神经内科或记忆门诊全面评估；2) 明确诊断（阿尔茨海默病、血管性认知障碍、额颞叶痴呆等）；3) 药物治疗（胆碱酯酶抑制剂如多奈哌齐等需医生评估）；4) 家属照护支持和安全防护。',
      },
      methods: {
        cognitiveTraining: '认知训练：定期参与认知刺激活动（阅读、拼图、棋牌、学习新语言）。',
        vascularControl: '血管风险控制：控制高血压、糖尿病、高血脂，戒烟限酒。',
        socialActivity: '社交参与：保持与家人朋友的联系，参与社区活动。',
        medication: '药物治疗：（需医生评估）胆碱酯酶抑制剂（多奈哌齐、卡巴拉汀）用于阿尔茨海默病；美金刚用于中重度阶段。',
        safety: '安全防护：药物管理、防止走失、居家安全改造。',
      },
    },

    // ===== MMSE：简易精神状态测试 =====
    {
      id: 'mmse',
      title: 'MMSE 简易精神状态测试',
      subtitle: 'Mini-Mental State Examination',
      time: '约 6 分钟',
      desc: 'Folstein 于 1975 年编制的经典认知筛查工具，评估定向力、记忆力、注意力、计算力、语言和视空间能力。本版为自评版本，用于初步筛查。',
      questions: [
        { id: 'mmse_1', text: '我有时不清楚今天是星期几或几月几日', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '总是如此' },
        ]},
        { id: 'mmse_2', text: '我有时不确定自己在哪里或为什么来到这里', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '总是如此' },
        ]},
        { id: 'mmse_3', text: '别人告诉我几样东西让我记住，我很快就忘了', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '总是如此' },
        ]},
        { id: 'mmse_4', text: '从 100 开始连续减去 7（倒数）有困难', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '总是如此' },
        ]},
        { id: 'mmse_5', text: '几分钟前刚被告知的信息，转眼就忘了', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '总是如此' },
        ]},
        { id: 'mmse_6', text: '我叫不出日常物品的名字（如铅笔、手表、钥匙）', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '总是如此' },
        ]},
        { id: 'mmse_7', text: '我难以完整复述一句简单的话', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '总是如此' },
        ]},
        { id: 'mmse_8', text: '我难以理解或执行简单的指令（如"用右手拿起这张纸"）', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '总是如此' },
        ]},
        { id: 'mmse_9', text: '我在阅读或书写方面比以前困难', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '总是如此' },
        ]},
        { id: 'mmse_10', text: '我画简单图形或复制图案有困难', options: [
          { value: 0, label: '无困难' }, { value: 1, label: '偶尔' },
          { value: 2, label: '时常' }, { value: 3, label: '总是如此' },
        ]},
      ],
      scoring: {
        ranges: [
          { min: 0, max: 4, severity: '认知功能正常', level: 'minimal' },
          { min: 5, max: 9, severity: '轻度认知功能下降', level: 'mild' },
          { min: 10, max: 19, severity: '中度认知功能下降', level: 'moderate' },
          { min: 20, max: 30, severity: '重度认知功能下降', level: 'severe' },
        ],
        note: 'MMSE 自评版总分范围 0-30（10 项，每项 0-3 分）。分数越高代表自评认知困难越严重。标准 MMSE 界值：≤24 分提示认知功能下降，≤20 分提示中度认知障碍，≤10 分提示重度认知障碍。本版为自评版本，不等同于标准 MMSE 操作测验。',
      },
      analysis: {
        minimal: '自我报告认知功能在正常范围。继续保持规律作息、均衡饮食和社交活动对维持认知健康有益。',
        mild: '轻度认知功能下降。建议：1) 定期进行认知功能自评和医学随访；2) 保持脑力活动（阅读、棋牌、学习新技能）；3) 管理好慢性病（高血压、糖尿病等）；4) 如症状进展，建议神经内科认知门诊评估。',
        moderate: '中度认知功能下降。建议：1) 神经内科或记忆门诊进行全面认知评估；2) 完善影像学和实验室检查排除可逆性原因；3) 考虑认知康复和药物治疗；4) 家属支持与安全防护。',
        severe: '重度认知功能下降。请尽快寻求专业帮助：1) 神经内科系统评估和诊断；2) 在医生指导下考虑药物治疗；3) 日常照护和安全防护（防止走失、跌倒、误服药物等）；4) 照护者支持和 respite 服务。',
      },
      methods: {
        cognitiveTraining: '认知训练：记忆训练、定向力训练、注意力训练。',
        medication: '药物治疗：（需医生评估）多奈哌齐、卡巴拉汀、加兰他敏、美金刚等认知改善药物。',
        caregiver: '照护者支持：照护者培训、喘息服务、心理支持。',
        safety: '安全防护：防走失手环/定位器、居家安全改造、药物管理。',
        nutrition: '营养支持：地中海饮食（富含蔬菜、水果、全谷物、橄榄油、鱼类）。',
      },
    },
  ],
}

export function getScoreRange(ranges, score) {
  return ranges.find((r) => score >= r.min && score <= r.max) || ranges[ranges.length - 1]
}
