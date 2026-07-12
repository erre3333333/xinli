<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  message: { type: Object, required: true },
  patient: { type: Object, required: true },
  speakingId: { type: [Number, null], default: null },
  hasVoice: { type: Boolean, default: false },
  hasChinese: { type: Boolean, default: false },
})

const emit = defineEmits(['speak', 'stop'])

const lightboxSrc = ref(null)

const time = computed(() => {
  return new Date(props.message.timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
})

const isUser = computed(() => props.message.role === 'user')
const isThisSpeaking = computed(() => props.speakingId === props.message.timestamp)

const avatarStyle = computed(() => {
  const c = props.patient.color
  return {
    background: c + '26',
    borderColor: c,
  }
})

const dotStyle = computed(() => {
  return { background: props.patient.color }
})

const speakTitle = computed(() => {
  if (isThisSpeaking.value) return '停止朗读'
  if (!props.hasChinese) return '朗读（未检测到中文语音包）'
  return '朗读'
})

function onSpeakClick() {
  if (isThisSpeaking.value) {
    emit('stop')
  } else {
    emit('speak', props.message)
  }
}
</script>

<template>
  <article class="glass-bubble" :class="{ user: isUser }">
    <div class="gb-meta" v-if="!isUser">
      <span class="gb-dot" :style="{ background: props.patient.color }"></span>
      <span class="gb-name">{{ patient.label }}</span>
      <span class="gb-time">{{ time }}</span>
    </div>

    <div class="gb-body" :class="{ user: isUser }">
      <div v-if="message.images?.length" class="gb-images">
        <img v-for="(img, i) in message.images" :key="i" :src="img" class="gb-img" alt="上传图片" @click="lightboxSrc = img" />
      </div>
      <div v-if="message.content" class="gb-text">{{ message.content }}</div>
    </div>

    <Teleport to="body">
      <div v-if="lightboxSrc" class="gb-lightbox" @click="lightboxSrc = null">
        <img :src="lightboxSrc" class="gb-lightbox-img" alt="查看大图" />
      </div>
    </Teleport>
    <div class="gb-footer" :class="{ right: isUser }">
      <button
        v-if="!isUser && message.content && hasVoice"
        class="gb-speak"
        :class="{ active: isThisSpeaking }"
        :title="speakTitle"
        @click="onSpeakClick"
      >
        <svg v-if="!isThisSpeaking" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
        <span v-else class="gb-waves" aria-hidden="true">
          <span></span><span></span>
        </span>
      </button>
      <span class="gb-time">{{ time }}</span>
    </div>
  </article>
</template>

<style scoped>
.glass-bubble {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 85%;
  align-self: flex-start;
  animation: bubble-in 0.35s var(--ease-out) both;
}

.glass-bubble.user {
  align-self: flex-end;
  align-items: flex-end;
}

.gb-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
}

.gb-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.gb-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--ink);
}

.gb-time {
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--ink-muted);
  letter-spacing: 0.2px;
}

.gb-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  border-radius: var(--r-md);
  background: linear-gradient(135deg, #FFF9F5, #FFF5EB);
  border: 1px solid rgba(200, 150, 100, 0.12);
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink);
  border-bottom-left-radius: 6px;
  box-shadow: 0 1px 4px rgba(139, 94, 60, 0.04);
}

.gb-body.user {
  background: linear-gradient(135deg, #FB7299, #E85D75);
  border-color: #FB7299;
  color: #FFFFFF;
  border-radius: var(--r-md);
  box-shadow: 0 2px 12px rgba(251, 114, 153, 0.2);
}

.gb-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.gb-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
}

.gb-footer.right {
  justify-content: flex-end;
}

.gb-speak {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: var(--ink-muted);
  transition: all 0.2s var(--ease-out);
}

.gb-speak:hover {
  color: #FB7299;
  background: rgba(251, 114, 153, 0.08);
}

.gb-speak.active {
  color: #FB7299;
  background: rgba(251, 114, 153, 0.12);
}

.gb-waves {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 10px;
}

.gb-waves span {
  width: 2px;
  background: currentColor;
  border-radius: 1px;
  animation: gb-wave 0.8s ease-in-out infinite;
  transform-origin: bottom;
}

.gb-waves span:nth-child(1) { height: 4px; animation-delay: -0.3s; }
.gb-waves span:nth-child(2) { height: 7px; animation-delay: -0.15s; }

@keyframes gb-wave {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}

.gb-images {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}

.gb-img {
  max-width: 200px;
  max-height: 200px;
  border-radius: var(--r-sm);
  border: 1px solid rgba(200, 150, 100, 0.15);
  object-fit: cover;
  cursor: zoom-in;
  transition: opacity 0.15s;
  box-shadow: 0 1px 4px rgba(139, 94, 60, 0.06);
}

.gb-img:hover {
  opacity: 0.85;
}

.gb-lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  animation: lb-fade 0.2s var(--ease-out);
}

.gb-lightbox-img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: var(--r-md);
  box-shadow: 0 8px 40px rgba(0,0,0,0.4);
}

@keyframes lb-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bubble-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 720px) {
  .glass-bubble { max-width: 92%; }
  .gb-body { padding: 10px 14px; font-size: 14px; }
}
@media (max-width: 480px) {
  .glass-bubble { max-width: 95%; }
  .gb-body { padding: 8px 12px; font-size: 13px; }
  .gb-meta { gap: 4px; }
  .gb-name { font-size: 11px; }
  .gb-time { font-size: 9px; }
}
</style>
