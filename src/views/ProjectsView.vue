<template>
  <div>
    <section class="container-site pt-32 pb-12 md:pt-40">
      <h1 class="rise max-w-[18ch] text-[clamp(2.4rem,1.5rem+3.6vw,4.25rem)] leading-[1.03] font-[640] tracking-[-0.04em]">
        Selected <span class="serif">work</span>
      </h1>
      <p class="rise rise-1 lede mt-6 md:text-xl">
        Projects from my job and my own work. Each one shows a different part of what I can build for you.
      </p>
    </section>

    <section class="container-site grid gap-6 pb-20 md:pb-28">
      <article
        v-for="(project, i) in projects"
        :id="project.id"
        :key="project.id"
        class="bezel reveal"
        :class="{ 'bezel-dark': i === 0 }"
      >
        <div class="bezel-core grid gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:p-12">
          <div class="flex flex-col">
            <p class="text-sm" :class="i === 0 ? 'text-ink-muted' : 'text-muted'">{{ project.context }}</p>
            <h2 class="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{{ project.title }}</h2>
            <p class="mt-4" :class="i === 0 ? 'text-ink-muted' : 'text-muted'">{{ project.summary }}</p>

            <ul class="mt-8 flex flex-wrap gap-2" aria-label="Technologies">
              <li
                v-for="t in project.stack"
                :key="t"
                :class="i === 0 ? 'rounded-lg bg-white/8 px-2.5 py-1 text-[0.8125rem] text-white/75' : 'chip'"
              >
                {{ t }}
              </li>
            </ul>

            <div class="mt-8">
              <a
                v-if="isSet(project.link)"
                :href="project.link"
                target="_blank"
                rel="noopener"
                class="link inline-flex items-center gap-2 font-medium"
              >
                View project <PhArrowUpRight :size="18" />
              </a>
              <Placeholder v-else-if="project.link" :text="project.link" />
            </div>
          </div>

          <div>
            <img
              v-if="isSet(project.image)"
              :src="project.image"
              :alt="`Screenshot of ${project.title}`"
              width="1600"
              height="1000"
              loading="lazy"
              class="mb-8 aspect-[16/10] w-full rounded-2xl object-cover"
            />
            <div v-else-if="project.image && showPlaceholders" class="ph-block mb-8 aspect-[16/10] rounded-2xl">
              {{ project.image }}<br />16:10, at least 1600x1000
            </div>

            <h3 class="font-semibold">What I did</h3>
            <ul class="mt-4 grid gap-3.5">
              <li v-for="h in project.highlights" :key="h" class="flex gap-3">
                <PhCheck :size="20" weight="bold" class="mt-0.5 shrink-0" :class="i === 0 ? 'text-accent-light' : 'text-accent'" />
                <span :class="i === 0 ? 'text-white/90' : ''">{{ h }}</span>
              </li>
            </ul>
          </div>
        </div>
      </article>

      <div v-if="showPlaceholders" class="ph-block rounded-[1.75rem] py-16">
        [ADD CLIENT PROJECT]<br />Add your first client project to src/content/projects.ts
      </div>
    </section>

    <section class="pb-20 md:pb-28">
      <div class="container-site">
        <div class="bezel reveal">
          <div class="bezel-core flex flex-col gap-8 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
            <h2 class="max-w-md text-3xl font-semibold tracking-tight">Want something like this for your business?</h2>
            <CtaButtons />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { PhCheck, PhArrowUpRight } from '@phosphor-icons/vue'
import CtaButtons from '@/components/CtaButtons.vue'
import Placeholder from '@/components/Placeholder.vue'
import { usePageSeo } from '@/composables/usePageSeo'
import { isSet, showPlaceholders } from '@/config/site'
import { projects } from '@/content/projects'

usePageSeo({
  title: 'Work',
  description: 'Selected work by Rutik Tarerkar: flight search and booking on the Thomas Cook / SOTC platform, a live cricket scoreboard system and a machine-learning helmet detection project.',
  path: '/projects'
})
</script>
