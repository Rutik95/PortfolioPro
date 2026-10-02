<template>
  <div class="min-h-screen transition-colors duration-300">
    <a href="#main" class="skip-link">Skip to content</a>
    <Navigation />
    <ThemeToggle />
    <AnimationToggle />
    <ParticleToggle />
    <ParticleBackground />
    <main id="main">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import AnimationToggle from '@/components/AnimationToggle.vue'
import ParticleBackground from '@/components/ParticleBackground.vue'
import ParticleToggle from '@/components/ParticleToggle.vue'
import { useHead } from '@unhead/vue'
import geistLatin from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'

// Preload the Latin subset so text renders in Geist without a late font swap
useHead({
  link: [{ rel: 'preload', href: geistLatin, as: 'font', type: 'font/woff2', crossorigin: '' }]
})
</script>
