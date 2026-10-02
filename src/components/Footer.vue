<template>
  <footer class="foot">
    <div class="foot__inner">
      <p class="foot__line">{{ site.name }}, {{ site.role.toLowerCase() }}. {{ site.location }}.</p>
      <ul class="foot__links">
        <li><a :href="`mailto:${site.email}`">Email</a></li>
        <li><a :href="site.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        <li v-if="isSet(site.github)"><a :href="site.github" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        <li><a :href="site.resume" download>CV</a></li>
      </ul>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { site, isSet } from '@/config/site'
</script>

<style scoped>
.foot { border-top: 1px solid var(--sc-hairline); }
.foot__inner {
  display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: var(--sc-4) var(--sc-6);
  padding: var(--sc-7) var(--sc-gutter) var(--sc-8);
  max-width: var(--sc-maxw); margin-inline: auto;
}
.foot__line { margin: 0; font-size: var(--sc-t-sm); color: var(--sc-ink-soft); }
.foot__links { display: flex; gap: var(--sc-6); list-style: none; margin: 0; padding: 0; }
.foot__links a { font-size: var(--sc-t-sm); color: var(--sc-ink); text-decoration: none; }
@media (hover: hover) and (pointer: fine) {
  .foot__links a:hover { text-decoration: underline; }
}
</style>
