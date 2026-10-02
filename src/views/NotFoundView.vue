<template>
  <div class="pt-20">
    <section class="section-padding">
      <div class="container-max text-center max-w-xl mx-auto">
        <p class="text-sm font-semibold text-primary-600 mb-3">404</p>
        <h1 class="text-4xl md:text-5xl font-bold page-heading-secondary mb-4">Page not found</h1>
        <p class="text-lg page-description mb-10">
          The page you're looking for doesn't exist or has moved.
        </p>
        <router-link to="/" class="btn-primary">Back to home</router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo({ title: 'Page not found', path: '/404', noindex: true })
</script>
