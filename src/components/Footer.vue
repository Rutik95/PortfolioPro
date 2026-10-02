<template>
  <footer class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
    <div class="container-max section-padding">
      <div class="text-center">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          © {{ year }} {{ site.name }}. Built with Vue.js and Tailwind CSS.
        </p>
        <div class="flex justify-center space-x-6">
          <a
            v-for="social in socialLinks"
            :key="social.name"
            :href="social.url"
            :target="social.external ? '_blank' : undefined"
            :rel="social.external ? 'noopener noreferrer' : undefined"
            class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <span class="sr-only">{{ social.name }}</span>
            <BaseIcon :name="social.icon" class="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import BaseIcon, { type IconName } from '@/components/BaseIcon.vue'
import { site, isSet } from '@/config/site'

const year = new Date().getFullYear()

const socialLinks = ([
  { name: 'GitHub', url: site.github, icon: 'github', external: true },
  { name: 'LinkedIn', url: site.linkedin, icon: 'linkedin', external: true },
  { name: 'Email', url: `mailto:${site.email}`, icon: 'email', external: false },
] as { name: string; url: string; icon: IconName; external: boolean }[]).filter((l) => isSet(l.url))
</script>
