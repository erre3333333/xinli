<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { marked } from 'marked'
import { MODELS, getNextModel } from '../config/models.js'
import {
  sendPsychiatristChat, sendPsychologistChat,
  sendDiagnosisGraph, submitScaleScore,
  sendDiagnosisTreatment, getMedicalHistory, saveRecord,
} from '../utils/api.js'
import { QUESTIONNAIRES } from '../config/questionnaires.js'
import VoiceInput from './VoiceInput.vue'

const props = defineProps({
  userId: { type: Number, default: null },
})

const emit = defineEmits(['back'])

const TABS = [
  { key: 'psychiatrist', label: '精神科', icon: 'M' },
  { key: 'psychologist', label: '心理科', icon: 'P' },
]

const activeTab = ref('psychiatrist')
const phase = ref('psychiatrist')

const inputTextP = ref('')
const inputTextS = ref('')

const usePsyLLM = ref(false)

const agents = {
  psychiatrist: {
    messages: ref([]),
    summary: ref(''),
    loading: ref(false),
    model: ref(MODELS[0].id),
    done: ref(false),
    inputText: inputTextP,
    greeting: `您好，我是精神科主任医师。我从生物医学角度帮您评估，请告诉我最近遇到了什么困扰？比如情绪、睡眠、精力、思维方面的变化，都可以跟我说说。`,
    banner: '精神科主任医师 · 生物精神病学评估',
    color: '#B8654A',
  },
  psychologist: {
    messages: ref([]),
    summary: ref(''),
    loading: ref(false),
    model: ref(MODELS[0].id),
    done: ref(false),
    inputText: inputTextS,
    greeting: `您好，我是心理科主任医师。我从心理学角度帮您理解内心世界，请告诉我最近有什么困扰？比如情绪、想法、人际关系方面的困扰，都可以跟我聊聊。`,
    banner: '心理科主任医师 · 临床心理学评估',
    color: '#cbb7fb',
  },
}

const msgContainer = ref(null)
const msgContainer2 = ref(null)

const treatmentPlan = ref('')
const treatmentLoading = ref(false)
const treatmentDone = ref(false)
const treatmentError = ref(null)
const treatmentModel = ref(MODELS[0].id)

// 量表状态
const pendingScale = ref(null)        // { scale, requestedBy }
const scaleAnswers = ref({})          // { questionId: value }
const scaleResult = ref(null)         // { score, severity } or null
const scaleSubmitting = ref(false)
const scaleSentToDoctor = ref(false)
const completedScales = ref([])       // 已完成的量表结果，持久传递
const medicalHistory = ref([])        // 历史病历

onMounted(async () => {
  if (props.userId) {
    try {
      medicalHistory.value = await getMedicalHistory()
    } catch {}
  }
})

function saveDiagnosisRecord(doctorType, summary) {
  if (!props.userId || !summary) return
  saveRecord({
    record_type: 'diagnosis',
    title: `${doctorType}诊断摘要`,
    content: summary,
    summary: summary.slice(0, 200),
    doctor_type: doctorType,
  }).catch(() => {})
}

// 查找量表题目（按 id 在所有分类中搜索）
function getQuestionnaireById(id) {
  for (const cat of Object.values(QUESTIONNAIRES)) {
    const found = cat.find(q => q.id === id)
    if (found) return found
  }
  return null
}

const treatmentHtml = computed(() => {
  try { return marked.parse(treatmentPlan.value || '') }
  catch { return treatmentPlan.value || '' }
})

function getAgent(key) {
  return agents[key]
}

function currentAgent() {
  return agents[activeTab.value]
}

function currentMessages() {
  return currentAgent().messages.value
}

function scrollToBottom() {
  nextTick().then(() => {
    const el = msgContainer.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

function updateInput(val) {
  if (activeTab.value === 'psychiatrist') inputTextP.value = val
  else inputTextS.value = val
}

async function sendMessage() {
  const agent = currentAgent()
  const text = agent.inputText.value.trim()
  if (!text || agent.loading.value) return

  agent.inputText.value = ''
  agent.messages.value.push({ role: 'user', content: text })
  await nextTick()
  scrollToBottom()

  agent.loading.value = true
  agent.messages.value.push({ role: 'assistant', content: '' })
  const aiIdx = agent.messages.value.length - 1

  // history 不含刚发的用户消息和占位
  const history = agent.messages.value.slice(0, -2).map(m => ({ role: m.role, content: m.content }))

  try {
    const data = await sendDiagnosisGraph({
      agent: activeTab.value,
      message: text,
      history,
      model: agent.model.value,
      scaleResults: completedScales.value.length ? completedScales.value : undefined,
      usePsyLLM: activeTab.value === 'psychologist' ? usePsyLLM.value : undefined,
    })

    if (data.type === 'scale_recommendation') {
      // 量表推荐 → 找本地题目
      const scale = data.scales?.[0]
      if (scale) {
        const full = getQuestionnaireById(scale.id)
        agent.messages.value[aiIdx].content = `**${data.requestedBy === 'psychiatrist' ? '精神科主任医师' : '心理科主任医师'}：**\n\n我建议您完成以下心理量表评估，以更准确地了解您的情况。\n\n---\n**推荐量表：${scale.title}**\n\n请在下方完成评估后提交。`
        pendingScale.value = {
          scale: full || scale,
          requestedBy: data.requestedBy,
        }
        scaleAnswers.value = {}
        scaleResult.value = null
        scaleSentToDoctor.value = false
      } else {
        agent.messages.value[aiIdx].content = `系统建议进行量表评估，但未找到对应量表（${scale.id}）。`
      }
    } else {
      // 正常 AI 回复
      agent.messages.value[aiIdx].content = data.content

      // 直接用后端返回的诊断标记（比正则解析更可靠）
      if (activeTab.value === 'psychiatrist' && data.psychiatristDone) {
        agent.summary.value = data.psychiatristSummary || ''
        agent.done.value = true
        saveDiagnosisRecord('精神科', agent.summary.value)
      } else if (activeTab.value === 'psychologist' && data.psychologistDone) {
        agent.summary.value = data.psychologistSummary || ''
        agent.done.value = true
        saveDiagnosisRecord('心理科', agent.summary.value)
      }
    }
  } catch (e) {
    const next = getNextModel(agent.model.value)
    if (next) {
      agent.model.value = next
      agent.messages.value.pop()
      agent.loading.value = false
      await sendMessage()
      return
    }
    agent.messages.value[aiIdx].content = `（AI 服务暂时不可用，请稍后重试）`
  }
  agent.loading.value = false
  scrollToBottom()
}

// 量表交互
function startScale(scale) {
  pendingScale.value = scale
  scaleAnswers.value = {}
  scaleResult.value = null
  scaleSentToDoctor.value = false
}

async function submitScaleAnswers() {
  const ps = pendingScale.value
  if (!ps || !ps.scale) return
  scaleSubmitting.value = true
  try {
    const answers = Object.entries(scaleAnswers.value).map(([qId, value]) => ({ questionId: qId, value }))
    const result = await submitScaleScore({ scaleId: ps.scale.id, answers })
    scaleResult.value = result
  } catch (e) {
    scaleResult.value = { error: e.message }
  }
  scaleSubmitting.value = false
}

async function sendScaleResultToAI() {
  if (!scaleResult.value || !pendingScale.value) return
  const agent = currentAgent()
  const ps = pendingScale.value
  const sr = scaleResult.value
  const msg = `【量表完成: ${ps.scale.id}】${ps.scale.title}\n得分: ${sr.score}分\n严重程度: ${sr.severity}`

  agent.messages.value.push({ role: 'user', content: msg })
  agent.loading.value = true
  agent.messages.value.push({ role: 'assistant', content: '' })
  const aiIdx = agent.messages.value.length - 1

  scaleSentToDoctor.value = true
  pendingScale.value = null
  scaleResult.value = null
  scaleAnswers.value = {}

  // 持久保存已完成的量表结果，标记 justSubmitted 让 Graph 路由到 processScaleResult
  const scaleEntry = { scaleId: ps.scale.id, scaleName: ps.scale.title, score: sr.score, severity: sr.severity, justSubmitted: true }
  completedScales.value.push(scaleEntry)

  try {
    const data = await sendDiagnosisGraph({
      agent: activeTab.value,
      message: msg,
      history: agent.messages.value.slice(0, -2).map(m => ({ role: m.role, content: m.content })),
      model: agent.model.value,
      scaleResults: completedScales.value,
      usePsyLLM: activeTab.value === 'psychologist' ? usePsyLLM.value : undefined,
    })
    // 清除 justSubmitted 标记，避免后续调用重复进入 processScaleResult
    const last = completedScales.value[completedScales.value.length - 1]
    if (last) delete last.justSubmitted

    if (data.type === 'scale_recommendation') {
      // 医生在处理结果后又推荐了新量表
      const scale = data.scales?.[0]
      if (scale) {
        const full = getQuestionnaireById(scale.id)
        agent.messages.value[aiIdx].content = `**${activeTab.value === 'psychiatrist' ? '精神科主任医师' : '心理科主任医师'}：**\n\n我建议您再完成以下量表评估：\n\n---\n**推荐量表：${scale.title}**\n\n请在下方完成评估后提交。`
        pendingScale.value = {
          scale: full || scale,
          requestedBy: data.requestedBy,
        }
        scaleAnswers.value = {}
        scaleResult.value = null
        scaleSentToDoctor.value = false
      }
    } else {
      agent.messages.value[aiIdx].content = data.content || data.type || ''

      if (activeTab.value === 'psychiatrist' && data.psychiatristDone) {
        agent.summary.value = data.psychiatristSummary || ''
        agent.done.value = true
        saveDiagnosisRecord('精神科', agent.summary.value)
      } else if (activeTab.value === 'psychologist' && data.psychologistDone) {
        agent.summary.value = data.psychologistSummary || ''
        agent.done.value = true
        saveDiagnosisRecord('心理科', agent.summary.value)
      }
    }
  } catch (e) {
    const next = getNextModel(agent.model.value)
    if (next) {
      agent.model.value = next
      agent.messages.value.pop()
      agent.messages.value.pop()
      agent.loading.value = false
      await sendScaleResultToAI()
      return
    }
    agent.messages.value[aiIdx].content = `（AI 服务暂时不可用，请稍后重试）`
  }
  agent.loading.value = false
  scrollToBottom()
}

function switchToReview() {
  phase.value = 'review'
}

function startTreatment() {
  phase.value = 'treatment'
  fetchTreatment()
}

async function fetchTreatment() {
  treatmentPlan.value = ''
  treatmentDone.value = false
  treatmentError.value = null
  treatmentLoading.value = true
  treatmentModel.value = MODELS[0].id

  try {
    const data = await sendDiagnosisTreatment({
      psychiatristSummary: agents.psychiatrist.summary.value,
      psychologistSummary: agents.psychologist.summary.value,
      model: treatmentModel.value,
    })
    treatmentPlan.value = data.content || data.error || ''
    if (data.content) {
      treatmentDone.value = true
      saveDiagnosisRecord('综合治疗方案', data.content)
    }
  } catch (e) {
    const next = getNextModel(treatmentModel.value)
    if (next) {
      treatmentModel.value = next
      await fetchTreatment()
      return
    }
    treatmentError.value = e.message || String(e)
  } finally {
    treatmentLoading.value = false
  }
}

function restart() {
  for (const key of ['psychiatrist', 'psychologist']) {
    const a = agents[key]
    a.messages.value = []
    a.summary.value = ''
    a.loading.value = false
    a.model.value = MODELS[0].id
    a.done.value = false
  }
  usePsyLLM.value = false
  treatmentPlan.value = ''
  treatmentDone.value = false
  treatmentError.value = null
  pendingScale.value = null
  scaleAnswers.value = {}
  scaleResult.value = null
  scaleSentToDoctor.value = false
  completedScales.value = []
  activeTab.value = 'psychiatrist'
  phase.value = 'psychiatrist'
}

const bothDone = computed(() =>
  agents.psychiatrist.done.value && agents.psychologist.done.value
)
</script>

<template>
  <div class="diag" data-theme="autumn">
    <div class="diag-header">
      <button class="diag-back" @click="emit('back')" aria-label="返回">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <div class="diag-header-info">
        <h2 class="diag-title">AI 双科问诊</h2>
        <p class="diag-sub">精神科 + 心理科 双 Agent 智能诊断系统</p>
      </div>
    </div>

    <!-- Phase: Chat -->
    <template v-if="phase === 'psychiatrist' || phase === 'psychologist'">
      <div class="diag-tabs">
        <button
          v-for="tab in TABS"
          :key="tab.key"
          class="diag-tab"
          :class="{ active: activeTab === tab.key, done: agents[tab.key].done.value }"
          :style="activeTab === tab.key ? { '--tab-color': agents[tab.key].color } : {}"
          @click="activeTab = tab.key; phase = tab.key"
        >
          <span class="tab-icon" :style="{ background: agents[tab.key].color }">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
          <span v-if="agents[tab.key].done.value" class="tab-check">✓</span>
          <span v-else class="tab-status">问诊中</span>
        </button>
      </div>

      <div class="diag-banner" :style="{ background: agents[activeTab].color + '12', borderColor: agents[activeTab].color + '30', color: agents[activeTab].color }">
        <span>{{ agents[activeTab].banner }}</span>
      </div>

      <div v-if="activeTab === 'psychologist'" class="psyllm-toggle">
        <label class="toggle-label">
          <span class="toggle-text">PsyLLM 推理引擎</span>
          <span class="toggle-hint">启用后使用 DeepSeek-R1 思维链推理，失败自动回退</span>
        </label>
        <button
          class="toggle-switch"
          :class="{ on: usePsyLLM }"
          @click="usePsyLLM = !usePsyLLM"
          :title="usePsyLLM ? '点击关闭 PsyLLM' : '点击开启 PsyLLM'"
        >
          <span class="toggle-knob"></span>
        </button>
      </div>

      <div class="diag-chat" :ref="activeTab === 'psychiatrist' ? 'msgContainer' : 'msgContainer2'">
        <div v-if="medicalHistory.length > 0 && !currentMessages().length" class="history-banner">
          <span class="hb-icon">📋</span>
          <span>检测到 {{ medicalHistory.length }} 条历史记录，医生已了解您的情况</span>
        </div>
        <div v-if="!currentMessages().length" class="diag-greeting">
          <div class="greeting-avatar" :style="{ background: currentAgent().color }">
            <span class="avatar-text">{{ activeTab === 'psychiatrist' ? '精' : '心' }}</span>
          </div>
          <div class="greeting-bubble">
            <div class="md" v-html="marked.parse(currentAgent().greeting)"></div>
          </div>
        </div>

        <div v-for="(msg, i) in currentMessages()" :key="i" class="diag-msg" :class="msg.role">
          <div v-if="msg.role === 'assistant'" class="msg-avatar" :style="{ background: currentAgent().color }">
            <span class="avatar-text">{{ activeTab === 'psychiatrist' ? '精' : '心' }}</span>
          </div>
          <div class="msg-bubble" :class="msg.role">
            <div v-if="msg.role === 'user'" class="msg-text">{{ msg.content }}</div>
            <div v-else class="md" v-html="marked.parse(msg.content || '')"></div>
          </div>
        </div>

        <div v-if="currentAgent().loading.value" class="diag-msg assistant">
          <div class="msg-avatar" :style="{ background: currentAgent().color }">
            <span class="avatar-text">{{ activeTab === 'psychiatrist' ? '精' : '心' }}</span>
          </div>
          <div class="msg-bubble assistant"><span class="typing">思考中…</span></div>
        </div>

        <!-- 量表卡片 -->
        <div v-if="pendingScale && pendingScale.scale && !scaleSentToDoctor" class="scale-card">
          <div class="scale-card-header">
            <span class="scale-card-icon">📋</span>
            <div>
              <strong class="scale-card-title">{{ pendingScale.scale.title }}</strong>
              <p class="scale-card-desc">{{ pendingScale.scale.desc || pendingScale.scale.subtitle }}</p>
            </div>
          </div>

          <div v-if="!scaleResult" class="scale-card-body">
            <div v-for="(q, qi) in pendingScale.scale.questions" :key="q.id" class="scale-question">
              <p class="scale-q-text">{{ qi + 1 }}. {{ q.text }}</p>
              <div class="scale-options">
                <button
                  v-for="opt in q.options"
                  :key="opt.value"
                  class="scale-opt"
                  :class="{ active: scaleAnswers[q.id] === opt.value }"
                  @click="scaleAnswers[q.id] = opt.value"
                >{{ opt.label }}</button>
              </div>
            </div>
            <button
              class="scale-submit-btn"
              :disabled="Object.keys(scaleAnswers).length < pendingScale.scale.questions.length || scaleSubmitting"
              @click="submitScaleAnswers"
            >{{ scaleSubmitting ? '提交中…' : '提交答案' }}</button>
          </div>

          <div v-else class="scale-card-result">
            <div v-if="scaleResult.error" class="scale-error">{{ scaleResult.error }}</div>
            <div v-else>
              <p class="scale-result-score">得分：<strong>{{ scaleResult.score }}</strong> / {{ scaleResult.maxScore }}</p>
              <p class="scale-result-severity">评估结果：<span :class="'sev-' + (scaleResult.severity || '').toLowerCase().replace(/\s+/g, '-')">{{ scaleResult.severity }}</span></p>
              <button class="scale-send-btn" @click="sendScaleResultToAI">将此结果发送给医生分析</button>
            </div>
          </div>
        </div>
      </div>

      <div class="diag-composer">
        <input
          v-if="!pendingScale || scaleSentToDoctor || !pendingScale.scale"
          :value="activeTab === 'psychiatrist' ? inputTextP : inputTextS"
          @input="updateInput($event.target.value)"
          placeholder="描述您的症状或回答医生的问题…"
          :disabled="currentAgent().loading.value"
          @keydown.enter="sendMessage"
        />
        <div v-else class="scale-composer-hint">请先完成上方量表评估</div>
        <VoiceInput @result="updateInput" />
        <button class="send-btn" :disabled="!currentAgent().inputText.value.trim() || currentAgent().loading.value" @click="sendMessage">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </div>

      <div v-if="bothDone" class="diag-next">
        <span>✅ 两位医生均已完成问诊</span>
        <button class="next-btn" @click="switchToReview">查看综合诊断 →</button>
      </div>
    </template>

    <!-- Phase: Review -->
    <template v-else-if="phase === 'review'">
      <div class="diag-banner review-banner">
        <span>📋 综合诊断 — 对比两位医生的诊断意见</span>
      </div>

      <div class="review-grid">
        <div class="review-card">
          <div class="review-card-header" style="background: #f0ebf8;">
            <span class="review-icon" style="background: #cbb7fb;">精</span>
            <span class="review-title">精神科主任医师</span>
          </div>
          <pre class="review-text">{{ agents.psychiatrist.summary.value }}</pre>
        </div>
        <div class="review-card">
          <div class="review-card-header" style="background: #f5f2ef;">
            <span class="review-icon" style="background: #e9e5dd;">心</span>
            <span class="review-title">心理科主任医师</span>
          </div>
          <pre class="review-text">{{ agents.psychologist.summary.value }}</pre>
        </div>
      </div>

      <div class="diag-actions">
        <button class="back-btn" @click="restart">← 重新问诊</button>
        <button class="gen-btn" @click="startTreatment">生成综合治疗方案 →</button>
      </div>
    </template>

    <!-- Phase: Treatment -->
    <template v-else>
      <div class="diag-banner treatment-banner">
        <span>💊 综合治疗方案 — 整合双科诊断意见</span>
      </div>

      <div class="diag-treatment">
        <div v-if="treatmentLoading && !treatmentPlan" class="loading-state">
          <span>AI 正在制定综合治疗方案…</span>
        </div>

        <el-alert v-if="treatmentError && !treatmentPlan" :title="treatmentError" type="error" show-icon :closable="false">
          <template #default><el-button size="small" type="danger" @click="fetchTreatment">重试</el-button></template>
        </el-alert>

        <div v-if="treatmentPlan" class="result-card">
          <div class="result-card-body md" v-html="treatmentHtml"></div>
        </div>
      </div>

      <div class="diag-actions">
        <button class="back-btn" @click="restart">← 重新问诊</button>
        <button v-if="!treatmentDone && !treatmentLoading" class="gen-btn" @click="fetchTreatment" :disabled="treatmentLoading">
          {{ treatmentLoading ? '生成中…' : '生成治疗方案' }}
        </button>
        <button v-if="treatmentDone" class="gen-btn" @click="fetchTreatment">重新生成</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.diag {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(180deg, #FFFAF5, #FFFFFF);
}

.diag > * { position: relative; z-index: 1; }

.diag-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(200, 150, 100, 0.15);
  flex-shrink: 0;
}
.diag-back {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 50%;
  color: #6b6b6b; flex-shrink: 0;
}
.diag-back:hover { background: rgba(107, 107, 107, 0.1); color: #292827; }
.diag-header-info { flex: 1; }
.diag-title {
  font-size: 17px;
  font-weight: 600;
  background: linear-gradient(135deg, #8B5E3C, #FB7299);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.diag-sub { font-size: 11px; color: #a0a0a0; margin-top: 1px; }

.diag-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid rgba(200, 150, 100, 0.15);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  flex-shrink: 0;
}
.diag-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #a0a0a0;
  border-bottom: 2px solid transparent;
  transition: all 0.25s;
  position: relative;
}
.diag-tab.active {
  color: #FB7299;
  border-bottom-color: #FB7299;
}
.diag-tab:hover { color: #292827; background: rgba(107, 107, 107, 0.06); }
.diag-tab.done .tab-check { opacity: 1; }
.tab-icon {
  width: 22px; height: 22px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 11px; font-weight: 700; flex-shrink: 0;
}
.tab-label { font-weight: 600; }
.tab-check {
  font-size: 10px; color: #a0a0a0; opacity: 0;
  transition: opacity 0.3s;
}
.tab-status { font-size: 10px; color: #a0a0a0; }

.diag-banner {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 20px; font-size: 12px; font-weight: 500;
  border-bottom: 1px solid;
  flex-shrink: 0;
}
.review-banner {
  background: linear-gradient(135deg, #FFF9F5, #FFE8F0); border-color: rgba(200, 150, 100, 0.15); color: #FB7299;
}
.treatment-banner {
  background: linear-gradient(135deg, #FFF9F5, #FFE8F0); border-color: rgba(200, 150, 100, 0.15); color: #8B5E3C;
}
.treatment-banner {
  background: linear-gradient(135deg, #FFF9F5, #FFE8F0); border-color: rgba(200, 150, 100, 0.15); color: #8B5E3C;
}

.diag-chat {
  flex: 1; overflow-y: auto; padding: 16px 20px;
  display: flex; flex-direction: column; gap: 14px;
}

.history-banner {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; background: #FFF9F5;
  border: 1px solid rgba(200, 150, 100, 0.15);
  border-radius: 10px; font-size: 12px; color: #8B7355;
}
.hb-icon { font-size: 16px; }

.diag-greeting { display: flex; gap: 10px; align-items: flex-start; }
.greeting-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.avatar-text { color: white; font-size: 13px; font-weight: 700; }
.greeting-bubble {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid #e5e0db;
  box-shadow: 0 2px 8px rgba(41, 40, 39, 0.06);
  border-radius: 4px 14px 14px 14px; padding: 12px 16px;
  max-width: 85%; font-size: 14px; line-height: 1.7; color: #292827;
}

.diag-msg { display: flex; gap: 10px; align-items: flex-start; }
.diag-msg.user { flex-direction: row-reverse; }
.msg-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(41, 40, 39, 0.12);
}
.msg-bubble {
  max-width: 78%; padding: 10px 14px; font-size: 14px; line-height: 1.7;
  border-radius: 4px 14px 14px 14px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid #e5e0db;
  box-shadow: 0 2px 8px rgba(41, 40, 39, 0.06);
  color: #292827;
}
.msg-bubble.user {
  border-radius: 14px 4px 14px 14px;
  background: #e9e5dd; color: #292827; border-color: #e9e5dd;
  box-shadow: 0 2px 8px rgba(41, 40, 39, 0.08);
}
.msg-text { white-space: pre-wrap; word-break: break-word; }
.typing { opacity: 0.5; }

.diag-composer {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-top: 1px solid #e5e0db; flex-shrink: 0;
}
.diag-composer input {
  flex: 1; padding: 10px 14px; font-size: 14px;
  border: 1px solid #e5e0db; border-radius: var(--r-pill);
  background: rgba(245, 242, 239, 0.6); color: #292827;
  outline: none;
}
.diag-composer input::placeholder { color: #a0a0a0; }
.diag-composer input:focus { border-color: #FB7299; box-shadow: 0 0 0 3px rgba(251, 114, 153, 0.1); }
.send-btn { background: linear-gradient(135deg, #FB7299, #E85D75); color: white; }
.send-btn:hover:not(:disabled) { background: linear-gradient(135deg, #E85D75, #D44A63); box-shadow: 0 2px 8px rgba(251, 114, 153, 0.3); }

.diag-next {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 20px; background: #f0ece6;
  border-top: 1px solid #e5e0db; flex-shrink: 0;
  font-size: 13px; color: #292827;
}
.next-btn {
  padding: 8px 18px; border-radius: var(--r-pill);
  background: linear-gradient(135deg, #FB7299, #E85D75); color: #ffffff; font-size: 13px; font-weight: 500;
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.25);
}
.next-btn:hover { background: linear-gradient(135deg, #E85D75, #D44A63); }

.review-grid {
  flex: 1; display: grid; grid-template-columns: 1fr 1fr;
  gap: 16px; padding: 20px; overflow: auto;
}
.review-card {
  border: 1px solid rgba(200, 150, 100, 0.15); border-radius: var(--r-sm);
  overflow: hidden; display: flex; flex-direction: column;
  background: linear-gradient(135deg, #FFFFFF, #FFF9F5);
  box-shadow: 0 1px 4px rgba(139, 94, 60, 0.06);
}
.review-card-header {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 14px; border-bottom: 1px solid rgba(200, 150, 100, 0.15);
}
.review-icon {
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 12px; font-weight: 700;
}
.review-title { font-size: 13px; font-weight: 600; color: #292827; }
.review-text {
  flex: 1; padding: 14px; font-size: 12px; line-height: 1.7;
  white-space: pre-wrap; font-family: inherit; color: #6b6b6b;
  overflow-y: auto;
}

.diag-treatment { flex: 1; overflow-y: auto; padding: 0 20px 16px; }

.diag-actions {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.92);
  border-top: 1px solid #e5e0db; flex-shrink: 0;
}
.back-btn { font-size: 13px; color: #a0a0a0; padding: 8px 14px; }
.back-btn:hover { color: #292827; }
.gen-btn {
  padding: 8px 20px; border-radius: var(--r-pill);
  background: linear-gradient(135deg, #FB7299, #E85D75); color: #ffffff; font-size: 13px; font-weight: 500;
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.25);
}
.gen-btn:disabled { opacity: 0.4; }
.gen-btn:hover:not(:disabled) { background: linear-gradient(135deg, #E85D75, #D44A63); }

.loading-state {
  display: flex; align-items: center; justify-content: center;
  padding: 60px 0; font-size: 14px; color: #a0a0a0;
}

.result-card {
  background: linear-gradient(135deg, #FFFFFF, #FFF9F5);
  border: 1px solid rgba(200, 150, 100, 0.15);
  box-shadow: 0 2px 12px rgba(139, 94, 60, 0.08);
  border-radius: var(--r-md); overflow: hidden;
}
.result-card-body { padding: 20px 24px; }

/* 量表卡片 — 温馨暖色调 */
.scale-card {
  background: linear-gradient(135deg, #FFFFFF, #FFF9F5); border: 1px solid rgba(200, 150, 100, 0.15); border-radius: var(--r-md);
  padding: 16px; margin: 8px 0 4px;
  box-shadow: 0 2px 8px rgba(139, 94, 60, 0.06);
}
.scale-card-header { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
.scale-card-icon { font-size: 20px; flex-shrink: 0; }
.scale-card-title { font-size: 15px; color: #FB7299; }
.scale-card-desc { font-size: 12px; color: #a0a0a0; margin-top: 2px; }
.scale-question { margin-bottom: 14px; }
.scale-q-text { font-size: 13px; color: #292827; margin-bottom: 6px; font-weight: 500; }
.scale-options { display: flex; gap: 6px; flex-wrap: wrap; }
.scale-opt {
  padding: 5px 12px; font-size: 12px; border-radius: var(--r-pill);
  border: 1px solid #e5e0db; background: rgba(255, 255, 255, 0.8); color: #6b6b6b;
  cursor: pointer; transition: all 0.15s;
}
.scale-opt:hover { border-color: #e9e5dd; color: #714cb6; }
.scale-opt.active { border-color: #e9e5dd; background: #f0ece6; color: #714cb6; font-weight: 600; }
.scale-submit-btn {
  width: 100%; padding: 8px; margin-top: 8px; border-radius: var(--r-pill);
  background: #e9e5dd; color: #292827; font-size: 13px; font-weight: 500;
}
.scale-submit-btn:disabled { opacity: 0.4; }
.scale-submit-btn:hover:not(:disabled) { background: #d4d0c8; }
.scale-card-result { text-align: center; padding: 12px 0; }
.scale-result-score { font-size: 15px; color: #292827; margin-bottom: 6px; }
.scale-result-score strong { font-size: 22px; color: #714cb6; }
.scale-result-severity { font-size: 13px; color: #6b6b6b; margin-bottom: 12px; }
.scale-error { color: #e23b4a; font-size: 13px; }
.scale-send-btn {
  padding: 8px 20px; border-radius: var(--r-pill);
  background: #714cb6; color: #ffffff; font-size: 13px; font-weight: 500;
}
.scale-send-btn:hover { background: #5a3d8a; }
.scale-composer-hint {
  flex: 1; text-align: center; font-size: 13px; color: #a0a0a0; padding: 10px;
}
.sev-minimal, .sev-无抑郁症状, .sev-无焦虑症状, .sev-正常范围, .sev-认知扭曲较少, .sev-无临床失眠 { color: #00a87e; font-weight: 600; }
.sev-mild, .sev-轻度抑郁, .sev-轻度焦虑, .sev-轻度认知扭曲, .sev-亚阈值失眠, .sev-正常或轻微 { color: #ec7e00; font-weight: 600; }
.sev-moderate, .sev-中度抑郁, .sev-中度焦虑, .sev-中度认知扭曲, .sev-中度失眠 { color: #e61e49; font-weight: 600; }
.sev-moderately-severe, .sev-中重度抑郁 { color: #c0392b; font-weight: 600; }
.sev-severe, .sev-重度抑郁, .sev-重度焦虑, .sev-重度认知扭曲, .sev-重度失眠 { color: #e23b4a; font-weight: 600; }

.md { font-size: 14px; color: #292827; line-height: 1.8; }
.md h1 { font-size: 17px; font-weight: 700; margin: 24px 0 12px; padding: 0 0 0 14px; border-left: 3px solid #714cb6; }
.md h1:first-child { margin-top: 0; }
.md h2 { font-size: 15px; font-weight: 600; margin: 20px 0 10px; padding: 0 0 8px; border-bottom: 2px solid #f0ece6; }
.md table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; border: 1px solid #e5e0db; border-radius: var(--r-sm); overflow: hidden; }
.md th { background: #f5f2ef; font-weight: 600; padding: 10px 14px; font-size: 12px; border: 1px solid #e5e0db; color: #292827; }
.md td { padding: 10px 14px; border: 1px solid #e5e0db; color: #6b6b6b; }
.md tbody tr:nth-child(even) td { background: rgba(255, 255, 255, 0.6); }
.md tbody tr:hover td { background: #f5f2ef; }
.md p { margin: 10px 0; color: #6b6b6b; }
.md strong { color: #292827; }
.md ul { padding-left: 22px; margin: 10px 0; }
.md li { margin: 6px 0; }
.md li::marker { color: #714cb6; }

.psyllm-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  background: rgba(203, 183, 251, 0.08);
  border-bottom: 1px solid #e5e0db;
  flex-shrink: 0;
}
.toggle-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.toggle-text {
  font-size: 13px;
  font-weight: 600;
  color: #714cb6;
}
.toggle-hint {
  font-size: 11px;
  color: #a0a0a0;
}
.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: #e5e0db;
  transition: background 0.25s;
  cursor: pointer;
  flex-shrink: 0;
}
.toggle-switch.on {
  background: #714cb6;
}
.toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  transition: transform 0.25s;
}
.toggle-switch.on .toggle-knob {
  transform: translateX(20px);
}

@media (max-width: 720px) {
  .diag-header { padding: 12px 14px; flex-wrap: wrap; gap: 8px; }
  .diag-header h2 { font-size: 16px; }
  .diag-header .dh-tabs { overflow-x: auto; }
  .diag-chat { padding: 12px 14px; }
  .review-grid { grid-template-columns: 1fr; }
  .result-card-body { padding: 14px 16px; }
  .scale-card { padding: 16px; }
  .scale-options { flex-wrap: wrap; gap: 6px; }
  .scale-opt { padding: 6px 12px; font-size: 12px; }
  .scale-question { padding: 14px 0; }
}
@media (max-width: 480px) {
  .diag-container { padding: 0; }
  .diag-messages { padding: 8px 10px; }
  .diag-input-area { padding: 8px 10px 12px; }
  .diag-input textarea { padding: 10px; font-size: 14px; min-height: 40px; }
}
</style>
