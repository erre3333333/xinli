<template>
  <div class="faye-container">
    <!-- Header -->
    <div class="faye-header">
      <div class="faye-header-inner">
        <div class="faye-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <div class="faye-title">
          <h2>Faye 情绪调节助手</h2>
          <p>基于 CBT 的认知行为疗法</p>
        </div>
      </div>
    </div>

    <!-- Stage Indicator -->
    <div class="faye-stage-bar" v-if="currentStage">
      <div class="stage-steps">
        <div
          v-for="(step, idx) in stages"
          :key="idx"
          :class="['stage-step', { active: idx === currentStageIndex, completed: idx < currentStageIndex }]"
        >
          <div class="stage-dot">{{ idx + 1 }}</div>
          <div class="stage-label">{{ step.label }}</div>
        </div>
      </div>
    </div>

    <!-- Messages Area -->
    <div class="faye-messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="faye-empty">
        <div class="empty-icon">🧘</div>
        <h3>你好，我是 Faye</h3>
        <p>你的日常情绪调节伙伴</p>
        <p class="empty-hint">告诉我你现在的感觉，我会帮助你理解和调节情绪</p>
      </div>

      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="['faye-message', msg.role]"
      >
        <div class="faye-message-bubble">
          <div v-if="msg.role === 'assistant'" class="faye-sender">Faye</div>
          <div class="faye-content" v-html="formatMessage(msg.content)"></div>
          
          <!-- Emotion Badge -->
          <div v-if="msg.emotionContext" class="faye-emotion-badge">
            <span class="emotion-label">{{ msg.emotionContext.lastEmotion || '未知' }}</span>
            <span class="emotion-intensity">{{ msg.emotionContext.lastIntensity || 0 }}/10</span>
          </div>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isLoading" class="faye-message assistant">
        <div class="faye-message-bubble">
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <!-- Crisis Warning -->
      <div v-if="showCrisisWarning" class="faye-crisis-warning">
        <div class="crisis-icon">⚠️</div>
        <div class="crisis-content">
          <h4>紧急求助提示</h4>
          <p>如果你正处于危机中，请立即联系专业帮助：</p>
          <ul>
            <li>🇺🇸 美国：拨打 988 或 911</li>
            <li>🇬🇧 英国：拨打 116 123</li>
            <li>🌍 国际：访问 findahelpline.com</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="faye-input-area">
      <div class="input-wrapper">
        <textarea
          v-model="inputText"
          @keydown.enter.exact.prevent="sendMessage"
          @input="autoResize"
          placeholder="告诉我你现在的感觉..."
          rows="1"
        ></textarea>
        <button
          @click="sendMessage"
          :disabled="!inputText.trim() || isLoading"
          class="send-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
      <div class="input-hint">
        <span>按 Enter 发送 · Shift+Enter 换行</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, computed } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

// CBT 5步情绪调节阶段
const stages = [
  { label: '识别', key: 'identify' },
  { label: '探索', key: 'explore' },
  { label: '重构', key: 'reframe' },
  { label: '调节', key: 'regulate' },
  { label: '反思', key: 'reflect' },
]

const messages = ref([])
const inputText = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)
const emotionContext = ref(null)
const showCrisisWarning = ref(false)

const currentStage = computed(() => {
  if (!emotionContext.value) return null
  return emotionContext.value.stage
})

const currentStageIndex = computed(() => {
  if (!currentStage.value) return 0
  const idx = stages.findIndex(s => s.key === currentStage.value)
  return idx >= 0 ? idx : 0
})

onMounted(() => {
  // 初始化欢迎消息
  messages.value = [
    {
      role: 'assistant',
      content: '你好，我是 Faye，你的情绪调节伙伴。我在这里帮助你理解和调节自己的情绪。\n\n今天感觉怎么样？你可以告诉我任何让你困扰的事情。',
      emotionContext: { stage: 'identify', intensity: 0 },
    },
  ]
})

async function sendMessage() {
  if (!inputText.value.trim() || isLoading.value) return

  const userMessage = inputText.value.trim()
  inputText.value = ''
  isLoading.value = true

  // 重置危机警告
  showCrisisWarning.value = false

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: userMessage,
  })

  try {
    const history = messages.value
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content }))

    const response = await fetch(`${API_BASE}/api/faye`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        message: userMessage,
        history,
        emotionContext: emotionContext.value,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // 更新情绪上下文
    if (data.emotionContext) {
      emotionContext.value = data.emotionContext
    }

    // 检查是否为危机情况
    if (data.type === 'crisis') {
      showCrisisWarning.value = true
    }

    // 添加助手回复
    messages.value.push({
      role: 'assistant',
      content: data.content,
      emotionContext: data.emotionContext,
    })
  } catch (e) {
    console.error('[Faye] 发送消息失败:', e)
    messages.value.push({
      role: 'assistant',
      content: `连接错误: ${e.message}`,
    })
  } finally {
    isLoading.value = false
    await nextTick()
    scrollToBottom()
  }
}

function formatMessage(text) {
  if (!text) return ''
  // 简单格式化：换行和粗体
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

function autoResize(e) {
  e.target.style.height = 'auto'
  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>

<style scoped>
.faye-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(180deg, #fef3f2 0%, #ffffff 100%);
}

.faye-header {
  background: linear-gradient(135deg, #FB7299, #F9A8D4);
  color: white;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.2);
}

.faye-header-inner {
  display: flex;
  align-items: center;
  gap: 12px;
}

.faye-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.faye-title h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 2px 0;
}

.faye-title p {
  font-size: 12px;
  opacity: 0.9;
  margin: 0;
}

/* Stage Bar */
.faye-stage-bar {
  background: white;
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 20px;
}

.stage-steps {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.stage-step {
  flex: 1;
  text-align: center;
  opacity: 0.4;
  transition: all 0.3s;
}

.stage-step.active {
  opacity: 1;
}

.stage-step.completed {
  opacity: 0.7;
}

.stage-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f0f0f0;
  color: #666;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 4px;
}

.stage-step.active .stage-dot {
  background: #FB7299;
  color: white;
}

.stage-step.completed .stage-dot {
  background: #F9A8D4;
  color: white;
}

.stage-label {
  font-size: 11px;
  color: #666;
}

/* Messages */
.faye-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.faye-empty {
  text-align: center;
  padding: 60px 20px;
  color: #888;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.faye-empty h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 8px;
}

.faye-empty p {
  margin-bottom: 4px;
}

.empty-hint {
  font-size: 13px;
  color: #999;
  margin-top: 12px;
}

.faye-message {
  margin-bottom: 16px;
  max-width: 80%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.faye-message.user {
  margin-left: auto;
}

.faye-message.assistant {
  margin-right: auto;
}

.faye-message-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  position: relative;
}

.faye-message.user .faye-message-bubble {
  background: linear-gradient(135deg, #FB7299, #F9A8D4);
  color: white;
  border-bottom-right-radius: 4px;
}

.faye-message.assistant .faye-message-bubble {
  background: white;
  color: #333;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-bottom-left-radius: 4px;
}

.faye-sender {
  font-size: 11px;
  color: #FB7299;
}

.faye-content {
  line-height: 1.6;
  font-size: 14px;
  white-space: pre-wrap;
}

.faye-emotion-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 11px;
}

.emotion-label {
  background: #FFF9F5;
  color: #FB7299;
}

.emotion-intensity {
  color: #999;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #FB7299;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-8px); opacity: 1; }
}

/* Crisis Warning */
.faye-crisis-warning {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}

.crisis-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.crisis-content h4 {
  color: #856404;
  margin: 0 0 8px 0;
  font-size: 14px;
}

.crisis-content p {
  color: #856404;
  margin: 0 0 8px 0;
  font-size: 13px;
}

.crisis-content ul {
  margin: 0;
  padding-left: 20px;
  color: #856404;
  font-size: 12px;
}

.crisis-content li {
  margin-bottom: 4px;
}

/* Input Area */
.faye-input-area {
  background: white;
  border-top: 1px solid #f0f0f0;
  padding: 16px 20px;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-wrapper textarea {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  min-height: 44px;
  max-height: 120px;
  outline: none;
  transition: border-color 0.2s;
}

.input-wrapper textarea:focus {
  border-color: #FB7299;
  box-shadow: 0 0 0 3px rgba(251, 114, 153, 0.1);
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FB7299, #F9A8D4);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(251, 114, 153, 0.3);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-hint {
  text-align: center;
  font-size: 11px;
  color: #999;
  margin-top: 8px;
}

@media (max-width: 720px) {
  .faye-container { padding: 0 0 12px; }
  .faye-header { padding: 12px 14px; }
  .faye-title h2 { font-size: 16px; }
  .faye-messages { padding: 8px 12px; }
  .input-area { padding: 8px 12px 12px; }
  .stage-steps { gap: 4px; padding: 0 8px; }
  .stage-step { min-width: 0; }
  .stage-label { font-size: 9px; }
  .stage-dot { width: 22px; height: 22px; font-size: 10px; }
}
</style>
