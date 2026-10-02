<template>
  <article class="doc">
    <header class="doc__head">
      <p class="doc__kicker">404</p>
      <h1 class="doc__title">Not on the flight plan.</h1>
      <p class="doc__lede">This page doesn't exist, or it has moved.</p>
      <p class="back"><router-link class="btn" to="/">Back to departure</router-link></p>
    </header>
  </article>
</template>

<script setup lang="ts">
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo({ title: 'Page not found', path: '/404', noindex: true })
</script>

<style scoped>
.back { margin-top: var(--sc-7); }
</style>
