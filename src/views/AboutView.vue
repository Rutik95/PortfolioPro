<template>
  <article class="doc">
    <header class="doc__head">
      <p class="doc__kicker">Flight log</p>
      <h1 class="doc__title">Experience</h1>
      <p class="doc__lede">{{ summary }}</p>
    </header>

    <section class="doc__section" aria-labelledby="h-roles">
      <h2 id="h-roles" class="doc__h2">Roles</h2>
      <div v-for="r in roles" :key="r.id" class="row">
        <p class="row__meta">
          <strong>{{ r.start }} to {{ r.end }}</strong>
          {{ r.place }}
        </p>
        <div class="row__body">
          <h3 class="row__title">{{ r.title }}, {{ r.company }}</h3>
          <p v-if="r.detail" class="row__sub">{{ r.detail }}</p>
          <ul class="row__list">
            <li v-for="p in r.points" :key="p">{{ p }}</li>
          </ul>
          <p class="row__stack">{{ r.stack.join(' · ') }}</p>
        </div>
      </div>
    </section>

    <section class="doc__section" aria-labelledby="h-skills">
      <h2 id="h-skills" class="doc__h2">Skills</h2>
      <div v-for="g in skillGroups" :key="g.title" class="row row--tight">
        <p class="row__meta"><strong>{{ g.title }}</strong></p>
        <p class="row__text">{{ g.items.join(', ') }}</p>
      </div>
    </section>

    <section class="doc__section" aria-labelledby="h-edu">
      <h2 id="h-edu" class="doc__h2">Education</h2>
      <div v-for="e in education" :key="e.title" class="row row--tight">
        <p class="row__meta"><strong>{{ e.date }}</strong></p>
        <p class="row__text">{{ e.title }}<span class="muted">, {{ e.note }}</span></p>
      </div>
    </section>

    <p class="doc__close">
      <a class="link" :href="site.resume" download>Download the CV</a> as a PDF,
      or <router-link class="link" to="/contact">get in touch</router-link>.
    </p>
  </article>
</template>

<script setup lang="ts">
import { usePageSeo } from '@/composables/usePageSeo'
import { site } from '@/config/site'
import { education, roles, skillGroups, summary } from '@/data/profile'

usePageSeo({
  title: 'Experience',
  description: `${site.name}: frontend engineer since 2022. Software Developer on the Thomas Cook travel platform, owning the Flights frontend; previously Web Developer at Swegon BlueBox.`,
  path: '/about',
})
</script>

<style scoped>
.row--tight { padding: var(--sc-4) 0; }
.row--tight .row__text { margin: 0; }
.muted { color: var(--sc-ink-soft); }
.doc__close { margin: clamp(3rem, 7vw, 6rem) 0 0; max-width: 60ch; color: var(--sc-ink-soft); }
</style>
