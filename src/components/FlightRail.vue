<template>
  <nav class="rail" aria-label="Flight progress">
    <div class="rail__inner">
      <div class="rail__track">
        <svg class="rail__svg" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <clipPath id="rail-flown"><rect x="0" y="0" :width="x" height="40" /></clipPath>
            <clipPath id="rail-ahead"><rect :x="x" y="0" :width="1000 - x" height="40" /></clipPath>
          </defs>
          <path :d="profile" class="rail__ahead" clip-path="url(#rail-ahead)" vector-effect="non-scaling-stroke" />
          <path :d="profile" class="rail__flown" clip-path="url(#rail-flown)" vector-effect="non-scaling-stroke" />
        </svg>
        <span class="rail__plane" :style="{ left: `${x / 10}%`, top: `calc(var(--rail-h) * ${planeY})` }" aria-hidden="true"></span>
        <ol class="rail__legs">
          <li v-for="(leg, i) in LEGS" :key="leg.id" :style="{ left: `${(LEG_START[i] / TOTAL) * 100}%` }">
            <button
              type="button"
              class="rail__leg"
              :class="{ 'is-current': i === current, 'is-passed': i < current }"
              :aria-current="i === current ? 'step' : undefined"
              @click="emit('jump', i)"
            >
              <span class="rail__tick" aria-hidden="true"></span>
              <span class="rail__label" :class="{ 'rail__label--short': leg.w < 1 && i !== current }">{{ leg.label }}</span>
            </button>
          </li>
        </ol>
      </div>
      <p class="rail__readout" aria-live="off">
        <span class="rail__now">{{ LEGS[current].label }}</span>
        <span class="rail__alt">ALT {{ alt.toLocaleString('en-US') }} FT</span>
      </p>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CRUISE, LEGS, LEG_START, TOTAL, altAt, legAt } from '@/flight/path'

const props = defineProps<{ t: number; alt: number }>()
const emit = defineEmits<{ jump: [index: number] }>()

// The vertical profile of the whole flight: ground, climb, cruise, descent,
// ground. Drawn once; scroll only moves the split between flown and ahead.
const yOf = (t: number) => 34 - (altAt(t) / CRUISE) * 26
const profile = (() => {
  let d = ''
  for (let i = 0; i <= 240; i++) {
    const t = (i / 240) * TOTAL
    d += `${i ? 'L' : 'M'}${((t / TOTAL) * 1000).toFixed(1)} ${yOf(t).toFixed(2)}`
  }
  return d
})()

const x = computed(() => (props.t / TOTAL) * 1000)
const planeY = computed(() => (yOf(props.t) / 40).toFixed(4))
const current = computed(() => legAt(props.t))
</script>

<style scoped>
.rail {
  position: fixed; left: 0; right: 0; bottom: 0;
  z-index: var(--sc-z-chrome);
  padding: 0 var(--sc-gutter) calc(0.6rem + env(safe-area-inset-bottom));
  pointer-events: none;
  background: linear-gradient(to top, color-mix(in oklab, var(--sc-canvas) 70%, transparent), transparent);
}
.rail__inner { display: grid; grid-template-columns: 1fr auto; align-items: end; gap: var(--sc-6); }
.rail__track { --rail-h: 2.1rem; position: relative; height: 3.4rem; pointer-events: auto; }
.rail__svg { position: absolute; left: 0; right: 0; top: 0; width: 100%; height: var(--rail-h); overflow: visible; }
.rail__flown { fill: none; stroke: color-mix(in oklab, var(--sc-ink) 70%, transparent); stroke-width: 1.25; }
.rail__ahead { fill: none; stroke: color-mix(in oklab, var(--sc-ink) 30%, transparent); stroke-width: 1; stroke-dasharray: 3 4; }
.rail__plane {
  position: absolute; width: 7px; height: 7px; margin: -3.5px 0 0 -3.5px;
  background: var(--sc-accent); rotate: 45deg;
}
.rail__legs { list-style: none; margin: 0; padding: 0; position: absolute; inset: 0; }
.rail__legs li { position: absolute; top: 0; bottom: 0; }
.rail__leg {
  position: absolute; left: 0; bottom: 0;
  display: grid; justify-items: start; gap: 4px;
  padding: 0.3rem 0.4rem 0.2rem 0; margin-left: -1px;
  background: none; border: 0; cursor: pointer;
  color: color-mix(in oklab, var(--sc-ink) 45%, transparent);
  font-size: 0.66rem; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap;
  transition: color 160ms var(--sc-ease-out);
}
.rail__tick { width: 1px; height: 6px; background: currentColor; }
.rail__leg.is-passed { color: color-mix(in oklab, var(--sc-ink) 62%, transparent); }
.rail__leg.is-current { color: var(--sc-accent); }
/* the three destination legs sit close together: name only the one you are in */
.rail__label--short { visibility: hidden; }
@media (hover: hover) and (pointer: fine) {
  .rail__leg:hover { color: var(--sc-ink); }
}
.rail__leg:active { transform: translateY(1px); }
.rail__readout {
  margin: 0; padding-bottom: 0.25rem;
  display: grid; justify-items: end; gap: 2px;
  font-size: 0.66rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--sc-ink-soft); font-variant-numeric: tabular-nums; white-space: nowrap;
}
.rail__now { color: var(--sc-ink); }

@media (max-width: 1100px) {
  .rail__label { display: none; }
  .rail__leg { padding: 0.5rem 0.6rem 0.2rem 0; }
  .rail__leg.is-current .rail__label { display: none; }
}
@media (max-width: 860px) {
  .rail__inner { gap: var(--sc-4); }
  .rail__track { --rail-h: 1.7rem; height: 2.9rem; }
}
</style>
