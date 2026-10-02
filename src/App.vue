<template>
  <div class="relative isolate flex min-h-dvh flex-col">
    <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[56rem] bg-[radial-gradient(50%_50%_at_88%_0%,rgb(255_61_0/0.2),transparent_100%)]" aria-hidden="true" />
    <a href="#main" class="skip-link">Skip to content</a>
    <SiteHeader />
    <main id="main" class="flex-1">
      <router-view />
    </main>
    <SiteFooter />
    <WhatsAppFab />
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import WhatsAppFab from '@/components/WhatsAppFab.vue'
import interLatin from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url'
import interTightLatin from '@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2?url'

// Preload the Latin subsets of the body and display faces so text renders without a late font swap
useHead({
  htmlAttrs: { lang: 'en' },
  link: [interLatin, interTightLatin].map((href) => ({ rel: 'preload', href, as: 'font', type: 'font/woff2', crossorigin: '' }))
})
</script>
