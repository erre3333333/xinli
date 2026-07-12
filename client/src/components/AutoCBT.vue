<template>
  <div class="autocbt-container">
    <div class="autocbt-header">
      <h2>AutoCBT 交互诊断</h2>
      <p class="subtitle">基于认知行为疗法（CBT）的多Agent智能咨询系统</p>
    </div>

    <div class="autocbt-messages" ref="messagesContainer">
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="['message', msg.role]"
      >
        <div class="message-content">
          <div v-if="msg.role === 'assistant'" class="agent-label">
            <span class="agent-icon">🧠</span>
            AutoCBT 咨询师
          </div>
          <div class="message-text">{{ msg.content }}</div>
          
          <!-- 显示路由日志 -->
          <div v-if="msg.routingLog" class="routing-log">
            <details>
              <summary>查看路由详情</summary>
              <div class="log-details">
                <p><strong>访问的监督者：</strong>{{ msg.routingLog.visitedSupervisors.join(', ') || '无' }}</p>
                <p><strong>迭代次数：</strong>{{ msg.routingLog.iteration }}</p>
                <p><strong>信心分数：</strong>{{ (msg.routingLog.confidence * 100).toFixed(1) }}%</p>
                <p v-if="msg.routingLog.cognitiveDistortions?.length"><strong>检测到的认知扭曲：</strong>{{ msg.routingLog.cognitiveDistortions.join(', ') }}</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="message assistant">
        <div class="message-content">
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="autocbt-input">
      <textarea
        v-model="inputText"
        @keyup.enter.exact.prevent="sendMessage"
        placeholder="请输入你的心理困扰..."
        rows="1"
      ></textarea>
      <button @click="sendMessage" :disabled="!inputText.trim() || isLoading">
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'

const messages = ref([])
const inputText = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)

onMounted(() => {
  messages.value = [
    {
      role: 'assistant',
      content: '你好！我是 AutoCBT 智能咨询师。我会基于认知行为疗法（CBT）的原则，结合共情验证、认知扭曲识别、反思挑战、策略提供和鼓励前瞻五个专业维度，为你提供心理咨询服务。请告诉我你的困扰。',
    },
  ]
})

async function sendMessage() {
  if (!inputText.value.trim() || isLoading.value) return

  const userMessage = inputText.value.trim()
  inputText.value = ''
  isLoading.value = true

  messages.value.push({
    role: 'user',
    content: userMessage,
  })

  try {
    const history = messages.value
      .filter(m => m.role !== 'routingLog')
      .map(m => ({ role: m.role, content: m.content }))

    function h() { const t = localStorage.getItem('token'); return t ? { 'Authorization': `Bearer ${t}` } : {} }
    const response = await fetch(`${API_BASE}/api/autocbt/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...h() },
      body: JSON.stringify({
        message: userMessage,
        history,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    messages.value.push({
      role: 'assistant',
      content: data.content,
      routingLog: {
        visitedSupervisors: data.routingLog?.visitedSupervisors || [],
        iteration: data.iteration || 0,
        confidence: data.confidence || 0,
        cognitiveDistortions: data.cognitiveDistortions || [],
      },
    })
  } catch (e) {
    console.error('[AutoCBT] 发送消息失败:', e)
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

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>

<style scoped>
.autocbt-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--canvas, #fafafa);
}

.autocbt-header {
  padding: 20px;
  background: linear-gradient(135deg, #FFF9F5, #FFE8F0);
  border-bottom: 1px solid rgba(200, 150, 100, 0.1);
}

.autocbt-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  background: linear-gradient(135deg, #8B5E3C, #FB7299);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #8B7355;
}

.autocbt-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: linear-gradient(180deg, #FFFAF5, #FFFFFF);
}

.message {
  margin-bottom: 16px;
  max-width: 80%;
}

.message.user {
  margin-left: auto;
}

.message.assistant {
  margin-right: auto;
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  background: #FFFFFF;
  box-shadow: 0 1px 4px rgba(139, 94, 60, 0.06);
  border: 1px solid rgba(200, 150, 100, 0.08);
}

.message.user .message-content {
  background: linear-gradient(135deg, #FB7299, #E85D75);
  color: white;
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.2);
}

.agent-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #8B7355;
}

.message.user .message-content {
  background: #667eea;
  color: white;
}

.agent-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.agent-icon {
  font-size: 14px;
}

.message-text {
  line-height: 1.6;
  white-space: pre-wrap;
}

.routing-log {
  margin-top: 8px;
  font-size: 12px;
}

.routing-log details {
  background: linear-gradient(135deg, #FFF9F5, #FFFFFF);
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(200, 150, 100, 0.1);
}

.routing-log summary {
  cursor: pointer;
  color: #FB7299;
}

.log-details p {
  margin: 4px 0;
  color: #8B7355;
}

.routing-log summary {
  cursor: pointer;
  color: #667eea;
  font-weight: 500;
}

.log-details p {
  margin: 4px 0;
  color: #555;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

.autocbt-input {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #FFF9F5, #FFFFFF);
  border-top: 1px solid rgba(200, 150, 100, 0.1);
}

.autocbt-input textarea {
  flex: 1;
  padding: 12px;
  border: 1px solid rgba(200, 150, 100, 0.2);
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  min-height: 44px;
  max-height: 120px;
  background: #FFFFFF;
  color: #5C4033;
}

.autocbt-input textarea:focus {
  outline: none;
  border-color: #FB7299;
  box-shadow: 0 0 0 3px rgba(251, 114, 153, 0.1);
}

.autocbt-input button {
  padding: 0 24px;
  background: linear-gradient(135deg, #FB7299, #E85D75);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.25);
}

.autocbt-input button:hover:not(:disabled) {
  background: linear-gradient(135deg, #E85D75, #D44A63);
  box-shadow: 0 4px 12px rgba(251, 114, 153, 0.35);
}

.autocbt-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 720px) {
  .autocbt-container { padding: 0 0 12px; }
  .autocbt-header { padding: 16px; }
  .autocbt-header h2 { font-size: 18px; }
  .autocbt-messages { padding: 8px 12px; }
  .autocbt-input { padding: 8px 12px 12px; gap: 8px; }
  .autocbt-input textarea { padding: 10px; font-size: 14px; }
  .autocbt-input button { padding: 0 16px; font-size: 13px; }
  .message-content { max-width: 92%; }
}
</style>
