<template>
  <!-- Rendered only in `npm run dev`, so unfinished content never reaches visitors -->
  <span v-if="showPlaceholders" class="ph">{{ text }}</span>
</template>

<script setup lang="ts">
import { showPlaceholders } from '@/config/site'

defineProps<{ text: string }>()
</script>
