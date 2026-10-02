<template>
  <header class="bar" :class="{ 'bar--over': overWorld, 'is-open': open }">
    <div class="bar__inner">
      <router-link to="/" class="bar__mark" @click="open = false">
        <span>{{ site.name }}</span>
      </router-link>
      <button
        type="button"
        class="bar__toggle"
        :aria-expanded="open"
        aria-controls="site-menu"
        @click="open = !open"
      >
        {{ open ? 'Close' : 'Menu' }}
      </button>
      <nav id="site-menu" class="bar__nav" aria-label="Site">
        <router-link v-for="item in items" :key="item.to" :to="item.to" class="bar__link" @click="open = false">{{ item.label }}</router-link>
        <a class="bar__link" :href="site.resume" download>CV</a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'

const route = useRoute()
const open = ref(false)
const overWorld = computed(() => route.name === 'home')
watch(() => route.fullPath, () => { open.value = false })

const items = [
  { label: 'Experience', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
]
</script>

<style scoped>
.bar {
  position: sticky; top: 0; z-index: var(--sc-z-chrome);
  background: color-mix(in oklab, var(--sc-canvas) 88%, transparent);
  border-bottom: 1px solid var(--sc-hairline);
  backdrop-filter: blur(10px);
}
.bar--over {
  position: fixed; left: 0; right: 0;
  background: linear-gradient(to bottom, color-mix(in oklab, var(--sc-canvas) 62%, transparent), transparent);
  border-bottom-color: transparent;
  backdrop-filter: none;
}
.bar__inner {
  display: flex; align-items: center; justify-content: space-between; gap: var(--sc-5);
  height: 4rem; padding-inline: var(--sc-gutter);
}
.bar__mark {
  font-family: var(--sc-font-display);
  font-stretch: 112%;
  font-weight: 600;
  font-size: 0.92rem;
  letter-spacing: 0.04em;
  text-decoration: none;
  color: var(--sc-ink);
}
.bar__nav { display: flex; align-items: center; gap: var(--sc-6); }
.bar__link {
  position: relative;
  font-size: var(--sc-t-sm);
  color: color-mix(in oklab, var(--sc-ink) 72%, transparent);
  text-decoration: none;
  padding-block: 0.5rem;
  transition: color 160ms var(--sc-ease-out);
}
.bar__link.router-link-exact-active { color: var(--sc-ink); }
.bar__link.router-link-exact-active::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 0.2rem; height: 1px; background: var(--sc-accent);
}
@media (hover: hover) and (pointer: fine) {
  .bar__link:hover { color: var(--sc-ink); }
}
.bar__toggle {
  display: none;
  background: none; border: 1px solid var(--sc-hairline-strong); border-radius: var(--sc-r-pill);
  padding: 0.45rem 0.95rem; font-size: var(--sc-t-sm); cursor: pointer; color: var(--sc-ink);
}
.bar__toggle:active { transform: scale(0.97); }

@media (max-width: 720px) {
  .bar__toggle { display: inline-block; }
  .bar__nav {
    display: none;
    position: absolute; top: 100%; left: 0; right: 0;
    flex-direction: column; align-items: stretch; gap: 0;
    padding: var(--sc-2) var(--sc-gutter) var(--sc-5);
    background: color-mix(in oklab, var(--sc-canvas) 96%, transparent);
    border-bottom: 1px solid var(--sc-hairline);
  }
  .is-open .bar__nav { display: flex; }
  .bar__link { padding-block: 0.85rem; font-size: var(--sc-t-base); border-bottom: 1px solid var(--sc-hairline); }
  .bar__link.router-link-exact-active::after { display: none; }
}
</style>
