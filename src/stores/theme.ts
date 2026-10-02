import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  const applyTheme = () => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    if (isDark.value) {
      root.classList.add('dark')
    } else {
      root.classList.add('light')
    }
  }

  return {
    isDark,
    toggleTheme,
    applyTheme
  }
})
