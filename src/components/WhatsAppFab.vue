<template>
  <!-- Floating WhatsApp shortcut. Appears once the visitor scrolls past the first screen. -->
  <a
    v-if="whatsapp"
    :href="whatsapp"
    target="_blank"
    rel="noopener"
    aria-label="Chat on WhatsApp"
    class="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 grid h-14 w-14 place-items-center rounded-full bg-[#1f8f4e] text-white shadow-[0_12px_30px_-8px_rgb(20_80_45/0.55)] transition-all duration-500 ease-spring hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6"
    :class="visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'"
  >
    <PhWhatsappLogo :size="28" weight="regular" />
  </a>
  <div ref="sentinel" class="pointer-events-none absolute top-0 left-0 h-[90vh] w-px" aria-hidden="true" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { PhWhatsappLogo } from '@phosphor-icons/vue'
import { whatsappHref } from '@/config/site'

const whatsapp = whatsappHref()
const visible = ref(false)
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (!sentinel.value) return
  // The sentinel covers the first screen; once it leaves the viewport, show the button
  observer = new IntersectionObserver(([entry]) => {
    visible.value = !entry?.isIntersecting
  })
  observer.observe(sentinel.value)
})

onUnmounted(() => observer?.disconnect())
</script>
