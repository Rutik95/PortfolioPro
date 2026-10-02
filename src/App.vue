<template>
  <a href="#main" class="skip-link">Skip to content</a>
  <Navigation />
  <main id="main">
    <router-view />
  </main>
  <Footer v-if="route.name !== 'home'" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'
import geistLatin from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'
import archivoLatin from '@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2?url'

const route = useRoute()

// Preload the Latin subsets so text renders in its real faces without a late swap
useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'preload', href: geistLatin, as: 'font', type: 'font/woff2', crossorigin: '' },
    { rel: 'preload', href: archivoLatin, as: 'font', type: 'font/woff2', crossorigin: '' },
  ],
})
</script>
