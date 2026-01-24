import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    console.log('[theme] toggleTheme -> isDark:', isDark.value)
    applyTheme()
  }

  const applyTheme = () => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    if (isDark.value) {
      root.classList.add('dark')
      console.log('[theme] applyTheme: added dark class')
    } else {
      root.classList.add('light')
      console.log('[theme] applyTheme: added light class')
    }
    console.log('[theme] html class:', root.className)
    const heroSubtitle = document.querySelector('.hero-subtitle')
    const heroDescription = document.querySelector('.hero-description')
    if (heroSubtitle) {
      const color = getComputedStyle(heroSubtitle).color
      console.log('[theme] hero-subtitle color:', color)
    } else {
      console.log('[theme] hero-subtitle not found')
    }
    if (heroDescription) {
      const color = getComputedStyle(heroDescription).color
      console.log('[theme] hero-description color:', color)
    } else {
      console.log('[theme] hero-description not found')
    }
  }

  return {
    isDark,
    toggleTheme,
    applyTheme
  }
})
