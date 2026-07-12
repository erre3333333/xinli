import { ref, computed, onUnmounted } from 'vue'

const voices = ref([])
const isSpeaking = ref(false)
const hasSupport = ref(false)
let currentUtterance = null
let cancelled = false

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  hasSupport.value = true

  const refresh = () => {
    voices.value = window.speechSynthesis.getVoices() || []
  }
  refresh()
  if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = refresh
  }
  setTimeout(refresh, 200)
  setTimeout(refresh, 800)
}

const CHINESE_HINTS = /chinese|mandarin|cantonese|xiaoxiao|yunjian|yunxi|yunyang|yaoyao|xiaoyou|tingting|sin-ji|meijia|hsiao|han/i

const qualityRank = (v) => {
  const n = (v.name || '').toLowerCase()
  const l = (v.lang || '').toLowerCase()
  let score = 0
  if (l === 'zh-cn' || l === 'zh_cn') score += 100
  else if (l.startsWith('zh')) score += 60
  if (/xiaoxiao|meijia|xiaoyou/.test(n)) score += 20
  if (/yunjian|yunxi|yunyang/.test(n)) score += 18
  if (/tingting|sin-ji|han|hsiao/.test(n)) score += 10
  if (v.localService) score += 5
  if (v.default) score += 1
  return score
}

const pickChineseVoice = () => {
  if (!voices.value.length) return null
  const matched = voices.value
    .filter((v) => {
      const l = (v.lang || '').toLowerCase()
      return l === 'zh-cn' || l === 'zh_cn' || l.startsWith('zh') || CHINESE_HINTS.test(v.name || '')
    })
    .sort((a, b) => qualityRank(b) - qualityRank(a))
  return matched[0] || null
}

const cleanText = (raw) => {
  if (!raw) return ''
  return String(raw)
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, '。')
    .replace(/[•·●]/g, '。')
    .replace(/\s+/g, ' ')
    .replace(/([。！？!?])\1+/g, '$1')
    .trim()
}

function speak(text, opts = {}) {
  if (!hasSupport.value) return Promise.resolve(false)
  const cleaned = cleanText(text)
  if (!cleaned) return Promise.resolve(false)

  stop()
  cancelled = false

  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(cleaned)
    const voice = opts.voice || pickChineseVoice()
    if (voice) {
      u.voice = voice
      u.lang = voice.lang || 'zh-CN'
    } else {
      u.lang = 'zh-CN'
    }
    u.rate = opts.rate ?? 0.95
    u.pitch = opts.pitch ?? 1.0
    u.volume = opts.volume ?? 1.0

    const finish = (ok) => {
      isSpeaking.value = false
      currentUtterance = null
      resolve(ok)
    }

    u.onend = () => finish(true)
    u.onerror = (e) => {
      if (e && e.error === 'canceled') finish(false)
      else finish(false)
    }

    currentUtterance = u
    isSpeaking.value = true

    try {
      window.speechSynthesis.speak(u)
    } catch {
      finish(false)
    }
  })
}

function stop() {
  if (!hasSupport.value) return
  try {
    window.speechSynthesis.cancel()
  } catch {}
  isSpeaking.value = false
  currentUtterance = null
}

const hasChineseVoice = computed(() => {
  return voices.value.some((v) => {
    const l = (v.lang || '').toLowerCase()
    return l === 'zh-cn' || l === 'zh_cn' || l.startsWith('zh') || CHINESE_HINTS.test(v.name || '')
  })
})

export function useSpeech() {
  onUnmounted(() => stop())
  return {
    hasSupport,
    hasChineseVoice,
    isSpeaking,
    voices,
    speak,
    stop,
  }
}
