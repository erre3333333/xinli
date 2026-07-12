import { ref, watch } from 'vue'

const STORAGE_KEY = 'mind-garden-theme'

const themes = [
  { id: 'spring', label: '春生', icon: '🌿' },
  { id: 'autumn', label: '秋暖', icon: '🍂' },
  { id: 'moon', label: '月夜', icon: '🌙' },
]

const currentTheme = ref(localStorage.getItem(STORAGE_KEY) || 'spring')

function applyTheme(id) {
  document.documentElement.setAttribute('data-theme', id)
  localStorage.setItem(STORAGE_KEY, id)
}

applyTheme(currentTheme.value)

watch(currentTheme, (id) => {
  applyTheme(id)
})

export function useTheme() {
  function setTheme(id) {
    currentTheme.value = id
  }

  return {
    themes,
    currentTheme,
    setTheme,
  }
}
