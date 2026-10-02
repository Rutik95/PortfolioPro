<template>
  <div class="flex flex-wrap items-center gap-3" :class="{ 'flex-col !items-stretch': stacked }">
    <a
      :href="booking"
      class="btn btn-primary"
      :target="externalBooking ? '_blank' : undefined"
      :rel="externalBooking ? 'noopener' : undefined"
    >
      Book a call
      <span class="btn-icon"><PhArrowRight :size="18" weight="bold" /></span>
    </a>

    <a
      v-if="whatsapp || showPlaceholders"
      :href="whatsapp || undefined"
      target="_blank"
      rel="noopener"
      class="btn btn-secondary"
    >
      <PhWhatsappLogo :size="20" />
      Chat on WhatsApp
      <Placeholder v-if="!whatsapp" text="[YOUR_WHATSAPP_NUMBER]" />
    </a>
    <a v-else :href="`mailto:${site.email}`" class="btn btn-secondary">
      <PhEnvelopeSimple :size="20" />
      Email me
    </a>
  </div>
</template>

<script setup lang="ts">
import { PhArrowRight, PhWhatsappLogo, PhEnvelopeSimple } from '@phosphor-icons/vue'
import Placeholder from '@/components/Placeholder.vue'
import { site, isSet, showPlaceholders, bookingHref, whatsappHref } from '@/config/site'

defineProps<{ stacked?: boolean }>()

const booking = bookingHref()
const externalBooking = isSet(site.bookingUrl)
const whatsapp = whatsappHref()
</script>
