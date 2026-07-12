<script setup>
import { ref, computed, nextTick } from 'vue'
import { marked } from 'marked'
import { MODELS, PATIENT_TYPES, getNextModel } from '../config/models.js'
import { sendServiceGraph, submitScaleScore, saveRecord } from '../utils/api.js'
import { QUESTIONNAIRES } from '../config/questionnaires.js'

const props = defineProps({
  serviceType: { type: String, required: true },
  userId: { type: Number, default: null },
})
const emit = defineEmits(['back'])

const serviceInfo = computed(() => PATIENT_TYPES.find(p => p.id === props.serviceType))

const inputText = ref('')
const messages = ref([])
const loading = ref(false)
const currentModel = ref(MODELS[0].id)
const summary = ref('')
const done = ref(false)

const pendingScale = ref(null)
const scaleAnswers = ref({})
const scaleResult = ref(null)
const scaleSubmitting = ref(false)
const scaleSentToDoctor = ref(false)
const completedScales = ref([])

const msgContainer = ref(null)

function getQuestionnaireById(id) {
  for (const cat of Object.values(QUESTIONNAIRES)) {
    const found = cat.find(q => q.id === id)
    if (found) return found
  }
  return null
}

const greeting = computed(() => {
  switch (props.serviceType) {
    case 'child-emotion': return '你好，我是儿童情绪管理顾问。请告诉我你孩子的情况——比如年龄、最近的情绪或行为表现，我来帮你分析并提供建议。'
    case 'adolescent': return '你好，我是青少年成长咨询师。你最近遇到了什么困惑？学业、朋友、家庭还是对未来的迷茫？都可以跟我说说。'
    case 'mindfulness': return '你好，我是正念减压教练。你最近压力大吗？是什么在困扰你？我会根据你的情况推荐适合的正念练习。'
    case 'social-anxiety': return '你好，我是社交焦虑突破教练。你在什么社交场合中最紧张？是一对一对话、小组讨论还是公开演讲？我们一步步来。'
    default: return '你好，欢迎咨询。请告诉我你的困扰。'
  }
})

const scrollToBottom = () => {
  nextTick().then(() => {
    if (msgContainer.value) msgContainer.value.scrollTop = msgContainer.value.scrollHeight
  })
}

async function sendMessage(msg) {
  const text = typeof msg === 'string' ? msg : inputText.value.trim()
  if (!text || loading.value) return
  inputText.value = ''
  messages.value.push({ role: 'user', content: text })
  await nextTick(); scrollToBottom()
  loading.value = true
  messages.value.push({ role: 'assistant', content: '' })
  const aiIdx = messages.value.length - 1
  const history = messages.value.slice(0, -2).map(m => ({ role: m.role, content: m.content }))

  try {
    const data = await sendServiceGraph({
      message: text,
      history,
      model: currentModel.value,
      serviceType: props.serviceType,
      scaleResults: completedScales.value.length ? completedScales.value : undefined,
    })

    if (data.type === 'scale_recommendation') {
      const scale = data.scales?.[0]
      if (scale) {
        const full = getQuestionnaireById(scale.id)
        messages.value[aiIdx].content = `**我建议您先完成以下评估**：\n\n---\n**${scale.title}**\n\n请在下方完成评估后提交。`
        pendingScale.value = { scale: full || scale, requestedBy: data.requestedBy }
        scaleAnswers.value = {}
        scaleResult.value = null
        scaleSentToDoctor.value = false
      } else {
        messages.value[aiIdx].content = `系统建议进行评估，但未找到对应量表。`
      }
    } else {
      messages.value[aiIdx].content = data.content
      if (data.serviceDone) {
        done.value = true
        summary.value = data.serviceSummary || ''
        saveRecord({
          record_type: 'diagnosis',
          title: `${serviceInfo.value?.label || '咨询服务'}诊断摘要`,
          content: data.serviceSummary || data.content,
          summary: (data.serviceSummary || data.content).slice(0, 200),
          doctor_type: serviceInfo.value?.label || '咨询服务',
        }).catch(() => {})
      }
    }
  } catch (e) {
    const next = getNextModel(currentModel.value)
    if (next) {
      currentModel.value = next
      messages.value.pop()
      loading.value = false
      await sendMessage()
      return
    }
    messages.value[aiIdx].content = `（AI 服务暂时不可用，请稍后重试）`
  }
  loading.value = false
  scrollToBottom()
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
  const ps = pendingScale.value
  const sr = scaleResult.value
  const msg = `【量表完成: ${ps.scale.id}】${ps.scale.title}\n得分: ${sr.score}分\n严重程度: ${sr.severity}`

  messages.value.push({ role: 'user', content: msg })
  loading.value = true
  messages.value.push({ role: 'assistant', content: '' })
  const aiIdx = messages.value.length - 1

  scaleSentToDoctor.value = true
  pendingScale.value = null
  scaleResult.value = null
  scaleAnswers.value = {}
  completedScales.value.push({ scaleId: ps.scale.id, scaleName: ps.scale.title, score: sr.score, severity: sr.severity })

  try {
    const data = await sendServiceGraph({
      message: msg,
      history: messages.value.slice(0, -2).map(m => ({ role: m.role, content: m.content })),
      model: currentModel.value,
      serviceType: props.serviceType,
      scaleResults: completedScales.value,
    })
    messages.value[aiIdx].content = data.content || ''
    if (data.serviceDone) {
      done.value = true
      summary.value = data.serviceSummary || ''
      saveRecord({
        record_type: 'diagnosis',
        title: `${serviceInfo.value?.label || '咨询服务'}诊断摘要`,
        content: data.serviceSummary || data.content,
        summary: (data.serviceSummary || data.content).slice(0, 200),
        doctor_type: serviceInfo.value?.label || '咨询服务',
      }).catch(() => {})
    }
  } catch (e) {
    const next = getNextModel(currentModel.value)
    if (next) {
      currentModel.value = next
      messages.value.pop()
      messages.value.pop()
      loading.value = false
      await sendScaleResultToAI()
      return
    }
    messages.value[aiIdx].content = `（AI 服务暂时不可用，请稍后重试）`
  }
  loading.value = false
  scrollToBottom()
}

function restart() {
  messages.value = []
  summary.value = ''
  done.value = false
  loading.value = false
  currentModel.value = MODELS[0].id
  pendingScale.value = null
  scaleAnswers.value = {}
  scaleResult.value = null
  scaleSentToDoctor.value = false
  completedScales.value = []
}
</script>

<template>
  <div class="sdiag">
    <div class="sdiag-header">
      <button class="sdiag-back" @click="emit('back')" aria-label="返回">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <div class="sdiag-header-info">
        <h2 class="sdiag-title">{{ serviceInfo?.label || '咨询服务' }}</h2>
        <p class="sdiag-sub">{{ serviceInfo?.description || '' }}</p>
      </div>
    </div>

    <div class="sdiag-chat" ref="msgContainer">
      <div v-if="!messages.length" class="sdiag-greeting">
        <div class="sdiag-greeting-bubble">{{ greeting }}</div>
      </div>

      <div v-for="(msg, i) in messages" :key="i" class="sdiag-msg" :class="msg.role">
        <div class="sdiag-bubble" :class="msg.role">
          <div v-if="msg.role === 'user'" class="msg-text">{{ msg.content }}</div>
          <div v-else class="md" v-html="marked.parse(msg.content || '')"></div>
        </div>
      </div>

      <div v-if="loading" class="sdiag-msg assistant">
        <div class="sdiag-bubble assistant"><span class="typing">思考中…</span></div>
      </div>

      <div v-if="pendingScale && pendingScale.scale && !scaleSentToDoctor" class="scale-card">
        <div class="scale-header">
          <strong>{{ pendingScale.scale.title }}</strong>
          <p class="scale-desc">{{ pendingScale.scale.desc }}</p>
        </div>
        <div v-if="!scaleResult" class="scale-body">
          <div v-for="(q, qi) in pendingScale.scale.questions" :key="q.id" class="scale-q">
            <p class="scale-q-text">{{ qi + 1 }}. {{ q.text }}</p>
            <div class="scale-opts">
              <button v-for="opt in q.options" :key="opt.value" class="scale-opt"
                :class="{ active: scaleAnswers[q.id] === opt.value }"
                @click="scaleAnswers[q.id] = opt.value">{{ opt.label }}</button>
            </div>
          </div>
          <button class="submit-btn" :disabled="Object.keys(scaleAnswers).length < pendingScale.scale.questions.length || scaleSubmitting"
            @click="submitScaleAnswers">{{ scaleSubmitting ? '提交中…' : '提交答案' }}</button>
        </div>
        <div v-else class="scale-result">
          <div v-if="scaleResult.error" class="error">{{ scaleResult.error }}</div>
          <div v-else>
            <p class="result-score">得分：<strong>{{ scaleResult.score }}</strong> / {{ scaleResult.maxScore }}</p>
            <p class="result-severity">评估：<span class="sev-label">{{ scaleResult.severity }}</span></p>
            <button class="send-btn" @click="sendScaleResultToAI">发送结果给顾问分析</button>
          </div>
        </div>
      </div>
    </div>

    <div class="sdiag-composer">
      <input v-if="!pendingScale || scaleSentToDoctor || !pendingScale.scale"
        v-model="inputText" placeholder="描述您的情况…" :disabled="loading" @keydown.enter="sendMessage" />
      <div v-else class="composer-hint">请先完成上方评估</div>
      <button class="send-btn" :disabled="!inputText.trim() || loading" @click="sendMessage">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
      </button>
    </div>

    <div v-if="done" class="sdiag-next">
      <span>✅ 咨询完成</span>
      <button class="restart-btn" @click="restart">重新开始</button>
    </div>
  </div>
</template>

<style scoped>
.sdiag {
  height: 100%; display: flex; flex-direction: column; overflow: hidden;
  background: linear-gradient(180deg, #FFFAF5, #FFFFFF);
}
.sdiag > * { position: relative; z-index: 1; }

.sdiag-header {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 20px; background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px); border-bottom: 1px solid rgba(200, 150, 100, 0.15); flex-shrink: 0;
}
.sdiag-back {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 50%; color: #505a63; flex-shrink: 0;
}
.sdiag-back:hover { background: rgba(80, 90, 99, 0.1); color: #191c1f; }
.sdiag-header-info { flex: 1; }
.sdiag-title {
  font-size: 17px; font-weight: 600;
  background: linear-gradient(135deg, #8B5E3C, #FB7299);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.sdiag-sub { font-size: 11px; color: #8d969e; margin-top: 1px; }

.sdiag-chat { flex: 1; overflow-y: auto; padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; }

.sdiag-greeting-bubble {
  background: linear-gradient(135deg, #FFFFFF, #FFF9F5);
  border: 1px solid rgba(200, 150, 100, 0.15);
  border-radius: 4px 14px 14px 14px; padding: 12px 16px;
  max-width: 85%; font-size: 14px; line-height: 1.7; color: #5C4033;
  box-shadow: 0 1px 4px rgba(139, 94, 60, 0.06);
}

.sdiag-msg { display: flex; gap: 10px; align-items: flex-start; }
.sdiag-msg.user { flex-direction: row-reverse; }
.sdiag-bubble {
  max-width: 78%; padding: 10px 14px; font-size: 14px; line-height: 1.7;
  border-radius: 4px 14px 14px 14px;
  background: linear-gradient(135deg, #FFFFFF, #FFF9F5); border: 1px solid rgba(200, 150, 100, 0.1); color: #5C4033;
  box-shadow: 0 1px 4px rgba(139, 94, 60, 0.06);
}
.sdiag-bubble.user {
  border-radius: 14px 4px 14px 14px;
  background: #191c1f; color: #ffffff; border-color: #191c1f;
  box-shadow: none;
}
.msg-text { white-space: pre-wrap; word-break: break-word; }
.typing { opacity: 0.5; }

.sdiag-composer {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(200, 150, 100, 0.15); flex-shrink: 0;
}
.sdiag-composer input {
  flex: 1; padding: 10px 14px; font-size: 14px;
  border: 1px solid rgba(200, 150, 100, 0.2); border-radius: 9999px;
  background: #FFFFFF; color: #5C4033; outline: none;
}
.sdiag-composer input::placeholder { color: #a0a0a0; }
.sdiag-composer input:focus { border-color: #FB7299; box-shadow: 0 0 0 3px rgba(251, 114, 153, 0.1); }
.send-btn {
  width: 44px; height: 44px; border-radius: 9999px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #FB7299, #E85D75); color: white; flex-shrink: 0;
  transition: all 0.25s;
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.25);
}
.send-btn:disabled { opacity: 0.35; }
.send-btn:hover:not(:disabled) { background: linear-gradient(135deg, #E85D75, #D44A63); box-shadow: 0 4px 12px rgba(251, 114, 153, 0.35); }

.sdiag-next {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 20px; background: linear-gradient(135deg, #FFF9F5, #FFE8F0);
  border-top: 1px solid rgba(200, 150, 100, 0.15); flex-shrink: 0; font-size: 13px; color: #8B5E3C;
}
.restart-btn {
  padding: 8px 18px; border-radius: 9999px;
  background: linear-gradient(135deg, #FB7299, #E85D75); color: #ffffff; font-size: 13px; font-weight: 500;
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.25);
}
.restart-btn:hover { background: linear-gradient(135deg, #E85D75, #D44A63); }

.scale-card {
  background: linear-gradient(135deg, #FFFFFF, #FFF9F5); border: 1px solid rgba(200, 150, 100, 0.15); border-radius: 20px;
  padding: 16px; margin: 8px 0 4px;
  box-shadow: 0 1px 4px rgba(139, 94, 60, 0.06);
}
.scale-header { margin-bottom: 12px; }
.scale-header strong { font-size: 15px; color: #191c1f; }
.scale-desc { font-size: 12px; color: #8d969e; margin-top: 2px; }
.scale-q { margin-bottom: 14px; }
.scale-q-text { font-size: 13px; color: #191c1f; margin-bottom: 6px; font-weight: 500; }
.scale-opts { display: flex; gap: 6px; flex-wrap: wrap; }
.scale-opt {
  padding: 5px 12px; font-size: 12px; border-radius: 9999px;
  border: 1px solid #e8e8e8; background: rgba(255, 255, 255, 0.8); color: #505a63; cursor: pointer;
}
.scale-opt:hover { border-color: #191c1f; color: #191c1f; }
.scale-opt.active { border-color: #191c1f; background: #f4f4f4; color: #191c1f; font-weight: 600; }
.submit-btn { width: 100%; padding: 8px; margin-top: 8px; border-radius: 9999px; background: #191c1f; color: white; font-size: 13px; font-weight: 500; }
.submit-btn:disabled { opacity: 0.4; }
.submit-btn:hover:not(:disabled) { background: #333333; }
.scale-result { text-align: center; padding: 12px 0; }
.result-score { font-size: 15px; color: #191c1f; margin-bottom: 6px; }
.result-score strong { font-size: 22px; color: #191c1f; }
.result-severity { font-size: 13px; color: #505a63; margin-bottom: 12px; }
.sev-label { color: #505a63; font-weight: 600; }
.error { color: #e23b4a; font-size: 13px; }
.scale-result .send-btn {
  padding: 8px 20px; border-radius: 9999px; background: #191c1f; color: #ffffff; font-size: 13px; font-weight: 500;
}
.scale-result .send-btn:hover { background: #333333; }
.composer-hint { flex: 1; text-align: center; font-size: 13px; color: #8d969e; padding: 10px; }

.md { font-size: 14px; color: #191c1f; line-height: 1.8; }
.md h1 { font-size: 17px; font-weight: 700; margin: 24px 0 12px; padding: 0 0 0 14px; border-left: 3px solid #191c1f; }
.md h1:first-child { margin-top: 0; }
.md h2 { font-size: 15px; font-weight: 600; margin: 20px 0 10px; padding: 0 0 8px; border-bottom: 2px solid #f0f0f0; }
.md p { margin: 10px 0; color: #505a63; }
.md strong { color: #191c1f; }
.md ul { padding-left: 22px; margin: 10px 0; }
.md li { margin: 6px 0; }

@media (max-width: 600px) {
  .sdiag-header { padding: 12px 14px; }
  .sdiag-chat { padding: 12px 14px; }
}
</style>
