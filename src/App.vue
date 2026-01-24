<template>
  <div id="app" class="min-h-screen">
    <Navigation />
    <ThemeToggle />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
themeStore.initTheme()
themeStore.watchSystemTheme()
</script>