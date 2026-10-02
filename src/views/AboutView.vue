<template>
  <div>
    <section class="container-site grid gap-12 pt-32 pb-16 md:pt-40 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-20">
      <div>
        <h1 class="rise text-[clamp(2.4rem,1.5rem+3.6vw,4.25rem)] leading-[1.03] font-[640] tracking-[-0.04em]">
          I'm {{ site.firstName }}, a full stack <span class="serif">developer.</span>
        </h1>
        <p class="rise rise-1 lede mt-6 md:text-xl">
          4 years building production web apps with Vue.js, Nuxt.js and Java.
          Based in Panvel, Navi Mumbai.
        </p>
      </div>
      <div v-if="isSet(site.photo)" class="bezel rise rise-2 max-w-sm">
        <img
          :src="site.photo"
          :alt="`Portrait of ${site.name}`"
          width="800"
          height="1000"
          class="aspect-[4/5] w-full rounded-[var(--radius-panel-inner)] object-cover"
        />
      </div>
      <div v-else-if="showPlaceholders" class="ph-block aspect-[4/5] max-w-sm rounded-[1.75rem]">
        [ADD_PHOTO]<br />Portrait, 4:5, at least 800x1000
      </div>
    </section>

    <!-- Experience -->
    <section class="section border-t border-line">
      <div class="container-site">
        <h2 class="h-section reveal">Experience</h2>
        <ol class="mt-14 grid gap-14">
          <li v-for="job in experience" :key="job.company" class="reveal grid gap-6 md:grid-cols-[16rem_1fr] md:gap-12">
            <div>
              <p class="font-semibold">{{ job.company }}</p>
              <p class="mt-1 text-sm text-muted tabular-nums">{{ job.period }}</p>
              <p class="text-sm text-muted">{{ job.location }}</p>
            </div>
            <div>
              <h3 class="text-2xl font-semibold tracking-tight">{{ job.role }}</h3>
              <p v-if="job.detail" class="mt-1 text-accent">{{ job.detail }}</p>
              <ul class="mt-5 grid gap-3 text-muted">
                <li v-for="point in job.points" :key="point" class="flex gap-3">
                  <PhCheck :size="18" weight="bold" class="mt-1 shrink-0 text-ink" />
                  <span>{{ point }}</span>
                </li>
              </ul>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Skills -->
    <section class="section bg-paper-2">
      <div class="container-site">
        <h2 class="h-section reveal">Skills</h2>
        <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div
            v-for="(group, i) in skills"
            :key="group.group"
            class="bezel reveal"
            :class="i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'"
          >
            <div class="bezel-core p-6 sm:p-7">
              <h3 class="font-semibold">{{ group.group }}</h3>
              <ul class="mt-4 flex flex-wrap gap-2">
                <li v-for="item in group.items" :key="item" class="chip">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section class="section">
      <div class="container-site grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <h2 class="h-section reveal">Education</h2>
        <ul class="grid gap-8">
          <li v-for="e in education" :key="e.title" class="reveal flex flex-col gap-1 border-t border-line pt-6 sm:flex-row sm:justify-between sm:gap-6">
            <div>
              <h3 class="text-lg font-semibold">{{ e.title }}</h3>
              <p class="text-muted">{{ e.place }}</p>
            </div>
            <p class="shrink-0 text-muted tabular-nums">{{ e.year }}, {{ e.note }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="pb-20 md:pb-28">
      <div class="container-site">
        <div class="bezel reveal">
          <div class="bezel-core flex flex-col gap-8 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
            <h2 class="max-w-md text-3xl font-semibold tracking-tight">Have a website project in mind?</h2>
            <CtaButtons />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { PhCheck } from '@phosphor-icons/vue'
import CtaButtons from '@/components/CtaButtons.vue'
import { usePageSeo } from '@/composables/usePageSeo'
import { site, isSet, showPlaceholders } from '@/config/site'
import { experience, skills, education } from '@/content/experience'

usePageSeo({
  title: 'About',
  description: 'Rutik Tarerkar is a Full Stack Developer with 4 years of experience in Vue.js, Nuxt.js and Java, currently working on the Thomas Cook / SOTC travel booking platform.',
  path: '/about'
})
</script>
