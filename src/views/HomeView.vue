<template>
  <div ref="rootEl" class="flight" data-sc-mode="worldflight" data-sc-seam="0.16" data-sc-lerp="0.12">
    <!-- The world: one fixed stage for the whole page. Each leg holds a poster
         rendered from the live scene; they carry the flight under reduced motion
         or without WebGL. A leg can take a scrub <video> later without any other
         change to this page. -->
    <div ref="stageEl" class="flight__stage" data-sc-world data-sc-verify-state="">
      <div
        v-for="leg in LEGS"
        :key="leg.id"
        class="flight__leg"
        data-sc-segment
        :data-sc-w="leg.w"
        :data-sc-waypoint="leg.label"
        :data-sc-linger="leg.id === 'departure' ? 0.3 : undefined"
      >
        <picture>
          <source media="(max-width: 860px)" :data-srcset="`/flight/posters/${leg.id}-m.webp`" />
          <img class="sc-world__poster" :data-src="`/flight/posters/${leg.id}.webp`" alt="" decoding="async" width="1600" height="900" />
        </picture>
      </div>
      <canvas ref="canvasEl" class="flight__canvas" aria-hidden="true"></canvas>

      <!-- Marks drawn on the world: the career fixes and the detection boxes.
           Decorative duplicates of content that is in the copy layer as text. -->
      <div class="flight__marks" aria-hidden="true">
        <div v-for="(f, i) in fixes" :key="f.ident" :ref="(el) => (fixEls[i] = el as HTMLElement)" class="fix">
          <span class="fix__ident">{{ f.ident }}</span>
          <span class="fix__date">{{ f.date }}</span>
          <span class="fix__title">{{ f.title }}</span>
          <span class="fix__line">{{ f.line }}</span>
        </div>
        <div v-for="i in 2" :key="'box' + i" :ref="(el) => (boxEls[i - 1] = el as HTMLElement)" class="detect">
          <span class="detect__label"></span>
        </div>
      </div>
    </div>

    <div class="flight__copy" data-sc-world-copy>
      <div class="flight__scrim flight__scrim--lead sc-world__scrim" :style="{ opacity: scrimLead }"></div>
      <div class="flight__scrim flight__scrim--trail sc-world__scrim" :style="{ opacity: scrimTrail }"></div>
      <div class="flight__scrim flight__scrim--top sc-world__scrim" :style="{ opacity: scrimTop }"></div>

      <header class="hero copy copy--lead" data-sc-copy data-sc-window="hero">
        <p class="hero__role">{{ site.role }}</p>
        <h1 class="hero__name"><span>{{ first }}</span> <span>{{ last }}</span></h1>
        <p class="hero__line">Building digital experiences for travel.</p>
      </header>

      <section class="copy copy--trail" data-sc-copy :data-sc-window="windowFor('takeoff', 0.42, 1.0)" aria-labelledby="h-takeoff">
        <h2 id="h-takeoff" class="copy__h">I build the part of travel people touch.</h2>
        <p class="copy__p">Flight search, multicity routes, date handling, validations. Since 2022, mostly in Vue, mostly for travel.</p>
      </section>

      <section class="copy copy--lead copy--wide" data-sc-copy :data-sc-window="cruiseWindow" aria-labelledby="h-cruise">
        <h2 id="h-cruise" class="copy__h">Enterprise scale, legacy constraints, real travellers.</h2>
        <p class="copy__p">
          I own the Flights frontend on Thomas Cook's travel platform, work across several teams and mentor interns.
          Most of what I ship is Vue: state-heavy, API-driven, often inside enterprise systems that were never built for it.
        </p>
        <dl class="specs">
          <div><dt>Frameworks</dt><dd>Vue 2 and 3, Nuxt 2 and 3</dd></div>
          <div><dt>State</dt><dd>Pinia, Vuex</dd></div>
          <div><dt>Data</dt><dd>REST APIs, Axios, Java services</dd></div>
          <div><dt>Inside</dt><dd>OpenCMS, CDN-delivered Vue, legacy migrations</dd></div>
          <div><dt>Assisted by</dt><dd>GitHub Copilot, Claude</dd></div>
        </dl>
      </section>

      <section class="copy copy--top" data-sc-copy :data-sc-window="windowFor('route', 0.1, 0.96)" aria-labelledby="h-route">
        <h2 id="h-route" class="copy__h">The route so far.</h2>
        <p class="copy__p">Flown, in contrail. Ahead, in dashes. Each fix is a year.</p>
        <ol class="sr-only">
          <li v-for="f in fixes" :key="f.ident">{{ f.date }}: {{ f.title }}. {{ f.line }}</li>
        </ol>
      </section>

      <section
        v-for="d in destinations"
        :key="d.id"
        class="copy copy--lead dest"
        data-sc-copy
        :data-sc-window="windowFor(d.id, 0.06, 0.94)"
        :aria-labelledby="`h-${d.id}`"
      >
        <h2 :id="`h-${d.id}`" class="copy__h dest__name">{{ d.name }}</h2>
        <p class="dest__kind">{{ d.kind }}</p>
        <p class="copy__p">{{ d.what }}</p>
        <p class="copy__p copy__p--soft">{{ d.part }}</p>
        <p class="dest__stack">{{ d.stack.join(' · ') }}</p>
      </section>

      <section class="copy copy--lead" data-sc-copy :data-sc-window="windowFor('checklist', 0.04, 0.97)" aria-labelledby="h-check">
        <h2 id="h-check" class="copy__h">Approach checklist</h2>
        <p class="copy__p copy__p--soft">How the work gets done, every release.</p>
        <ol class="checklist">
          <li v-for="(c, i) in checklist" :key="c.item" :class="{ 'is-done': i < checked }">
            <span class="checklist__item">{{ c.item }}</span>
            <span class="checklist__dots" aria-hidden="true"></span>
            <span class="checklist__resp">{{ c.response }}</span>
          </li>
        </ol>
      </section>

      <section class="copy copy--lead finale" data-sc-copy data-sc-window="finale" aria-labelledby="h-finale">
        <h2 id="h-finale" class="finale__h">Let's build what's next.</h2>
        <p class="copy__p">Open to frontend roles and freelance work in Vue, Nuxt and travel technology.</p>
        <div class="finale__actions">
          <a class="btn" :href="`mailto:${site.email}`">Email Rutik</a>
          <a class="link" :href="site.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a class="link" :href="site.resume" download>CV, PDF</a>
          <a v-if="isSet(site.github)" class="link" :href="site.github" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <p class="finale__mail">{{ site.email }}</p>
      </section>
    </div>

    <div class="flight__spacer" data-sc-spacer aria-hidden="true"></div>

    <FlightRail :t="railT" :alt="altFt" @jump="jumpTo" />

  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import FlightRail from '@/components/FlightRail.vue'
import { usePageSeo } from '@/composables/usePageSeo'
import { site, isSet, absoluteUrl } from '@/config/site'
import { checklist, destinations, fixes } from '@/data/profile'
import { LEGS, LEG_START, TOTAL, aircraftAt, at, windowFor } from '@/flight/path'
import type { FlightWorld, FrameInfo } from '@/flight/world'

usePageSeo({ path: '/' })
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': absoluteUrl('/#person'),
        name: site.name,
        jobTitle: site.role,
        url: site.url,
        email: `mailto:${site.email}`,
        address: { '@type': 'PostalAddress', addressLocality: 'Panvel', addressRegion: 'Maharashtra', addressCountry: 'IN' },
        sameAs: [site.linkedin, site.github].filter(isSet),
        knowsAbout: ['Vue.js', 'Nuxt.js', 'JavaScript', 'Pinia', 'Vuex', 'REST APIs', 'OpenCMS', 'Travel technology'],
      }),
    },
  ],
})

const [first, ...rest] = site.name.split(' ')
const last = rest.join(' ')
const cruiseWindow = `${(at('cruise', 0.3) / TOTAL).toFixed(4)} ${(at('route', 0.06) / TOTAL).toFixed(4)}`

const rootEl = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const fixEls: HTMLElement[] = []
const boxEls: HTMLElement[] = []

const railT = ref(0)
const checked = ref(0)
let verifyState = ''
const scrimLead = ref(1)
const scrimTrail = ref(0)
const scrimTop = ref(0)
const altFt = computed(() => Math.round((aircraftAt(railT.value).alt * 3.281) / 10) * 10)

// Which side each stretch of the track puts its copy on, so the scrim only
// darkens the corner the words are in.
const trailSpans: [number, number][] = [[at('takeoff', 0.3), at('cruise', 0.25)]]
const inTrail = (t: number) => trailSpans.some(([a, b]) => t >= a && t <= b)
const inTop = (t: number) => t >= at('route', 0.04) && t <= at('route', 1)

let world: FlightWorld | null = null
let engine: { destroy(): void; layout(): void } | null = null
const cleanups: (() => void)[] = []

function trackT() {
  const top = rootEl.value ? rootEl.value.getBoundingClientRect().top + window.scrollY : 0
  return Math.min(Math.max((window.scrollY - top) / window.innerHeight, 0), TOTAL)
}

function onScroll() {
  const t = trackT()
  railT.value = t
  world?.setTarget(t)
  const ci = LEGS.findIndex((l) => l.id === 'checklist')
  const local = (t - LEG_START[ci]) / LEGS[ci].w
  checked.value = Math.max(0, Math.min(checklist.length, Math.floor((local - 0.12) / 0.075) + 1))
  const tr = inTrail(t) ? 1 : 0
  const tp = inTop(t) ? 1 : 0
  scrimTrail.value = tr
  scrimTop.value = tp
  scrimLead.value = tr || tp ? 0 : 1
}

function jumpTo(index: number) {
  const leg = LEGS[index]
  const top = rootEl.value ? rootEl.value.getBoundingClientRect().top + window.scrollY : 0
  const t = index === 0 ? 0 : index === LEGS.length - 1 ? TOTAL : LEG_START[index] + leg.w * 0.5
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: top + t * window.innerHeight, behavior: reduce ? 'auto' : 'smooth' })
}

function drawMarks(f: FrameInfo) {
  const vw = window.innerWidth
  // Only two fixes speak at once: the next one ahead, and the one just flown
  // through. Further ones crowd into the vanishing point and say nothing.
  const ahead = f.fixes.findIndex((x) => x.dist > -250)
  const active = ahead === -1 ? f.fixes.length - 1 : ahead
  f.fixes.forEach((x, i) => {
    const el = fixEls[i]
    if (!el) return
    const shown = i === active || i === active - 1
    const fadeAhead = 1 - Math.min(Math.max((x.dist - 2600) / 900, 0), 1)
    const fadeBehind = 1 - Math.min(Math.max((-x.dist - 900) / 900, 0), 1)
    const op = f.routeOpacity * (x.front && shown ? 1 : 0) * fadeAhead * fadeBehind * (i === active ? 1 : 0.55)
    el.style.opacity = op.toFixed(3)
    el.style.transform = `translate3d(${Math.min(Math.max(x.x, 12), vw - 12).toFixed(1)}px, ${x.y.toFixed(1)}px, 0)`
    // labels on the right half of the screen hang to the left of their fix
    el.classList.toggle('is-flip', x.x > vw * 0.56)
    el.classList.toggle('is-passed', x.passed)
    el.classList.toggle('is-active', i === active)
  })
  const di = LEGS.findIndex((l) => l.id === 'detection')
  const local = (f.t - LEG_START[di]) / LEGS[di].w
  const show = local > 0.1 && local < 0.92 ? Math.min(1, (local - 0.1) * 6, (0.92 - local) * 6) : 0
  boxEls.forEach((el, i) => {
    const c = f.cars[i]
    if (!el || !c) return
    el.style.opacity = (show * (c.front ? 1 : 0)).toFixed(3)
    el.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0)`
    const lab = el.firstElementChild as HTMLElement
    if (lab.textContent !== c.label) lab.textContent = c.label
  })
  const sig = `${f.t.toFixed(2)}|${Math.round(f.st.alt)}|${f.inCloud.toFixed(2)}`
  // A compact signature of what actually painted, for the verification harness.
  if (sig !== verifyState) { verifyState = sig; stageEl.value?.setAttribute('data-sc-verify-state', sig) }
}

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

function usePosters() {
  stageEl.value?.classList.add('is-posters')
  stageEl.value?.querySelectorAll<HTMLImageElement>('img[data-src]').forEach((img) => { img.src = img.dataset.src! })
  stageEl.value?.querySelectorAll<HTMLSourceElement>('source[data-srcset]').forEach((s) => { s.srcset = s.dataset.srcset! })
}

onMounted(async () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const params = new URLSearchParams(window.location.search)
  const mobile = window.matchMedia('(max-width: 860px), (pointer: coarse)').matches
  document.documentElement.classList.add('is-flight')
  cleanups.push(() => document.documentElement.classList.remove('is-flight'))

  if (!reduce && webglAvailable() && params.get('fallback') === null && canvasEl.value) {
    try {
      const { createFlightWorld } = await import('@/flight/world')
      if (!canvasEl.value) return
      world = createFlightWorld(canvasEl.value, { mobile, onFrame: drawMarks })
      stageEl.value?.classList.add('is-live')
    } catch (e) {
      console.warn('[flight] WebGL world failed, using posters', e)
      world = null
      usePosters()
    }
  } else {
    usePosters()
  }

  // The worldflight engine drives the copy windows, the scroll track and the
  // waypoint events. It is vendored untouched from ScrollCraft.
  await import('@/vendor/scrollcraft/scrollcraft.js')
  // mount() looks for worldflights inside the node it is given, so hand it the parent
  if (rootEl.value?.parentElement && window.ScrollCraft) engine = window.ScrollCraft.mount(rootEl.value.parentElement)
  const relayout = () => window.dispatchEvent(new Event('resize'))
  window.addEventListener('load', relayout)
  document.fonts?.ready.then(relayout)
  cleanups.push(() => window.removeEventListener('load', relayout))

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  cleanups.push(() => window.removeEventListener('scroll', onScroll))
  cleanups.push(() => window.removeEventListener('resize', onScroll))
  onScroll()
  world?.snap(trackT())

  // Keyboard focus on a link in a copy block that isn't on screen yet (the
  // finale's links, from the hero) flies the page to where that block is lit.
  const onFocus = (e: FocusEvent) => {
    const block = (e.target as HTMLElement | null)?.closest?.('[data-sc-copy]') as HTMLElement | null
    if (!block || parseFloat(getComputedStyle(block).opacity) > 0.85) return
    const spec = block.dataset.scWindow || ''
    const frac = spec === 'hero' ? 0 : spec === 'finale' ? 1 : (() => { const [a, b] = spec.split(/\s+/).map(Number); return (a + b) / 2 })()
    const top = rootEl.value ? rootEl.value.getBoundingClientRect().top + window.scrollY : 0
    window.scrollTo({ top: top + frac * TOTAL * window.innerHeight, behavior: 'instant' as ScrollBehavior })
  }
  window.addEventListener('focusin', onFocus)
  cleanups.push(() => window.removeEventListener('focusin', onFocus))

  if (world && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const move = (e: PointerEvent) => world?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1))
    window.addEventListener('pointermove', move, { passive: true })
    cleanups.push(() => window.removeEventListener('pointermove', move))
  }

  // Poster capture hook, used by scripts/posters.mjs to render each leg's
  // fallback frame from the real scene. Inert unless ?poster is in the URL.
  if (params.has('poster') && world) {
    const w = world
    ;(window as unknown as { __flight: unknown }).__flight = {
      legs: LEGS.map((l, i) => ({ id: l.id, t: LEG_START[i] + l.w * (l.id === 'departure' ? 0.05 : l.id === 'arrival' ? 0.9 : 0.55) })),
      capture: (t: number) => w.capture(t),
    }
  }
})

onBeforeUnmount(() => {
  engine?.destroy()
  world?.dispose()
  world = null
  cleanups.forEach((f) => f())
})
</script>

<style scoped>
.flight { position: relative; }
/* The engine sizes the track in px at mount; this is only the pre-mount height. */
.flight__spacer { height: calc(var(--flight-track, 13.4) * 100svh); }

.flight__stage { background: var(--sc-canvas); }
.flight__leg :deep(picture) { position: absolute; inset: 0; }
.flight__leg :deep(img) { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.flight__canvas {
  position: absolute; inset: 0; width: 100%; height: 100%;
  z-index: 200; display: block; opacity: 0;
  transition: opacity 900ms var(--sc-ease-out);
}
.flight__stage.is-live .flight__canvas { opacity: 1; }
.flight__stage.is-posters .flight__canvas { display: none; }

.flight__marks { position: absolute; inset: 0; z-index: 210; pointer-events: none; overflow: hidden; }

/* ------------------------------------------------------------ fix labels -- */
.fix {
  position: absolute; left: 0; top: 0;
  display: grid; gap: 2px;
  width: max-content; max-width: 17rem;
  padding: 0 0 0 14px;
  margin-top: -6px;
  opacity: 0;
  will-change: transform, opacity;
  border-left: 1px solid color-mix(in oklab, var(--sc-accent) 70%, transparent);
  translate: 18px -100%;
}
.fix__ident {
  font-family: var(--sc-font-display);
  font-stretch: 112%;
  font-weight: 600;
  font-size: 0.82rem;
  letter-spacing: 0.14em;
  color: var(--sc-accent);
}
.fix__date { font-size: 0.72rem; letter-spacing: 0.06em; color: var(--sc-ink-soft); font-variant-numeric: tabular-nums; }
.fix__title, .fix__line { display: none; }
.fix.is-active .fix__title { display: block; font-size: 1.02rem; color: var(--sc-ink); line-height: 1.3; font-weight: 500; }
.fix.is-active .fix__line { display: block; font-size: 0.86rem; color: var(--sc-ink-soft); line-height: 1.45; }
.fix.is-passed { border-left-color: color-mix(in oklab, var(--sc-ink) 45%, transparent); }
.fix.is-flip {
  translate: calc(-100% - 18px) -100%;
  padding: 0 14px 0 0; text-align: right; justify-items: end;
  border-left: 0; border-right: 1px solid color-mix(in oklab, var(--sc-accent) 70%, transparent);
}
.fix.is-passed .fix__ident { color: var(--sc-ink); }

/* -------------------------------------------------------- detection boxes -- */
.detect {
  position: absolute; left: 0; top: 0;
  width: 30px; height: 30px; margin: -15px 0 0 -15px;
  border: 1px solid color-mix(in oklab, var(--sc-accent) 85%, transparent);
  opacity: 0;
  will-change: transform, opacity;
}
.detect__label {
  position: absolute; left: -1px; bottom: calc(100% + 4px);
  white-space: nowrap;
  font-size: 0.66rem; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--sc-accent);
}

/* ------------------------------------------------------------------- copy -- */
.flight__copy { color: var(--sc-ink); }
.flight__scrim { transition: opacity 600ms var(--sc-ease-out); }
.flight__scrim--lead {
  background:
    radial-gradient(130% 115% at 0% 100%, color-mix(in oklab, var(--sc-canvas) 95%, transparent) 0%, color-mix(in oklab, var(--sc-canvas) 84%, transparent) 36%, color-mix(in oklab, var(--sc-canvas) 42%, transparent) 58%, transparent 76%);
}
.flight__scrim--top {
  background: linear-gradient(to bottom, color-mix(in oklab, var(--sc-canvas) 88%, transparent) 0%, color-mix(in oklab, var(--sc-canvas) 60%, transparent) 28%, transparent 48%);
}
.flight__scrim--trail {
  background:
    radial-gradient(120% 100% at 100% 100%, color-mix(in oklab, var(--sc-canvas) 90%, transparent) 0%, color-mix(in oklab, var(--sc-canvas) 62%, transparent) 34%, color-mix(in oklab, var(--sc-canvas) 20%, transparent) 54%, transparent 70%);
}

.copy {
  position: absolute;
  max-width: 34rem;
  bottom: clamp(5.5rem, 15vh, 10rem);
}
.copy--lead { left: var(--sc-gutter); }
.copy--trail { right: var(--sc-gutter); text-align: left; max-width: 26rem; }
.copy--wide { max-width: 38rem; }
.copy--top { top: clamp(5.5rem, 14vh, 9rem); bottom: auto; left: var(--sc-gutter); }

.copy__h {
  margin: 0 0 var(--sc-4);
  font-family: var(--sc-font-display);
  font-weight: 500;
  font-stretch: 104%;
  font-size: var(--sc-t-2xl);
  line-height: var(--sc-leading-tight);
  letter-spacing: var(--sc-track-snug);
  text-wrap: balance;
}
.copy__p {
  margin: 0 0 var(--sc-3);
  font-size: var(--sc-t-base);
  line-height: 1.65;
  letter-spacing: 0.002em;
  color: color-mix(in oklab, var(--sc-ink) 88%, var(--sc-canvas));
  text-wrap: pretty;
  max-width: 60ch;
}
.copy__p--soft { color: var(--sc-ink-soft); }

/* hero: a title card on the runway */
.hero { bottom: clamp(5.5rem, 17vh, 11rem); max-width: none; }
.hero__role {
  margin: 0 0 var(--sc-4);
  font-size: var(--sc-t-xs);
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--sc-accent);
}
.hero__name {
  margin: 0;
  font-family: var(--sc-font-display);
  font-weight: 500;
  font-stretch: 116%;
  font-size: clamp(3.1rem, 1.2rem + 7.4vw, 8.4rem);
  line-height: 0.9;
  letter-spacing: -0.035em;
}
.hero__name span { display: block; }
.hero__line {
  margin: var(--sc-5) 0 0;
  font-size: var(--sc-t-lg);
  color: color-mix(in oklab, var(--sc-ink) 82%, var(--sc-canvas));
  letter-spacing: 0;
}

.specs { margin: var(--sc-5) 0 0; display: grid; gap: 0; border-top: 1px solid var(--sc-hairline); }
.specs > div { display: grid; grid-template-columns: 8.5rem 1fr; gap: var(--sc-4); padding: 0.55rem 0; border-bottom: 1px solid var(--sc-hairline); }
.specs dt { font-size: var(--sc-t-xs); letter-spacing: 0.14em; text-transform: uppercase; color: var(--sc-ink-soft); padding-top: 0.2em; }
.specs dd { margin: 0; font-size: var(--sc-t-sm); }

.dest__name { margin-bottom: var(--sc-2); }
.dest__kind { margin: 0 0 var(--sc-5); font-size: var(--sc-t-sm); color: var(--sc-accent); letter-spacing: 0.02em; }
.dest__stack { margin: var(--sc-5) 0 0; font-size: var(--sc-t-xs); letter-spacing: 0.12em; text-transform: uppercase; color: var(--sc-ink-soft); }

.checklist { list-style: none; margin: var(--sc-5) 0 0; padding: 0; display: grid; gap: 0.3rem; max-width: 34rem; }
.checklist li {
  display: grid; grid-template-columns: auto 1fr auto; align-items: baseline; gap: 0.6rem;
  font-size: var(--sc-t-sm);
  color: var(--sc-ink-soft);
  transition: color 240ms var(--sc-ease-out);
}
.checklist__item { text-transform: uppercase; letter-spacing: 0.1em; font-size: var(--sc-t-xs); }
.checklist__dots { border-bottom: 1px dotted color-mix(in oklab, var(--sc-ink) 28%, transparent); transform: translateY(-0.3em); }
.checklist__resp { text-align: right; }
.checklist li.is-done { color: var(--sc-ink); }
.checklist li.is-done .checklist__item { color: var(--sc-accent); }
.checklist li.is-done .checklist__resp::after { content: ' ✓'; color: var(--sc-accent); }

.finale { bottom: clamp(6rem, 18vh, 11rem); max-width: 40rem; }
.finale__h {
  margin: 0 0 var(--sc-5);
  font-family: var(--sc-font-display);
  font-weight: 500;
  font-stretch: 112%;
  font-size: var(--sc-t-3xl);
  line-height: 0.98;
  letter-spacing: -0.03em;
  text-wrap: balance;
}
.finale__actions .link { font-size: var(--sc-t-sm); }
.finale__actions { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sc-3) var(--sc-6); margin-top: var(--sc-6); }
.finale__mail { margin: var(--sc-5) 0 0; font-size: var(--sc-t-sm); color: var(--sc-ink-soft); font-variant-numeric: tabular-nums; letter-spacing: 0.02em; }

@media (max-width: 860px) {
  .copy, .copy--trail, .copy--wide, .hero, .finale { left: var(--sc-gutter); right: var(--sc-gutter); max-width: none; bottom: calc(4.5rem + env(safe-area-inset-bottom)); }
  .copy--top { top: 5rem; bottom: auto; }
  .flight__scrim--top {
    background: linear-gradient(to bottom, color-mix(in oklab, var(--sc-canvas) 94%, transparent) 0%, color-mix(in oklab, var(--sc-canvas) 74%, transparent) 30%, transparent 52%);
  }
  .flight__scrim--lead, .flight__scrim--trail {
    background: linear-gradient(to top,
      color-mix(in oklab, var(--sc-canvas) 94%, transparent) 0%,
      color-mix(in oklab, var(--sc-canvas) 80%, transparent) 30%,
      color-mix(in oklab, var(--sc-canvas) 30%, transparent) 52%,
      transparent 66%);
  }
  .copy__h { font-size: var(--sc-t-xl); }
  .specs > div { grid-template-columns: 6.5rem 1fr; }
  .checklist li { grid-template-columns: 1fr; gap: 0; }
  .checklist__dots { display: none; }
  .checklist__resp { text-align: left; font-size: var(--sc-t-xs); }
  .finale__h { font-size: var(--sc-t-2xl); }
  .fix { max-width: 11rem; }
  .detect__label { display: none; }
}
</style>
