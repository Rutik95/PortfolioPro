<template>
  <div>
    <section class="container-site pt-32 pb-12 md:pt-40">
      <h1 class="rise max-w-[16ch] text-[clamp(2.4rem,1.5rem+3.6vw,4.25rem)] leading-[1.03] font-[640] tracking-[-0.04em]">
        Let's talk about your <span class="serif">website.</span>
      </h1>
      <p class="rise rise-1 lede mt-6 md:text-xl">
        Pick whatever is easiest for you. The first call is free and there's no obligation.
      </p>
    </section>

    <section class="container-site grid gap-4 pb-16 lg:grid-cols-3">
      <!-- Book a call -->
      <a
        :href="booking"
        :target="externalBooking ? '_blank' : undefined"
        :rel="externalBooking ? 'noopener' : undefined"
        class="group bezel bezel-dark rise rise-2 block"
      >
        <div class="bezel-core flex flex-col p-7 sm:p-8">
          <PhCalendarBlank :size="30" class="text-accent-light" />
          <h2 class="mt-8 text-2xl font-semibold tracking-tight">Book a call</h2>
          <p class="mt-2 text-ink-muted">
            Pick a time that suits you and we'll talk through your project.
            <Placeholder v-if="!externalBooking" text="[BOOKING_LINK] (opens email until added)" />
          </p>
          <span class="mt-8 inline-flex items-center gap-2 font-medium">
            Choose a time
            <PhArrowUpRight :size="18" class="transition-transform duration-500 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </a>

      <!-- WhatsApp -->
      <component
        :is="whatsapp ? 'a' : 'div'"
        v-if="whatsapp || showPlaceholders"
        :href="whatsapp || undefined"
        target="_blank"
        rel="noopener"
        class="group bezel rise rise-2 block"
      >
        <div class="bezel-core flex flex-col p-7 sm:p-8">
          <PhWhatsappLogo :size="30" class="text-[#25d366]" />
          <h2 class="mt-8 text-2xl font-semibold tracking-tight">WhatsApp</h2>
          <p class="mt-2 text-muted">
            Send a quick message, a voice note or a few photos of what you have in mind.
          </p>
          <span class="mt-8 inline-flex items-center gap-2 font-medium">
            <template v-if="whatsapp">Start a chat</template>
            <Placeholder v-else text="[YOUR_WHATSAPP_NUMBER]" />
            <PhArrowUpRight v-if="whatsapp" :size="18" class="transition-transform duration-500 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </component>

      <!-- Email -->
      <a :href="`mailto:${site.email}`" class="group bezel rise rise-2 block" :class="{ 'lg:col-span-2': !whatsapp && !showPlaceholders }">
        <div class="bezel-core flex flex-col p-7 sm:p-8">
          <PhEnvelopeSimple :size="30" class="text-accent" />
          <h2 class="mt-8 text-2xl font-semibold tracking-tight">Email</h2>
          <p class="mt-2 text-muted">Better for longer briefs, files or links to sites you like.</p>
          <span class="mt-8 inline-flex items-center gap-2 font-medium break-all">
            {{ site.email }}
          </span>
        </div>
      </a>
    </section>

    <section class="section border-t border-line">
      <div class="container-site grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <h2 class="h-section reveal">Helpful to include</h2>
        <div class="reveal">
          <ul class="grid gap-4 sm:grid-cols-2">
            <li v-for="item in brief" :key="item" class="flex gap-3">
              <PhCheck :size="20" weight="bold" class="mt-0.5 shrink-0 text-accent" />
              <span>{{ item }}</span>
            </li>
          </ul>
          <p class="mt-10 text-muted">
            Don't have all of this yet? That's fine. We can work it out on the call.
            <template v-if="isSet(site.responseTime)">I usually reply {{ site.responseTime }}.</template>
            <Placeholder v-else text="[RESPONSE_TIME]" />
          </p>
          <ul class="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-muted">
            <li class="flex items-center gap-2"><PhMapPin :size="18" /> {{ site.location }}</li>
            <li>
              <a :href="site.linkedin" target="_blank" rel="noopener" class="link inline-flex items-center gap-2 hover:text-ink">
                <PhLinkedinLogo :size="18" /> LinkedIn
              </a>
            </li>
            <li v-if="isSet(site.github)">
              <a :href="site.github" target="_blank" rel="noopener" class="link inline-flex items-center gap-2 hover:text-ink">
                <PhGithubLogo :size="18" /> GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  PhCalendarBlank,
  PhWhatsappLogo,
  PhEnvelopeSimple,
  PhArrowUpRight,
  PhCheck,
  PhMapPin,
  PhLinkedinLogo,
  PhGithubLogo,
} from '@phosphor-icons/vue'
import Placeholder from '@/components/Placeholder.vue'
import { usePageSeo } from '@/composables/usePageSeo'
import { site, isSet, showPlaceholders, bookingHref, whatsappHref } from '@/config/site'

usePageSeo({
  title: 'Contact',
  description: 'Get in touch with Rutik Tarerkar about a website, landing page or redesign for your business. Book a call, send a WhatsApp message or email.',
  path: '/contact'
})

const booking = bookingHref()
const externalBooking = isSet(site.bookingUrl)
const whatsapp = whatsappHref()

const brief = [
  'What your business does and who your customers are',
  'What you need: a new site, a landing page or a redesign',
  'Your current website, if you have one',
  'A few sites you like the look of',
  'Your rough budget',
  'When you would like to launch',
]
</script>
