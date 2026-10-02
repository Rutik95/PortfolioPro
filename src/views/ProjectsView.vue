<template>
  <article class="doc">
    <header class="doc__head">
      <p class="doc__kicker">Destinations</p>
      <h1 class="doc__title">Projects</h1>
      <p class="doc__lede">
        One platform in production, one product in development, one machine learning project.
        Each one is a place the flight passes over on the <router-link class="link" to="/">home page</router-link>.
      </p>
    </header>

    <section
      v-for="d in destinations"
      :id="d.id"
      :key="d.id"
      class="project"
      :aria-labelledby="`p-${d.id}`"
    >
      <figure class="project__frame">
        <img :src="`/flight/posters/${d.id}.webp`" :alt="frameAlt[d.id]" width="1600" height="900" loading="lazy" decoding="async" />
      </figure>
      <div class="project__body">
        <h2 :id="`p-${d.id}`" class="project__name">{{ d.name }}</h2>
        <p class="project__kind">{{ d.kind }}</p>
        <dl class="project__facts">
          <div><dt>What it is</dt><dd>{{ d.what }}</dd></div>
          <div><dt>My part</dt><dd>{{ d.part }}</dd></div>
          <div><dt>Built with</dt><dd>{{ d.stack.join(', ') }}</dd></div>
        </dl>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { usePageSeo } from '@/composables/usePageSeo'
import { destinations } from '@/data/profile'

usePageSeo({
  title: 'Projects',
  description: 'The Flights frontend of the Thomas Cook travel platform, a live cricket scoreboard and overlay system, and a helmet and number plate detection model.',
  path: '/projects',
})

const frameAlt: Record<string, string> = {
  flights: 'An airport at night seen from above through a gap in the clouds, runways outlined in light.',
  scoreboard: 'A floodlit cricket ground at night seen from above through a gap in the clouds.',
  detection: 'A highway at night seen from above, streams of headlights and tail lights along it.',
}
</script>

<style scoped>
.project {
  display: grid; grid-template-columns: 1.15fr 1fr; gap: var(--sc-7);
  align-items: center;
  padding: clamp(2.5rem, 6vw, 5rem) 0;
  border-top: 1px solid var(--sc-hairline);
}
.project:nth-of-type(even) .project__frame { order: 2; }
.project__frame {
  margin: 0; overflow: hidden; border-radius: var(--sc-r-md);
  background: var(--sc-surface);
  box-shadow: var(--sc-e2), var(--sc-edge);
  aspect-ratio: 16 / 10;
}
.project__frame img { width: 100%; height: 100%; object-fit: cover; }
.project__name {
  margin: 0;
  font-family: var(--sc-font-display); font-weight: 500; font-stretch: 110%;
  font-size: var(--sc-t-2xl); line-height: 1; letter-spacing: -0.03em; text-wrap: balance;
}
.project__kind { margin: var(--sc-3) 0 0; color: var(--sc-accent); font-size: var(--sc-t-sm); }
.project__facts { margin: var(--sc-6) 0 0; display: grid; gap: var(--sc-4); }
.project__facts > div { display: grid; grid-template-columns: 7.5rem 1fr; gap: var(--sc-4); }
.project__facts dt { font-size: var(--sc-t-xs); letter-spacing: 0.14em; text-transform: uppercase; color: var(--sc-ink-soft); padding-top: 0.25em; }
.project__facts dd { margin: 0; text-wrap: pretty; }

@media (max-width: 860px) {
  .project { grid-template-columns: 1fr; gap: var(--sc-5); }
  .project:nth-of-type(even) .project__frame { order: 0; }
  .project__facts > div { grid-template-columns: 1fr; gap: var(--sc-1); }
}
</style>
