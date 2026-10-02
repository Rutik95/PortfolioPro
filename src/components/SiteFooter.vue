<template>
  <footer class="border-t border-line">
    <div class="container-site grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
      <div>
        <router-link to="/" class="inline-flex items-center gap-2.5 font-semibold tracking-tight">
          <LogoMark class="h-8 w-8" />
          {{ site.name }}
        </router-link>
        <p class="mt-4 max-w-xs text-muted">
          Fast, modern websites for small businesses and startups.
        </p>
      </div>

      <nav aria-label="Footer">
        <h2 class="text-sm font-semibold">Pages</h2>
        <ul class="mt-4 space-y-2.5 text-muted">
          <li><router-link to="/#services" class="link hover:text-ink">Services</router-link></li>
          <li><router-link to="/projects" class="link hover:text-ink">Work</router-link></li>
          <li><router-link to="/about" class="link hover:text-ink">About</router-link></li>
          <li><router-link to="/contact" class="link hover:text-ink">Contact</router-link></li>
        </ul>
      </nav>

      <div>
        <h2 class="text-sm font-semibold">Contact</h2>
        <ul class="mt-4 space-y-2.5 text-muted">
          <li><a :href="`mailto:${site.email}`" class="link break-all hover:text-ink">{{ site.email }}</a></li>
          <li v-if="whatsapp"><a :href="whatsapp" target="_blank" rel="noopener" class="link hover:text-ink">WhatsApp</a></li>
          <li><a :href="site.linkedin" target="_blank" rel="noopener" class="link hover:text-ink">LinkedIn</a></li>
          <li v-if="isSet(site.github)"><a :href="site.github" target="_blank" rel="noopener" class="link hover:text-ink">GitHub</a></li>
          <li v-else><Placeholder text="[GITHUB_URL]" /></li>
        </ul>
      </div>
    </div>

    <div class="container-site flex flex-col gap-2 border-t border-line py-6 text-sm text-muted sm:flex-row sm:justify-between">
      <p>© {{ year }} {{ site.name }}</p>
      <p>{{ site.location }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import LogoMark from '@/components/LogoMark.vue'
import Placeholder from '@/components/Placeholder.vue'
import { site, isSet, whatsappHref } from '@/config/site'

const year = new Date().getFullYear()
const whatsapp = whatsappHref()
</script>
