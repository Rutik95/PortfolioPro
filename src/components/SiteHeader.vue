<template>
  <!-- Transparent bar over the page: logo left, links in a glass capsule centre, CTA right -->
  <header class="absolute inset-x-0 top-0 z-40">
    <div class="flex items-center justify-between gap-4 px-[clamp(1.125rem,2.6vw,2.75rem)] py-[clamp(0.875rem,1.7vw,1.375rem)]">
      <router-link to="/" class="inline-flex items-center gap-2.5 font-display text-[clamp(1.0625rem,1.4vw,1.25rem)] font-semibold tracking-[-0.025em]" @click="close">
        <LogoMark class="h-[1.4em] w-[1.4em]" />
        <span>{{ site.name }}</span>
      </router-link>

      <nav
        class="hidden rounded-xl border border-ink-line bg-[rgb(28_10_2/0.34)] p-[5px] backdrop-blur-[14px] lg:block"
        aria-label="Main"
      >
        <ul class="flex items-center gap-[3px]">
          <li v-for="item in navItems" :key="item.to">
            <router-link
              :to="item.to"
              class="inline-flex items-center rounded-lg bg-white/5 px-3.5 py-2 text-[0.84rem] font-[450] text-white/80 transition-colors duration-300 ease-spring hover:bg-white/14 hover:text-white"
              :active-class="item.to.includes('#') ? '' : '!bg-white/14 !text-white'"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-2.5">
        <a
          :href="booking"
          class="btn btn-light hidden text-[0.84rem] sm:inline-flex"
          :target="externalBooking ? '_blank' : undefined"
          :rel="externalBooking ? 'noopener' : undefined"
        >
          Book a call
        </a>

        <button
          type="button"
          class="relative grid h-10 w-10 place-items-center rounded-[10px] border border-ink-line bg-[rgb(28_10_2/0.4)] backdrop-blur-[10px] lg:hidden"
          :aria-expanded="open"
          aria-controls="mobile-menu"
          :aria-label="open ? 'Close menu' : 'Open menu'"
          @click="open = !open"
        >
          <span class="absolute h-[1.5px] w-[18px] rounded bg-current transition-transform duration-500 ease-spring" :class="open ? 'rotate-45' : '-translate-y-[4px]'" />
          <span class="absolute h-[1.5px] w-[18px] rounded bg-current transition-transform duration-500 ease-spring" :class="open ? '-rotate-45' : 'translate-y-[4px]'" />
        </button>
      </div>
    </div>

    <!-- Mobile sheet -->
    <div
      id="mobile-menu"
      class="fixed inset-x-3 top-[4.5rem] rounded-[18px] border border-ink-line bg-[rgb(18_5_0/0.95)] p-[18px] shadow-[0_30px_80px_rgb(0_0_0/0.6)] backdrop-blur-[20px] transition-all duration-500 ease-spring lg:hidden"
      :class="open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'"
      :inert="!open"
    >
      <ul class="mb-4 grid gap-0.5">
        <li v-for="item in [{ label: 'Home', to: '/' }, ...navItems]" :key="item.to">
          <router-link :to="item.to" class="block rounded-[10px] px-2.5 py-3 text-base text-white/85 hover:bg-white/7" @click="close">
            {{ item.label }}
          </router-link>
        </li>
      </ul>
      <div @click="close">
        <CtaButtons stacked />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import LogoMark from '@/components/LogoMark.vue'
import CtaButtons from '@/components/CtaButtons.vue'
import { site, isSet, bookingHref } from '@/config/site'

const navItems = [
  { label: 'Services', to: '/#services' },
  { label: 'How it works', to: '/#process' },
  { label: 'Work', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const booking = bookingHref()
const externalBooking = isSet(site.bookingUrl)

const open = ref(false)
const close = () => (open.value = false)

const route = useRoute()
watch(() => route.fullPath, close)

watch(open, (isOpen) => {
  document.documentElement.style.overflow = isOpen ? 'hidden' : ''
})

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>
