<template>
  <div>
    <!-- Hero -->
    <section id="hero" class="hero px-[clamp(1.125rem,2.6vw,2.75rem)]">
      <div class="hero-ember" aria-hidden="true">
        <video
          v-if="isSet(site.heroVideo)"
          ref="video"
          class="hero-ember__video"
          :src="site.heroVideo"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
        />
        <template v-else>
          <div class="hero-ember__glow" />
          <div class="hero-ember__rim" />
        </template>
        <div class="hero-ember__scrim" />
        <div class="hero-ember__rules"><span /><span /><span /></div>
      </div>

      <div class="grid flex-1 content-center gap-10 min-[1120px]:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)] min-[1120px]:items-start">
        <div class="max-w-[40rem]">
          <p class="rise flex w-fit max-w-[19rem] items-center gap-2.5 border-t border-white/8 pt-3 text-[0.75rem] leading-snug text-white/50">
            <PhGlobeHemisphereEast :size="20" weight="light" class="shrink-0" />
            <span>Freelance web developer for small<br />businesses and startups</span>
          </p>

          <h1 class="hero-title rise rise-1 mt-5">
            Websites that<br />
            bring your<br />
            business more<br />
            <span class="serif">customers.</span>
          </h1>

          <p class="rise rise-2 mt-5 max-w-[26rem] text-[0.9375rem] leading-relaxed text-white/72">
            Fast, beautiful websites for small businesses and startups, from a developer who builds flight search for Thomas Cook&nbsp;/&nbsp;SOTC.
          </p>

          <div class="rise rise-3 mt-7">
            <CtaButtons />
          </div>

          <ul class="rise rise-4 mt-7 flex flex-wrap gap-3.5">
            <li v-for="stat in heroStats" :key="stat.label" class="stat-card">
              <span class="absolute top-3.5 right-4 text-white/45" aria-hidden="true">*</span>
              <span class="font-display text-[clamp(1.7rem,2.4vw,2.3rem)] leading-none font-medium tracking-[-0.03em]">{{ stat.value }}</span>
              <span class="max-w-[9rem] text-[0.75rem] leading-snug text-white/55">{{ stat.label }}</span>
              <span class="absolute right-4 bottom-[1.375rem] h-px w-3.5 bg-white/28" aria-hidden="true" />
            </li>
          </ul>
        </div>

        <!-- Low-opacity side note on wide screens. The numbers are measured on this site, not invented. -->
        <aside class="mt-10 hidden max-w-[20.5rem] self-start justify-self-end text-white/30 min-[1120px]:block" aria-hidden="true">
          <p class="flex items-end gap-4">
            <strong class="font-display text-[3.25rem] leading-none font-semibold tracking-[-0.04em] text-white/55">0.00</strong>
            <span class="pb-1 text-[0.72rem] leading-snug">Layout shift (CLS)<br />on every page of this site</span>
          </p>
          <p class="mt-7 font-display text-[1.375rem] font-medium tracking-[-0.02em] text-white/45">Measured, not promised</p>
          <p class="mt-2 text-[0.8rem] leading-relaxed">
            Pre-rendered pages, self-hosted fonts and proper SEO tags. Your website gets the same treatment.
          </p>
        </aside>
      </div>

      <div class="rise rise-5 mt-5 flex flex-col items-start justify-between gap-6 min-[860px]:flex-row min-[860px]:items-end">
        <span class="hidden font-display text-[clamp(3.4rem,7vw,5.5rem)] leading-[0.8] font-bold tracking-[-0.05em] text-white/[0.055] select-none sm:block" aria-hidden="true">
          Rutik
        </span>
        <div class="min-[860px]:text-right">
          <span class="mb-3.5 block text-[0.75rem] text-white/50">Built with</span>
          <ul class="flex flex-wrap items-center gap-x-[clamp(1rem,2.2vw,2rem)] gap-y-3">
            <li v-for="tech in techStack" :key="tech.title" class="inline-flex items-center gap-2 text-[0.9375rem] font-[450] tracking-[-0.01em] text-white/85">
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true"><path :d="tech.path" /></svg>
              {{ tech.title }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Credibility -->
    <section class="section border-t border-line">
      <div class="container-site grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <h2 class="reveal text-[clamp(1.75rem,1.25rem+1.9vw,2.6rem)] leading-[1.15] font-[560] tracking-[-0.03em] text-muted">
          <span class="text-ink">4 years building production web apps.</span>
          Right now I work on the Thomas Cook&nbsp;/&nbsp;SOTC travel booking platform, where a slow or broken page costs real bookings.
        </h2>
        <dl class="reveal grid content-start gap-8">
          <div v-for="point in proofPoints" :key="point.title" class="grid grid-cols-[2.75rem_1fr] gap-4">
            <span class="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent">
              <component :is="point.icon" :size="22" />
            </span>
            <div>
              <dt class="font-semibold">{{ point.title }}</dt>
              <dd class="mt-1 text-muted">{{ point.text }}</dd>
            </div>
          </div>
        </dl>
      </div>
    </section>

    <!-- Services -->
    <section id="services" class="section">
      <div class="container-site">
        <h2 class="h-section reveal max-w-[18ch]">What I can build for you</h2>
        <p class="lede reveal mt-5">
          A fixed quote before any work begins, and a website you own completely.
        </p>

        <div class="mt-14 grid gap-4">
          <article v-for="service in services" :key="service.id" class="bezel reveal">
            <div class="bezel-core grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.15fr_auto] lg:gap-12 lg:p-10">
              <div>
                <h3 class="text-2xl font-semibold tracking-tight">{{ service.name }}</h3>
                <p class="mt-3 text-muted">{{ service.summary }}</p>
              </div>
              <ul class="grid content-start gap-3">
                <li v-for="item in service.includes" :key="item" class="flex gap-3">
                  <PhCheck :size="20" weight="bold" class="mt-0.5 shrink-0 text-accent" />
                  <span>{{ item }}</span>
                </li>
              </ul>
              <div class="border-t border-line pt-6 lg:min-w-[11rem] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
                <template v-if="isSet(service.price)">
                  <p class="text-sm text-muted">Starting at</p>
                  <p class="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{{ service.price }}</p>
                </template>
                <template v-else-if="showPlaceholders">
                  <p class="text-sm text-muted">Starting at</p>
                  <p class="mt-2"><Placeholder :text="service.price" /></p>
                </template>
                <p v-else class="text-lg font-semibold tracking-tight">Quote after a short call</p>

                <p v-if="isSet(service.timeline)" class="mt-2 text-sm text-muted">{{ service.timeline }}</p>
                <p v-else-if="showPlaceholders" class="mt-2"><Placeholder :text="service.timeline" /></p>
              </div>
            </div>
          </article>
        </div>

        <p class="reveal mt-10 max-w-2xl text-muted">
          Need something custom, like a booking flow, a dashboard or an integration with tools you already use?
          I'm a full stack developer, so
          <router-link to="/contact" class="link font-medium text-ink">tell me what you need</router-link>.
        </p>
      </div>
    </section>

    <!-- Process -->
    <section id="process" class="section bg-paper-2">
      <div class="container-site">
        <h2 class="h-section reveal">How it works</h2>
        <ol class="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <li v-for="step in steps" :key="step.title" class="reveal border-t-2 border-ink pt-6">
            <component :is="step.icon" :size="28" class="text-accent" />
            <h3 class="mt-5 text-xl font-semibold tracking-tight">{{ step.title }}</h3>
            <p class="mt-2 text-muted">{{ step.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- Work -->
    <section class="section">
      <div class="container-site">
        <h2 class="h-section reveal">Selected work</h2>

        <div class="mt-14 grid gap-4 lg:grid-cols-5">
          <!-- Main project -->
          <article class="bezel bezel-dark reveal lg:col-span-3 lg:row-span-2">
            <div class="bezel-core flex flex-col p-7 sm:p-10">
              <p class="text-sm text-ink-muted">{{ featured.context }}</p>
              <h3 class="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{{ featured.title }}</h3>
              <p class="mt-4 max-w-lg text-ink-muted">{{ featured.summary }}</p>
              <ul class="mt-8 grid gap-4">
                <li v-for="h in featured.highlights" :key="h" class="flex gap-3">
                  <PhCheck :size="20" weight="bold" class="mt-0.5 shrink-0 text-accent-light" />
                  <span class="text-white/90">{{ h }}</span>
                </li>
              </ul>
              <ul class="mt-auto flex flex-wrap gap-2 pt-10" aria-label="Technologies">
                <li v-for="t in featured.stack" :key="t" class="rounded-lg bg-white/8 px-2.5 py-1 text-[0.8125rem] text-white/75">{{ t }}</li>
              </ul>
            </div>
          </article>

          <!-- Other projects -->
          <article
            v-for="(project, i) in others"
            :key="project.id"
            class="bezel reveal lg:col-span-2"
          >
            <div class="bezel-core flex flex-col p-7 sm:p-8" :class="i === 0 ? '!bg-accent-soft' : ''">
              <p class="text-sm text-muted">{{ project.context }}</p>
              <h3 class="mt-2 text-2xl font-semibold tracking-tight">{{ project.title }}</h3>
              <p class="mt-3 text-muted">{{ project.summary }}</p>
              <ul class="mt-auto flex flex-wrap gap-2 pt-8" aria-label="Technologies">
                <li v-for="t in project.stack" :key="t" class="chip">{{ t }}</li>
              </ul>
            </div>
          </article>
        </div>

        <router-link to="/projects" class="link reveal mt-10 inline-flex items-center gap-2 font-medium">
          More about these projects <PhArrowRight :size="18" />
        </router-link>
      </div>
    </section>

    <!-- About -->
    <section class="section border-t border-line">
      <div class="container-site">
        <div class="reveal mx-auto max-w-3xl">
          <div class="flex items-center gap-5">
            <img
              v-if="isSet(site.photo)"
              :src="site.photo"
              :alt="`Portrait of ${site.name}`"
              width="96"
              height="96"
              class="h-20 w-20 rounded-[1.25rem] object-cover sm:h-24 sm:w-24"
            />
            <div v-else-if="showPlaceholders" class="ph-block h-20 w-20 rounded-[1.25rem] text-xs sm:h-24 sm:w-24">[ADD_PHOTO]</div>
            <h2 class="h-section">Hi, I'm {{ site.firstName }}.</h2>
          </div>
          <div class="mt-8 space-y-5 text-lg leading-relaxed text-muted md:text-xl">
            <p>
              I'm a full stack developer based in Navi Mumbai with 4 years of experience.
              I currently work on the <span class="text-ink">Thomas Cook&nbsp;/&nbsp;SOTC</span> travel booking platform,
              building flight search and moving older screens to modern Vue.js.
            </p>
            <p>
              I also build websites for small businesses and startups. You work with me directly, from the first call to launch,
              and you get the same standard of work: <span class="text-ink">fast pages, clean code and clear communication.</span>
            </p>
          </div>
          <router-link to="/about" class="link mt-8 inline-flex items-center gap-2 font-medium">
            More about me <PhArrowRight :size="18" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Testimonials: hidden in production until a real quote is added in src/content/testimonials.ts -->
    <section v-if="visibleTestimonials.length" class="section bg-paper-2">
      <div class="container-site">
        <h2 class="h-section reveal">What clients say</h2>
        <div class="mt-14 grid gap-4 md:grid-cols-2">
          <figure v-for="(t, i) in visibleTestimonials" :key="i" class="bezel reveal">
            <div class="bezel-core p-8 sm:p-10">
              <blockquote class="text-xl leading-snug font-medium tracking-tight">
                <template v-if="isSet(t.quote)">“{{ t.quote }}”</template>
                <Placeholder v-else :text="t.quote" />
              </blockquote>
              <figcaption class="mt-6 text-muted">
                <span class="block font-semibold text-ink">
                  <template v-if="isSet(t.name)">{{ t.name }}</template>
                  <Placeholder v-else :text="t.name" />
                </span>
                <template v-if="isSet(t.role)">{{ t.role }}</template>
                <Placeholder v-else :text="t.role" />
              </figcaption>
            </div>
          </figure>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section">
      <div class="container-site grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <h2 class="h-section reveal lg:sticky lg:top-28 lg:self-start">Questions clients ask</h2>
        <dl class="grid gap-10">
          <div v-for="item in visibleFaqs" :key="item.q" class="reveal">
            <dt class="text-xl font-semibold tracking-tight">{{ item.q }}</dt>
            <dd class="mt-3 text-muted">
              <Placeholder v-if="item.a.startsWith('[')" :text="item.a" />
              <template v-else>{{ item.a }}</template>
            </dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- Final call to action -->
    <section class="pb-20 md:pb-28">
      <div class="container-site">
        <div class="bezel bezel-dark reveal">
          <div class="bezel-core relative overflow-hidden px-7 py-14 sm:px-12 md:py-20">
            <div
              class="pointer-events-none absolute -right-40 -bottom-48 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgb(236_122_74/0.28),transparent_65%)]"
              aria-hidden="true"
            />
            <div class="relative max-w-2xl">
              <h2 class="text-[clamp(2.1rem,1.5rem+2.6vw,3.5rem)] leading-[1.04] font-[620] tracking-[-0.035em]">
                Tell me about your <span class="serif">business.</span>
              </h2>
              <p class="mt-5 text-lg text-ink-muted">
                The first call is free and there's no obligation.
                <template v-if="isSet(site.responseTime)">I usually reply {{ site.responseTime }}.</template>
                <Placeholder v-else text="[RESPONSE_TIME]" />
              </p>
              <div class="mt-10">
                <CtaButtons />
              </div>
              <p class="mt-8 text-ink-muted">
                Prefer email?
                <a :href="`mailto:${site.email}`" class="link break-all text-white">{{ site.email }}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { siVuedotjs, siNuxt, siTailwindcss, siSpringboot, siJavascript } from 'simple-icons'
import {
  PhCheck,
  PhArrowRight,
  PhAirplaneTilt,
  PhArrowsClockwise,
  PhListChecks,
  PhChatsCircle,
  PhReceipt,
  PhPencilRuler,
  PhGlobeSimple,
  PhGlobeHemisphereEast,
} from '@phosphor-icons/vue'
import CtaButtons from '@/components/CtaButtons.vue'
import Placeholder from '@/components/Placeholder.vue'
import { usePageSeo } from '@/composables/usePageSeo'
import { site, isSet, showPlaceholders, absoluteUrl } from '@/config/site'
import { services } from '@/content/services'
import { projects } from '@/content/projects'
import { testimonials } from '@/content/testimonials'
import { faqs } from '@/content/faq'

usePageSeo({ path: '/' })

const address = { '@type': 'PostalAddress', addressLocality: 'Panvel', addressRegion: 'Maharashtra', addressCountry: 'IN' }

// Structured data so search engines understand who this site is for
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Person',
            '@id': absoluteUrl('/#person'),
            name: site.name,
            jobTitle: 'Full Stack Developer',
            url: site.url,
            email: `mailto:${site.email}`,
            address,
            sameAs: [site.linkedin, site.github].filter(isSet),
            knowsAbout: ['Vue.js', 'Nuxt.js', 'JavaScript', 'Tailwind CSS', 'Java', 'Spring Boot', 'Web performance', 'SEO']
          },
          {
            '@type': 'ProfessionalService',
            '@id': absoluteUrl('/#service'),
            name: `${site.name} Web Development`,
            url: site.url,
            image: absoluteUrl(site.ogImage),
            description: site.description,
            founder: { '@id': absoluteUrl('/#person') },
            areaServed: 'Worldwide',
            address
          }
        ]
      })
    }
  ]
})

const proofPoints = [
  {
    icon: PhAirplaneTilt,
    title: 'Complex screens, built to work',
    text: 'One-way, round-trip and multi-city flight search with fare calculation, used by real customers.'
  },
  {
    icon: PhArrowsClockwise,
    title: 'Old sites, made modern',
    text: 'Migrated legacy Knockout.js and jQuery screens to Vue on a live platform.'
  },
  {
    icon: PhListChecks,
    title: 'Careful releases',
    text: 'Changes move through DEV, SIT and UAT testing before they reach production.'
  }
]

const steps = [
  { icon: PhChatsCircle, title: 'Free call', text: 'We talk about your business, your customers and what the website needs to do.' },
  { icon: PhReceipt, title: 'Fixed quote', text: 'You get a clear price and timeline in writing before any work starts.' },
  { icon: PhPencilRuler, title: 'Design and build', text: 'You follow progress on a live preview link and can ask for changes along the way.' },
  { icon: PhGlobeSimple, title: 'Launch and support', text: 'Your site goes live on your domain with SEO basics in place, and I stay available for fixes.' }
]

// Hero facts: real, from the resume and the site's own process (no invented client numbers)
const heroStats = [
  { value: '4 yrs', label: 'Building production web apps' },
  { value: 'Fixed', label: 'Price agreed before any work starts' }
]

const techStack = [siVuedotjs, siNuxt, siTailwindcss, siSpringboot, siJavascript].map(({ title, path }) => ({ title, path }))

// Optional hero video: respect reduced-motion by pausing it
const video = ref<HTMLVideoElement | null>(null)
onMounted(() => {
  if (video.value && window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.value.pause()
})

const [featured, ...others] = projects as [(typeof projects)[number], ...typeof projects]

const visibleTestimonials = testimonials.filter((t) => isSet(t.quote) || showPlaceholders)
const visibleFaqs = faqs.filter((f) => !f.a.startsWith('[') || showPlaceholders)
</script>
