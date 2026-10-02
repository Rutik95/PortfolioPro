// The flight, as a function of scroll.
//
// `t` is the position along the scroll track in viewport-heights, the same unit
// the worldflight legs are weighted in, so every key below lines up with a leg
// boundary in HomeView by construction. Nothing here touches three.js: it is
// pure numbers, so the rail, the labels and the renderer all read one timeline.

export interface Leg {
  id: string
  label: string
  w: number
}

export const LEGS: Leg[] = [
  { id: 'departure', label: 'Departure', w: 1.0 },
  { id: 'takeoff', label: 'Takeoff', w: 1.6 },
  { id: 'cruise', label: 'Cruise', w: 1.2 },
  { id: 'route', label: 'Flight path', w: 1.8 },
  { id: 'flights', label: 'Flights', w: 0.7 },
  { id: 'scoreboard', label: 'Scoreboard', w: 0.7 },
  { id: 'detection', label: 'Detection', w: 0.7 },
  { id: 'checklist', label: 'Checklist', w: 1.0 },
  { id: 'landing', label: 'Landing', w: 2.6 },
  { id: 'arrival', label: 'Arrival', w: 1.1 },
]

export const LEG_START: number[] = []
{
  let run = 0
  for (const l of LEGS) { LEG_START.push(run); run += l.w }
  LEG_START.push(run)
}
export const TOTAL = LEG_START[LEG_START.length - 1]

export const legAt = (t: number) => {
  let k = 0
  for (let i = 0; i < LEGS.length; i++) if (t >= LEG_START[i]) k = i
  return k
}
/** Track position for a leg-local progress. */
export const at = (id: string, local: number) => {
  const i = LEGS.findIndex((l) => l.id === id)
  return LEG_START[i] + LEGS[i].w * local
}
/** A copy window, as fractions of the whole track, for data-sc-window. */
export const windowFor = (id: string, from: number, to: number, rIn?: number, rOut?: number) => {
  const a = at(id, from) / TOTAL
  const b = at(id, to) / TOTAL
  const parts = [a.toFixed(4), b.toFixed(4)]
  if (rIn !== undefined) parts.push(rIn.toFixed(2), (rOut ?? 0.3).toFixed(2))
  return parts.join(' ')
}

// ---------------------------------------------------------------- world --
export const CLOUD_BASE = 1150
export const CLOUD_TOP = 1520
export const CRUISE = 1950
/** Departure runway runs from z=0 to z=-RWY_LEN. The aircraft starts 60 m in. */
export const RWY_LEN = 3200
export const RWY_W = 45
export const Z0 = -60
/** Path distance at the arrival threshold. Its runway runs on in -Z for RWY_LEN. */
export const S_ARR = 66200
export const zOf = (s: number) => Z0 - s

// ---------------------------------------------------------- interpolation --
// Monotone cubic (PCHIP): smooth like a spline, but it never overshoots a key,
// so an aircraft holding still stays still and never drifts backwards.
type Keys = [number, number][]
function pchip(keys: Keys) {
  const n = keys.length
  const x = keys.map((k) => k[0])
  const y = keys.map((k) => k[1])
  const h: number[] = []
  const d: number[] = []
  for (let i = 0; i < n - 1; i++) { h.push(x[i + 1] - x[i]); d.push((y[i + 1] - y[i]) / h[i]) }
  const m: number[] = new Array(n).fill(0)
  m[0] = d[0]; m[n - 1] = d[n - 2]
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0
    else {
      const w1 = 2 * h[i] + h[i - 1]
      const w2 = h[i] + 2 * h[i - 1]
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i])
    }
  }
  return (t: number) => {
    if (t <= x[0]) return y[0]
    if (t >= x[n - 1]) return y[n - 1]
    let i = 0
    while (i < n - 2 && t > x[i + 1]) i++
    const u = (t - x[i]) / h[i]
    const u2 = u * u, u3 = u2 * u
    return (2 * u3 - 3 * u2 + 1) * y[i] + (u3 - 2 * u2 + u) * h[i] * m[i] +
      (-2 * u3 + 3 * u2) * y[i + 1] + (u3 - u2) * h[i] * m[i + 1]
  }
}

const smooth = (e0: number, e1: number, x: number) => {
  const u = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return u * u * (3 - 2 * u)
}

// Distance along the path (m) and altitude (m), keyed to the track.
const sKeys: Keys = [
  [0, 0], [0.85, 3], [1.0, 12], [1.35, 420], [1.62, 1500], [1.75, 2100], [2.1, 4300],
  [2.6, 8000], [2.9, 10600], [3.15, 12800], [3.8, 18500], [5.6, 32000], [7.7, 47750],
  [8.7, 55000], [8.95, 57000], [9.25, 59600], [9.8, 63600], [10.35, 65600],
  [10.6, 66250], [10.72, 66600], [11.05, 67600], [11.3, 67950], [11.7, 68120], [12.4, 68150],
]
const altKeys: Keys = [
  [0, 0], [1.66, 0], [1.75, 25], [2.1, 380], [2.6, 1050], [2.9, 1420], [3.15, 1720],
  [3.8, CRUISE], [7.7, CRUISE], [8.7, 1650], [8.95, 1450], [9.25, 1020], [9.8, 420],
  [10.35, 95], [10.6, 18], [10.72, 0], [12.4, 0],
]
export const sAt = pchip(sKeys)
const altRaw = pchip(altKeys)
export const altAt = (t: number) => Math.max(0, altRaw(t))

/** Distance at the track position where each fix sits on the route leg. */
export const FIX_S = [21000, 24200, 26900, 29600, 32000]

// --------------------------------------------------------------- aircraft --
export interface AircraftState {
  s: number
  alt: number
  pitch: number // radians, nose up positive
  roll: number
  gear: number // 1 down, 0 up
  landingLights: number
  strobes: number
  beacon: number
  taxiLight: number
}

const deg = Math.PI / 180

export function aircraftAt(t: number): AircraftState {
  const s = sAt(t)
  const alt = altAt(t)
  const dt = 0.01
  const ds = sAt(t + dt) - sAt(t - dt)
  const da = altAt(t + dt) - altAt(t - dt)
  const path = ds > 0.5 ? Math.atan2(da, ds) : 0
  // Angle of attack: rotation, climb, cruise, approach, flare, then the nose
  // lowers onto the runway.
  let aoa = 0
  aoa += smooth(1.56, 1.68, t) * 7 * deg * (1 - smooth(2.4, 3.2, t))
  aoa += smooth(2.4, 3.2, t) * 2.5 * deg * (1 - smooth(8.6, 9.3, t))
  aoa += smooth(8.6, 9.3, t) * 3 * deg
  aoa += smooth(10.5, 10.66, t) * 3.5 * deg
  aoa *= 1 - smooth(10.74, 10.9, t)
  const roll = (smooth(3.6, 4.0, t) - smooth(5.4, 5.8, t)) * Math.sin(t * 2.1) * 2.5 * deg +
    (smooth(7.8, 8.2, t) - smooth(8.5, 8.7, t)) * -4 * deg
  return {
    s, alt,
    pitch: path * 0.85 + aoa,
    roll,
    gear: 1 - smooth(1.95, 2.25, t) + smooth(9.55, 9.85, t),
    landingLights: 1 - smooth(2.3, 2.7, t) + smooth(8.8, 9.2, t) - smooth(11.35, 11.6, t),
    strobes: smooth(0.9, 1.0, t) - smooth(11.3, 11.4, t),
    beacon: 1 - smooth(12.05, 12.25, t),
    taxiLight: 1 - smooth(1.7, 1.9, t) + smooth(9.7, 9.9, t),
  }
}

// ----------------------------------------------------------------- camera --
// Offsets are relative to the aircraft and world-aligned (not rotated with
// it), so a roll never shakes the camera. The aircraft flies toward -Z, so +Z
// is behind it and +X is its right (starboard) side.
export interface CamKey {
  t: number
  o: [number, number, number]
  l: [number, number, number]
  fov: number
}

const desktopKeys: CamKey[] = [
  { t: 0.0, o: [-30, 5.4, 120], l: [10, -2.6, -60], fov: 26 },
  { t: 0.9, o: [-26, 4.8, 104], l: [9, -2.2, -60], fov: 27 },
  { t: 1.35, o: [-17, 2.6, 62], l: [3, 4, -80], fov: 32 },
  { t: 1.72, o: [-9, 4, 50], l: [0, 6, -80], fov: 38 },
  { t: 2.15, o: [-14, 12, 80], l: [30, 2, -60], fov: 38 },
  { t: 2.6, o: [-6, 15, 88], l: [26, 2, -80], fov: 36 },
  { t: 3.1, o: [-60, 12, 58], l: [-6, -4, -30], fov: 32 },
  { t: 3.62, o: [-120, 16, 34], l: [-14, -4, -26], fov: 28 },
  { t: 3.95, o: [-34, 70, 230], l: [0, -40, -900], fov: 38 },
  { t: 5.45, o: [-26, 80, 250], l: [0, -40, -900], fov: 38 },
  { t: 5.85, o: [-160, 620, 520], l: [230, -1950, -1300], fov: 42 },
  { t: 7.45, o: [-160, 620, 520], l: [230, -1950, -1300], fov: 42 },
  // the window seat: just outside the cabin, behind the wing, looking out
  { t: 7.82, o: [30, 16, 44], l: [12, 2, -8], fov: 48 },
  { t: 8.02, o: [2.6, 4.4, 9.5], l: [18, 1.4, 3.5], fov: 52 },
  { t: 8.58, o: [2.65, 4.45, 9.3], l: [18, 1.0, 4.0], fov: 52 },
  { t: 8.76, o: [12, 7, 30], l: [0, 2, -60], fov: 48 },
  { t: 8.92, o: [0, 8, 46], l: [0, 1, -100], fov: 46 },
  { t: 9.3, o: [0, 22, 95], l: [0, -70, -520], fov: 46 },
  { t: 9.9, o: [6, 12, 72], l: [0, -45, -700], fov: 42 },
  { t: 10.4, o: [8, 6, 58], l: [0, -12, -520], fov: 40 },
  { t: 10.66, o: [-26, 3.4, 46], l: [4, 3, -40], fov: 38 },
  { t: 10.95, o: [-24, 2.4, 30], l: [2, 2.5, -60], fov: 40 },
  { t: 11.35, o: [-26, 3, 4], l: [0, 3, -20], fov: 38 },
  { t: 11.85, o: [-36, 4.4, -38], l: [6, 4.4, -8], fov: 32 },
  { t: 12.4, o: [-44, 6, -48], l: [15, -1.5, -18], fov: 30 },
]

// Portrait phones see a narrow horizontal slice of the same world. Pull the
// camera back and bring the subject to the centre rather than shrinking the
// desktop frame, and give the copy the lower half of the screen.
const mobileKeys: CamKey[] = desktopKeys.map((k) => {
  const ground = k.t > 5.7 && k.t < 7.5
  const pull = ground ? 1.15 : k.t < 1.4 || (k.t > 7.9 && k.t < 8.7) ? 1.2 : 1.55
  const o: [number, number, number] = [k.o[0] * pull * 0.8, k.o[1] * pull, k.o[2] * pull]
  const d = Math.hypot(o[0], o[1], o[2])
  // tilt down so the subject rides in the upper half, above the copy
  return {
    t: k.t,
    o,
    l: [k.l[0] * 0.25, k.l[1] - (ground ? 0 : d * 0.2), k.l[2]],
    fov: k.fov + 18,
  }
})

function camTrack(keys: CamKey[]) {
  const comp = (sel: (k: CamKey) => number) => pchip(keys.map((k) => [k.t, sel(k)]))
  const f = [0, 1, 2].map((i) => comp((k) => k.o[i]))
  const g = [0, 1, 2].map((i) => comp((k) => k.l[i]))
  const fov = comp((k) => k.fov)
  return (t: number) => ({
    o: [f[0](t), f[1](t), f[2](t)] as [number, number, number],
    l: [g[0](t), g[1](t), g[2](t)] as [number, number, number],
    fov: fov(t),
  })
}

export const camDesktop = camTrack(desktopKeys)
export const camMobile = camTrack(mobileKeys)

// ------------------------------------------------------------ scene state --
export const routeOpacity = (t: number) => smooth(3.85, 4.15, t) * (1 - smooth(5.5, 5.75, t))
/** Track position of the middle of a destination leg, and where its cloud gap sits. */
export const destinationGap = (id: 'flights' | 'scoreboard' | 'detection') => {
  const tm = at(id, 0.5)
  return { x: 260, s: sAt(tm) + 1300 }
}
