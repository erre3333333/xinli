<script setup>
import { ref, onUnmounted } from 'vue'

const emit = defineEmits(['result'])
const on = ref(false)
const sr = ref(null)
const hasSR = ref(false)
const errorMsg = ref('')

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  hasSR.value = true
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
  sr.value = new Ctor()
  sr.value.lang = 'zh-CN'
  sr.value.continuous = true
  sr.value.interimResults = true
  sr.value.maxAlternatives = 1

  sr.value.onresult = (e) => {
    let interim = ''
    let final = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i][0].transcript
      if (e.results[i].isFinal) final += r
      else interim += r
    }
    emit('result', final || interim)
  }

  sr.value.onerror = (e) => {
    if (e.error === 'no-speech') return
    if (e.error === 'aborted') return
    errorMsg.value = e.error === 'not-allowed' ? '麦克风权限被拒绝' :
      e.error === 'language-not-supported' ? '不支持中文识别' : ''
    stop()
  }

  sr.value.onend = () => {
    if (on.value) {
      try { sr.value?.start() } catch {}
    }
  }
}

function toggle() {
  on.value ? stop() : start()
}

function start() {
  if (!sr.value) return
  errorMsg.value = ''
  try {
    sr.value.start()
    on.value = true
  } catch { on.value = false }
}

function stop() {
  if (!sr.value) return
  try { sr.value.stop() } catch {}
  on.value = false
}

onUnmounted(() => stop())
</script>

<template>
  <div class="voice-wrap">
    <button
      v-if="hasSR"
      class="mic"
      :class="{ live: on }"
      @click="toggle"
      :title="on ? '点击停止录音' : '点击开始语音输入'"
    >
      <span class="mic-ring" :class="{ pulse: on }"></span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    </button>
    <span v-if="on" class="voice-pulse">
      <span></span><span></span><span></span><span></span>
    </span>
    <span v-if="errorMsg" class="voice-err">{{ errorMsg }}</span>
  </div>
</template>

<style scoped>
.voice-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.mic {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: var(--ink-muted);
  transition: all 0.2s var(--ease-out);
  background: transparent;
}
.mic:hover { background: rgba(251, 114, 153, 0.08); color: #FB7299; }
.mic.live {
  color: white;
  background: linear-gradient(135deg, #FB7299, #E85D75);
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.3);
}
.mic.live:hover {
  background: linear-gradient(135deg, #E85D75, #D95068);
}

.mic-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: all 0.3s var(--ease-out);
}
.mic-ring.pulse {
  border-color: #FB7299;
  animation: ring-pulse 1.2s ease-out infinite;
}

@keyframes ring-pulse {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.4); opacity: 0; }
}

.voice-pulse {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 16px;
}
.voice-pulse span {
  width: 3px;
  background: linear-gradient(180deg, #FB7299, #E85D75);
  border-radius: 2px;
  animation: speak-wave 0.8s ease-in-out infinite;
}
.voice-pulse span:nth-child(1) { height: 6px; animation-delay: -0.4s; }
.voice-pulse span:nth-child(2) { height: 12px; animation-delay: -0.2s; }
.voice-pulse span:nth-child(3) { height: 8px; animation-delay: -0.6s; }
.voice-pulse span:nth-child(4) { height: 14px; animation-delay: -0.3s; }

@keyframes speak-wave {
  0%, 100% { transform: scaleY(0.5); opacity: 0.4; }
  50% { transform: scaleY(1); opacity: 1; }
}

.voice-err {
  font-size: 10px;
  color: var(--red);
  white-space: nowrap;
}
</style>
