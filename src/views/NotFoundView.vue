<template>
  <section class="container-site pt-36 pb-28 md:pt-48">
    <p class="text-sm font-semibold text-accent">404</p>
    <h1 class="mt-3 text-[clamp(2.4rem,1.5rem+3.6vw,4.25rem)] leading-[1.03] font-[640] tracking-[-0.04em]">
      This page doesn't <span class="serif">exist.</span>
    </h1>
    <p class="lede mt-6">It may have moved, or the link might have a typo.</p>
    <router-link to="/" class="btn btn-primary mt-10">
      Back to home
      <span class="btn-icon"><PhArrowRight :size="18" weight="bold" /></span>
    </router-link>
  </section>
</template>

<script setup lang="ts">
import { PhArrowRight } from '@phosphor-icons/vue'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo({ title: 'Page not found', path: '/404', noindex: true })
</script>
