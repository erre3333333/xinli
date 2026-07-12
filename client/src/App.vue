<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { ArrowRight, Close, Picture } from '@element-plus/icons-vue'
import ConditionsView from './components/ConditionsView.vue'
import TherapyHeader from './components/TherapyHeader.vue'
import ChatWindow from './components/ChatWindow.vue'
import VoiceInput from './components/VoiceInput.vue'
import AssessmentStage from './components/AssessmentStage.vue'
import QuestionnaireDashboard from './components/QuestionnaireDashboard.vue'
import ComprehensiveReport from './components/ComprehensiveReport.vue'
import AIDiagnosis from './components/AIDiagnosis.vue'
import ServiceDiagnosis from './components/ServiceDiagnosis.vue'
import AutoCBT from './components/AutoCBT.vue'
import FayeChat from './components/FayeChat.vue'
import Login from './components/Login.vue'
import UserProfile from './components/UserProfile.vue'
import PlansPage from './components/PlansPage.vue'
import UsageBar from './components/UsageBar.vue'
import { PATIENT_TYPES, MODELS, getVisionModels, getNextModel } from './config/models.js'
import { sendChatMessage } from './utils/api.js'
import { useSpeech } from './composables/useSpeech.js'

const SERVICE_TYPES = ['child-emotion', 'adolescent', 'mindfulness', 'social-anxiety']

let fallbackTried = false

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const showLogin = ref(!user.value)
const showProfile = ref(false)
const showPlans = ref(false)
const usageBarRef = ref(null)

function onLoginSuccess(u) {
  user.value = u
  showLogin.value = false
}

function onLogout() {
  user.value = null
  showProfile.value = false
  currentView.value = 'conditions'
}

function goToPlans() {
  showPlans.value = true
  currentView.value = 'conditions'
}

function onUpgraded() {
  showPlans.value = false
  usageBarRef.value?.refresh()
  if (user.value) {
    user.value = JSON.parse(localStorage.getItem('user') || 'null')
  }
}

function goToLogin() {
  showLogin.value = true
  currentView.value = 'conditions'
}

function goToProfile() {
  showProfile.value = true
  currentView.value = 'conditions'
}

const { speak, stop: stopSpeak, hasSupport, hasChineseVoice } = useSpeech()

const mobileMenuOpen = ref(false)

const currentView = ref('conditions')
const currentPatient = ref(null)
const currentServiceType = ref(null)
const messages = ref([])
const isLoading = ref(false)
const selectedModel = ref(MODELS[0].id)
const error = ref(null)
const inputText = ref('')
const selectedImages = ref([])
const imageInputRef = ref(null)
const speakingId = ref(null)
const autoSpeak = ref(true)
const chatView = ref('chat')
const sessionCount = ref(1)
const lastScore = ref('--')

const canSpeak = (msg) => hasSupport.value && Boolean(msg && msg.content)

const greetings = {
  depression: '你好。我是这里的咨询师。\n在你愿意开口之前，没有需要着急说的话——这个空间，节奏由你定。',
  anxiety: '你好，深呼吸一次。\n你不必把所有担忧都说出来，可以只描述当下最贴近身体的感受。',
  ocd: '你好，谢谢你愿意把信任放在这里。\n那些反复出现的想法，我们会一起慢慢地看清它，而不是被你或我立刻评价。',
  bipolar: '你好。无论你今天的状态是高峰还是低谷，\n我都在这里，不会因为情绪的波动而改变我的在场。',
  psychosis: '你好，你好。\n我在这里，安静地陪着你。请慢慢告诉我你正在经历的事情，我会认真地听。',
  ptsd: '你好。你曾经经历过的事情，你现在可以不用急着讲出来。\n我先在这里陪着你，直到你感觉安全了为止。',
  eating: '你好。食物和身体的关系，有时是我们内心最不易开口的对话。\n这里没有评判，只有倾听。',
  adhd: '你好。思绪纷飞、难以专注的感觉，常常让人感到疲惫。\n我们一步一步来，不着急。',
}

function selectPatient(p) {
  if (SERVICE_TYPES.includes(p.id)) {
    currentServiceType.value = p.id
    currentView.value = 'service'
    return
  }
  stopSpeak()
  speakingId.value = null
  chatView.value = 'chat'
  currentPatient.value = p
  const greeting = reactive({
    role: 'assistant',
    content: greetings[p.id],
    timestamp: Date.now(),
  })
  messages.value = [greeting]
  error.value = null
  if (autoSpeak.value && canSpeak(greeting) && hasChineseVoice.value) {
    handleSpeak(greeting)
  }
  currentView.value = 'chat'
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function navigateMobile(view) {
  mobileMenuOpen.value = false
  showLogin.value = false
  currentView.value = view
  currentPatient.value = null
  messages.value = []
}

function goToLanding() {
  stopSpeak()
  speakingId.value = null
  currentView.value = 'conditions'
  currentPatient.value = null
  messages.value = []
}

function startNewChat() {
  stopSpeak()
  speakingId.value = null
  currentPatient.value = null
  messages.value = []
  error.value = null
  inputText.value = ''
  selectedImages.value = []
  currentView.value = 'conditions'
}

async function handleSpeak(msg) {
  if (!canSpeak(msg)) return
  if (speakingId.value !== null && speakingId.value !== msg.timestamp) {
    stopSpeak()
  }
  speakingId.value = msg.timestamp
  try {
    await speak(msg.content)
  } finally {
    if (speakingId.value === msg.timestamp) {
      speakingId.value = null
    }
  }
}

function handleStopSpeak() {
  stopSpeak()
  speakingId.value = null
}

function pickImages() {
  imageInputRef.value?.click()
}

function handleImageSelect(e) {
  const files = e.target.files
  if (!files?.length) return
  const curModel = MODELS.find((m) => m.id === selectedModel.value)
  if (curModel && !curModel.vision) {
    const visionM = getVisionModels()[0]
    if (visionM) selectedModel.value = visionM.id
  }
  for (const f of files) {
    if (selectedImages.value.length >= 4) break
    if (!f.type.startsWith('image/')) continue
    const reader = new FileReader()
    reader.onload = (ev) => {
      selectedImages.value.push({
        id: Date.now() + Math.random(),
        dataUrl: ev.target.result,
        name: f.name,
      })
    }
    reader.readAsDataURL(f)
  }
  e.target.value = ''
}

function removeImage(id) {
  selectedImages.value = selectedImages.value.filter((img) => img.id !== id)
}

async function handleSend() {
  const text = inputText.value.trim()
  if ((!text && selectedImages.value.length === 0) || isLoading.value) return

  stopSpeak()
  speakingId.value = null
  inputText.value = ''
  error.value = null
  const images = selectedImages.value.map((img) => img.dataUrl)
  selectedImages.value = []
  messages.value.push(reactive({ role: 'user', content: text, images, timestamp: Date.now() }))
  isLoading.value = true

  const history = messages.value.slice(0, -1).map((m) => ({
    role: m.role,
    content: m.content,
  }))

  let aiMsg = null
  try {
    const reader = await sendChatMessage({
      message: text,
      images,
      patientType: currentPatient.value.id,
      history,
      model: selectedModel.value,
    })

    aiMsg = reactive({ role: 'assistant', content: '', timestamp: Date.now() })
    messages.value.push(aiMsg)
    isLoading.value = false

    const decoder = new TextDecoder()
    let chunkCount = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunkCount++
      aiMsg.content += decoder.decode(value, { stream: true })
    }
    if (chunkCount === 0) {
      aiMsg.content = '（暂未收到回应，请尝试切换模型或稍后再试）'
    }

    if (autoSpeak.value && canSpeak(aiMsg) && hasChineseVoice.value && !aiMsg.content.startsWith('（')) {
      handleSpeak(aiMsg)
    }
  } catch (e) {
    isLoading.value = false
    const msg = e.message || String(e)
    if (msg.includes('|NEED_UPGRADE')) {
      const cleanMsg = msg.replace('|NEED_UPGRADE', '')
      if (aiMsg) {
        aiMsg.content = `（${cleanMsg}）\n\n[点击升级] ➔ 解锁无限消息`
      } else {
        error.value = cleanMsg
      }
      setTimeout(() => goToPlans(), 3000)
      return
    }
    if (aiMsg) {
      aiMsg.content = `（连接出错：${msg}）`
    } else {
      error.value = msg
    }
    if (!fallbackTried) {
      const next = getNextModel(selectedModel.value)
      if (next) {
        fallbackTried = true
        selectedModel.value = next
        error.value = null
        if (aiMsg) messages.value.pop()
        isLoading.value = false
        await handleSend()
        return
      }
    }
  }
}

function isNearBottom(el) {
  return el.scrollHeight - el.scrollTop - el.clientHeight < 80
}

watch(
  messages,
  () => {
    nextTick(() => {
      const el = document.querySelector('.scroll-view')
      if (el && isNearBottom(el)) el.scrollTop = el.scrollHeight
    })
  },
  { deep: true }
)
</script>

<template>
  <div class="app-shell">
    <div class="bili-header">
      <div class="bili-header-inner">
        <div class="bh-left">
          <button class="bh-logo" @click="goToLanding">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FB7299" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span>心灵花园</span>
          </button>
        </div>
        <div class="bh-center">
      <button
        class="bh-tab"
        :class="{ on: currentView === 'conditions' || currentView === 'chat' }"
        @click="() => { showLogin = false; startNewChat() }"
      >首页 · 咨询服务</button>
          <button
            class="bh-tab"
            :class="{ on: currentView === 'autocbt' }"
            @click="() => { showLogin = false; currentView = 'autocbt' }"
          >AutoCBT</button>
          <button
            class="bh-tab"
            :class="{ on: currentView === 'faye' }"
            @click="() => { showLogin = false; currentView = 'faye' }"
          >Faye</button>
          <button
            class="bh-tab"
            :class="{ on: currentView === 'dashboard' }"
            @click="() => { showLogin = false; currentView = 'dashboard' }"
          >量表中心</button>
      <button
        class="bh-tab"
        :class="{ on: currentView === 'comprehensive' }"
        @click="() => { showLogin = false; currentView = 'comprehensive' }"
      >综合报告</button>
      <button
        class="bh-tab"
        :class="{ on: currentView === 'diagnosis' }"
        @click="() => { showLogin = false; currentView = 'diagnosis' }"
      >AI 问诊</button>
        </div>
        <div class="bh-right">
          <UsageBar ref="usageBarRef" @upgrade-click="goToPlans" />
          <template v-if="user">
            <div class="bh-avatar" @click="goToProfile" :title="user.name">{{ user.name?.charAt(0) || 'U' }}</div>
          </template>
          <template v-else>
            <button class="bh-login-btn" @click="goToLogin">登录</button>
          </template>
          <button class="bh-hamburger" @click="toggleMobileMenu" aria-label="菜单">
            <span :class="['hamburger-line', { open: mobileMenuOpen }]"></span>
          </button>
        </div>
      </div>
    </div>

    <Transition name="drawer">
      <div v-if="mobileMenuOpen" class="mobile-drawer-overlay" @click="toggleMobileMenu">
        <div class="mobile-drawer" @click.stop>
          <div class="md-header">
            <span class="md-title">导航</span>
            <button class="md-close" @click="toggleMobileMenu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="md-body">
            <button
              class="md-item"
              :class="{ on: currentView === 'conditions' || currentView === 'chat' }"
              @click="navigateMobile('conditions')"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <span>首页 · 咨询服务</span>
            </button>
            <button
              class="md-item"
              :class="{ on: currentView === 'autocbt' }"
              @click="navigateMobile('autocbt')"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span>AutoCBT</span>
            </button>
            <button
              class="md-item"
              :class="{ on: currentView === 'faye' }"
              @click="navigateMobile('faye')"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span>Faye 情绪调节</span>
            </button>
            <button
              class="md-item"
              :class="{ on: currentView === 'dashboard' }"
              @click="navigateMobile('dashboard')"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 3H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><path d="M19 3h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><path d="M9 15H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z"/><path d="M19 15h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z"/></svg>
              <span>量表中心</span>
            </button>
            <button
              class="md-item"
              :class="{ on: currentView === 'comprehensive' }"
              @click="navigateMobile('comprehensive')"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <span>综合报告</span>
            </button>
            <button
              class="md-item"
              :class="{ on: currentView === 'diagnosis' }"
              @click="navigateMobile('diagnosis')"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span>AI 问诊</span>
            </button>
          </div>
          <div class="md-footer">
            <template v-if="user">
              <button class="md-item" @click="mobileMenuOpen = false; goToProfile()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>{{ user.name || '个人中心' }}</span>
              </button>
            </template>
            <template v-else>
              <button class="md-item" @click="mobileMenuOpen = false; goToLogin()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                <span>登录</span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>
    <div class="bili-subnav" v-if="currentView !== 'chat'">
      <button
        class="bs-tab"
        :class="{ on: currentView === 'dashboard' }"
        @click="() => { showLogin = false; currentView = 'dashboard' }"
      >心理量表</button>
      <button
        class="bs-tab"
        :class="{ on: currentView === 'comprehensive' }"
        @click="() => { showLogin = false; currentView = 'comprehensive' }"
      >综合报告</button>
    </div>

    <main class="app-main">
      <template v-if="showLogin">
        <Login
          @login-success="onLoginSuccess"
          @back="showLogin = false"
        />
      </template>

      <template v-else-if="showPlans">
        <PlansPage
          @back="showPlans = false"
          @upgraded="onUpgraded"
        />
      </template>

      <template v-else-if="showProfile">
        <UserProfile
          @logout="onLogout"
          @back="showProfile = false"
        />
      </template>

      <template v-else>
        <ConditionsView
          v-if="currentView === 'conditions'"
          :patients="PATIENT_TYPES"
          @select="selectPatient"
          @back="goToLanding"
        />

        <QuestionnaireDashboard
          v-else-if="currentView === 'dashboard'"
          @back="goToLanding"
        />

        <ComprehensiveReport
          v-else-if="currentView === 'comprehensive'"
          @back="goToLanding"
        />

        <AIDiagnosis
          v-else-if="currentView === 'diagnosis'"
          :userId="user?.id"
          @back="goToLanding"
        />

        <ServiceDiagnosis
          v-else-if="currentView === 'service'"
          :serviceType="currentServiceType"
          :userId="user?.id"
          @back="goToLanding"
        />

        <AutoCBT
          v-else-if="currentView === 'autocbt'"
          @back="goToLanding"
        />

        <FayeChat
          v-else-if="currentView === 'faye'"
          @back="goToLanding"
        />

        <div v-else-if="currentView === 'chat'" class="chat-layout">
        <TherapyHeader
          :patient="currentPatient"
          :model="selectedModel"
          :models="MODELS"
          :autoSpeak="autoSpeak"
          :speaking="speakingId !== null"
          :view="chatView"
          :messages="messages.length"
          :sessions="sessionCount"
          :lastScore="lastScore"
          @update:model="selectedModel = $event"
          @update:autoSpeak="autoSpeak = $event"
          @update:view="chatView = $event"
          @new-chat="startNewChat"
          @back="startNewChat"
        />

        <div class="stage">
          <div class="panel" :key="chatView">
            <template v-if="chatView === 'chat'">
              <ChatWindow
                :messages="messages"
                :isLoading="isLoading"
                :patient="currentPatient"
                :speakingId="speakingId"
                :hasVoice="hasSupport"
                :hasChinese="hasChineseVoice"
                @speak="handleSpeak"
                @stop-speak="handleStopSpeak"
              />
              <div class="composer">
                <el-alert
                  v-if="error"
                  :title="error"
                  type="error"
                  show-icon
                  :closable="false"
                  class="composer-error-el"
                />
                <div v-if="selectedImages.length" class="image-preview">
                  <div v-for="img in selectedImages" :key="img.id" class="ip-item">
                    <img :src="img.dataUrl" :alt="img.name" class="ip-thumb" />
                    <el-button
                      size="small"
                      circle
                      class="ip-remove-el"
                      @click="removeImage(img.id)"
                    >
                      <el-icon><Close /></el-icon>
                    </el-button>
                  </div>
                </div>
                <div class="composer-bar">
                  <el-input
                    v-model="inputText"
                    :rows="1"
                    type="textarea"
                    placeholder="输入消息…"
                    resize="none"
                    :autosize="{ minRows: 1, maxRows: 4 }"
                    class="composer-input-el"
                    @keydown.enter.exact.prevent="handleSend"
                  />
                  <input
                    ref="imageInputRef"
                    type="file"
                    accept="image/*"
                    multiple
                    class="image-input-hidden"
                    @change="handleImageSelect"
                  />
                  <el-button
                    text
                    class="composer-image-el"
                    :title="selectedImages.length ? '已选择 ' + selectedImages.length + ' 张图片' : '上传图片'"
                    @click="pickImages"
                  >
                    <el-icon size="18"><Picture /></el-icon>
                    <el-badge v-if="selectedImages.length" :value="selectedImages.length" class="ci-badge-el" />
                  </el-button>
                  <VoiceInput @result="(t) => { inputText = t }" />
                  <el-button
                    type="primary"
                    :icon="ArrowRight"
                    circle
                    :disabled="(!inputText.trim() && !selectedImages.length) || isLoading"
                    class="composer-send-el"
                    @click="handleSend"
                  />
                </div>
                <div class="composer-hint">
                  <span>↵ 发送</span>
                  <span class="hint-dot">·</span>
                  <span>&#8679;↵ 换行</span>
                </div>
              </div>
            </template>

            <template v-else>
              <AssessmentStage
                :patient="currentPatient"
                :patientColor="currentPatient.color"
                @back="chatView = 'chat'"
              />
            </template>
          </div>
        </div>
      </div>
      </template>
    </main>

    <div class="trust-mark" aria-hidden="true"></div>
  </div>
</template>

<style scoped>
.app-shell {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.trust-mark {
  position: fixed;
  bottom: 8px;
  right: 14px;
  z-index: 5;
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--ink-muted);
  opacity: 0.5;
  pointer-events: none;
  letter-spacing: 0.3px;
}
.trust-mark::after {
  content: '基于标准筛查工具 · 仅供参考';
}

/* Bilibili-style Header — Warm Theme */
.bili-header {
  flex-shrink: 0;
  background: linear-gradient(135deg, #FFF5EB 0%, #FFE8D6 100%);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(200, 150, 100, 0.15);
}
.bili-header-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 56px;
  gap: 24px;
}
.bh-left {
  flex-shrink: 0;
}
.bh-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #8B5E3C;
  letter-spacing: 0.5px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}
.bh-logo:hover {
  opacity: 0.8;
}
.bh-center {
  flex: 1;
  display: flex;
  gap: 2px;
  justify-content: center;
}
.bh-tab {
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #8B7355;
  transition: all 0.25s ease;
  white-space: nowrap;
  border: none;
  background: transparent;
  cursor: pointer;
}
.bh-tab:hover {
  color: #6B4E37;
  background: rgba(251, 114, 153, 0.08);
}
.bh-tab.on {
  color: #FFF5EB;
  background: linear-gradient(135deg, #FB7299, #E85D75);
  box-shadow: 0 2px 12px rgba(251, 114, 153, 0.3);
}
.bh-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}
.bh-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(139, 94, 60, 0.08);
  border-radius: 20px;
  padding: 6px 14px;
  color: #8B7355;
  width: 200px;
  border: 1px solid rgba(139, 94, 60, 0.12);
}
.bh-search input {
  background: none;
  border: none;
  outline: none;
  font-size: 13px;
  color: #6B4E37;
  width: 100%;
}
.bh-search input::placeholder {
  color: #B89E82;
}
.bh-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FB7299, #E85D75);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.3);
}
.bh-avatar:hover {
  box-shadow: 0 4px 12px rgba(251, 114, 153, 0.4);
}

.bh-login-btn {
  padding: 6px 18px; border-radius: 20px; border: 1px solid rgba(200, 150, 100, 0.2);
  background: linear-gradient(135deg, #FB7299, #E85D75);
  color: white; font-size: 13px; font-weight: 500; cursor: pointer;
  transition: all 0.2s;
}
.bh-login-btn:hover { opacity: 0.9; box-shadow: 0 2px 8px rgba(251, 114, 153, 0.3); }

/* Subnav — Warm Theme */
.bili-subnav {
  background: linear-gradient(135deg, #FFF9F5 0%, #FFF0E6 100%);
  border-bottom: 1px solid rgba(200, 150, 100, 0.12);
  display: flex;
  gap: 4px;
  padding: 0 24px;
  height: 44px;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
.bs-tab {
  padding: 4px 16px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  color: #8B7355;
  transition: all 0.2s;
  border: none;
  background: transparent;
  cursor: pointer;
}
.bs-tab:hover {
  color: #6B4E37;
  background: rgba(251, 114, 153, 0.08);
}
.bs-tab.on {
  color: #FFF5EB;
  background: linear-gradient(135deg, #FB7299, #E85D75);
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.25);
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(180deg, #FFF9F5 0%, #FFF5EB 100%);
}

/* Chat Layout */
.chat-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.stage {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 0 16px 16px;
  overflow: hidden;
}

.panel {
  width: 100%;
  max-width: var(--content-max);
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(180deg, #FFFFFF 0%, #FFF9F5 100%);
  border: 1px solid rgba(200, 150, 100, 0.12);
  border-radius: var(--r-lg);
  position: relative;
  overflow: hidden;
  animation: float-in 0.5s var(--ease-out) both;
  box-shadow: 0 4px 24px rgba(139, 94, 60, 0.06);
}

.composer {
  padding: 12px 20px 16px;
  background: linear-gradient(180deg, #FFF9F5 0%, #FFF5EB 100%);
  border-top: 1px solid rgba(200, 150, 100, 0.12);
  position: relative;
}

.composer-error-el {
  margin-bottom: 8px;
}

.composer-bar {
  display: flex;
  gap: 6px;
  align-items: center;
  background: #FFFFFF;
  border: 1px solid rgba(200, 150, 100, 0.15);
  border-radius: var(--r-pill);
  padding: 4px 4px 4px 4px;
  transition: all 0.2s var(--ease-out);
  box-shadow: 0 1px 4px rgba(139, 94, 60, 0.04);
}

.composer-bar:focus-within {
  border-color: #FB7299;
  box-shadow: 0 0 0 3px rgba(251, 114, 153, 0.1);
}

.composer-input-el {
  flex: 1;
}
.composer-input-el :deep(.el-textarea__inner) {
  border: none !important;
  box-shadow: none !important;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
}
.composer-input-el :deep(.el-textarea__inner:focus) {
  box-shadow: none !important;
}

.composer-image-el {
  font-size: 18px;
  color: var(--ink-muted);
}
.composer-image-el:hover {
  color: var(--ink);
}

.ci-badge-el :deep(.el-badge__content) {
  font-size: 9px;
  height: 14px;
  line-height: 14px;
  padding: 0 4px;
  border: none;
}

.composer-send-el {
  flex-shrink: 0;
}

.image-input-hidden {
  display: none;
}

.image-preview {
  display: flex;
  gap: 8px;
  padding: 0 4px 8px;
  overflow-x: auto;
}

.ip-item {
  position: relative;
  flex-shrink: 0;
}

.ip-thumb {
  width: 56px;
  height: 56px;
  border-radius: var(--r-sm);
  object-fit: cover;
  border: 1px solid rgba(200, 150, 100, 0.15);
  box-shadow: 0 1px 3px rgba(139, 94, 60, 0.08);
}

.ip-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--hairline);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-secondary);
  transition: all 0.15s;
}

.ip-remove:hover {
  background: var(--red-soft, #fdd);
  border-color: var(--red, #e55);
  color: var(--red, #e33);
}

.composer-image {
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-muted);
  transition: all 0.2s var(--ease-out);
  flex-shrink: 0;
}

.composer-image:hover {
  color: var(--ink);
  background: var(--surface-soft);
}

.ci-badge {
  position: absolute;
  top: 0;
  right: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--on-primary);
  font-size: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.composer-send {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-muted);
  background: transparent;
  transition: all 0.2s var(--ease-out);
  flex-shrink: 0;
}

.composer-send.can {
  color: var(--on-primary);
  background: var(--primary);
}

.composer-send.can:hover {
  opacity: 0.85;
}

.composer-send:disabled {
  cursor: default;
}

.composer-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--ink-muted);
  letter-spacing: 0.2px;
  padding: 0 4px;
}

.hint-dot {
  color: var(--hairline);
}

.error-enter-active,
.error-leave-active {
  transition: all 0.2s var(--ease-out);
}
.error-enter-from,
.error-leave-to {
  opacity: 0;
}

/* —— Hamburger —— */
.bh-hamburger {
  display: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  color: var(--ink-muted);
  border: 1px solid var(--hairline);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
  position: relative;
}
.bh-hamburger:hover {
  color: var(--ink);
  border-color: var(--ink-muted);
}
.hamburger-line,
.hamburger-line::before,
.hamburger-line::after {
  display: block;
  width: 16px;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  transition: all 0.25s var(--ease-out);
  position: absolute;
  left: 50%;
  margin-left: -8px;
}
.hamburger-line { top: 50%; margin-top: -1px; }
.hamburger-line::before { content: ''; top: -5px; }
.hamburger-line::after { content: ''; top: 5px; }
.hamburger-line.open { background: transparent; }
.hamburger-line.open::before { top: 0; transform: rotate(45deg); }
.hamburger-line.open::after { top: 0; transform: rotate(-45deg); }

/* —— Mobile Drawer —— */
.mobile-drawer-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: flex-end;
}
.mobile-drawer {
  width: 280px; max-width: 85vw;
  height: 100%;
  background: linear-gradient(180deg, #FFF9F5, #FFFFFF);
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0,0,0,0.1);
  animation: slide-in-right 0.25s var(--ease-out);
}
.md-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 12px;
  border-bottom: 1px solid rgba(200, 150, 100, 0.1);
}
.md-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
}
.md-close {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--ink-muted);
  cursor: pointer;
}
.md-close:hover { background: var(--surface-hover); color: var(--ink); }
.md-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.md-footer {
  border-top: 1px solid rgba(200, 150, 100, 0.1);
  padding: 12px 8px;
}
.md-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--r-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-secondary);
  cursor: pointer;
  transition: all 0.15s var(--ease-out);
  width: 100%;
  text-align: left;
  border: none;
  background: none;
}
.md-item:hover {
  background: var(--surface-hover);
  color: var(--ink);
}
.md-item.on {
  background: rgba(251, 114, 153, 0.08);
  color: #E85D75;
  font-weight: 600;
}

@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.25s var(--ease-out);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .mobile-drawer,
.drawer-leave-to .mobile-drawer {
  transform: translateX(100%);
}

/* —— Mobile Responsive —— */
@media (max-width: 900px) {
  .bh-center { display: none; }
  .bh-hamburger { display: inline-flex; }
  .bili-header-inner { padding: 0 12px; }
  .bh-right { gap: 8px; }
  .bili-subnav { display: none; }
}

@media (max-width: 720px) {
  .stage { padding: 0 10px 12px; }
  .composer { padding: 10px 12px 12px; }
  .panel { border-radius: var(--r-md); }
  .bili-header-inner { height: 48px; }
  .bh-logo { font-size: 14px; }
}

@media (max-width: 480px) {
  .composer-bar { gap: 4px; padding: 2px; }
  .composer-input-el :deep(.el-textarea__inner) { padding: 6px 10px; font-size: 13px; }
  .composer-hint { font-size: 10px; }
}
</style>
