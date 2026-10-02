<template>
  <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient :id="gid" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ff8a1f" />
        <stop offset="1" stop-color="#ff3d00" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="9" :fill="`url(#${gid})`" />
    <g fill="none" stroke-width="3.4" stroke-linecap="square">
      <path d="M9 26V6h8a6 6 0 0 1 0 12H9" stroke="#ffffff" />
      <path d="M16 18l8 8" stroke="#2a0b02" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue'

// unique per instance: the mark appears in both header and footer
const gid = `logo-flame-${useId()}`
</script>
