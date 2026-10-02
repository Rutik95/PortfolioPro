import * as THREE from 'three'
import { C, LightMode, makeLights, type LightSpec } from './lights'
import { makeNoise2D, rng } from './noise'
import { RWY_LEN, RWY_W, S_ARR, destinationGap, zOf } from './path'

type V3 = [number, number, number]
const scale = (c: V3, k: number): V3 => [c[0] * k, c[1] * k, c[2] * k]
const mix = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

export interface Tracked { start: THREE.Vector3; dir: THREE.Vector3; phase: number; speed: number; label: string }

// ------------------------------------------------------------------ city --
interface CityOpts {
  cx: number; cz: number; radius: number; seed: number; q: number
  density?: number
  exclude?: (x: number, z: number) => boolean
  towers?: number
  highways?: number
}

function city(o: CityOpts) {
  const r = rng(o.seed)
  const n = makeNoise2D(o.seed + 3, 64)
  const steady: LightSpec[] = []
  const blink: LightSpec[] = []
  const cars: LightSpec[] = []
  const ex = o.exclude ?? (() => false)
  const dens = (o.density ?? 1) * o.q
  const districts = Math.max(4, Math.round((o.radius / 1700) ** 2 * 1.4))

  for (let d = 0; d < districts; d++) {
    // Districts cluster toward the centre, the way a real city thins out.
    const a = r() * Math.PI * 2
    const rr = Math.sqrt(r()) * o.radius * 0.85
    const dx = o.cx + Math.cos(a) * rr
    const dz = o.cz + Math.sin(a) * rr
    const R = 900 + r() * 1500
    const ang = r() * Math.PI
    const sp = 85 + r() * 70
    const ca = Math.cos(ang), sa = Math.sin(ang)
    const lines = Math.ceil(R / sp)
    for (let axis = 0; axis < 2; axis++) {
      for (let j = -lines; j <= lines; j++) {
        const arterial = j % 6 === 0
        const step = arterial ? 32 : 38
        for (let u = -R; u <= R; u += step) {
          const v = j * sp
          if (u * u + v * v > R * R) continue
          const lu = axis === 0 ? u : v
          const lv = axis === 0 ? v : u
          const x = dx + lu * ca - lv * sa + (r() - 0.5) * 6
          const z = dz + lu * sa + lv * ca + (r() - 0.5) * 6
          if (ex(x, z)) continue
          const dc = Math.hypot(x - o.cx, z - o.cz) / o.radius
          const keep = (n(x / 1400, z / 1400) * 1.9 - 0.42 + (1 - dc) * 0.45) * dens
          if (r() > keep) continue
          if (arterial) {
            steady.push({ p: [x, 9, z], c: scale(C.sodium, 0.55 + r() * 0.35), size: 3.4 })
          } else {
            const led = r() < 0.32
            steady.push({ p: [x, 6, z], c: scale(led ? C.led : C.warm, 0.32 + r() * 0.3), size: 2.3 })
          }
          // a few lit windows set back from the street
          if (r() < 0.22 * dens) {
            const off = 14 + r() * 20
            steady.push({ p: [x + (r() - 0.5) * off, 4 + r() * 18, z + (r() - 0.5) * off], c: scale(r() < 0.7 ? C.window : C.windowCool, 0.35 + r() * 0.4), size: 1.6 })
          }
        }
      }
    }
  }

  // Highways: long straight runs of sodium with traffic on them.
  const hw = o.highways ?? 2
  for (let h = 0; h < hw; h++) {
    const a = r() * Math.PI
    const dir = new THREE.Vector3(Math.cos(a), 0, Math.sin(a))
    const off = (r() - 0.5) * o.radius * 0.8
    const nrm = new THREE.Vector3(-dir.z, 0, dir.x)
    const L = o.radius * 1.8
    const start = new THREE.Vector3(o.cx, 0, o.cz).addScaledVector(nrm, off).addScaledVector(dir, -L / 2)
    for (let u = 0; u < L; u += 42) {
      const p = start.clone().addScaledVector(dir, u)
      if (ex(p.x, p.z)) continue
      for (const side of [-1, 1]) {
        const q = p.clone().addScaledVector(nrm, side * 16)
        steady.push({ p: [q.x, 11, q.z], c: scale(C.sodium, 0.7), size: 3.2 })
      }
    }
    const seg = 400
    for (let u = 0; u < L; u += seg) {
      const p0 = start.clone().addScaledVector(dir, u)
      if (ex(p0.x, p0.z)) continue
      const count = Math.round(14 * o.q) + 2
      for (let k = 0; k < count; k++) {
        const fwd = k % 2 === 0
        const lane = (fwd ? 1 : -1) * (4 + (k % 3) * 3.5)
        const s = p0.clone().addScaledVector(nrm, lane)
        const vec = dir.clone().multiplyScalar(fwd ? seg : -seg)
        if (!fwd) s.addScaledVector(dir, seg)
        cars.push({ p: [s.x, 1, s.z], c: fwd ? scale(C.head, 0.9) : scale(C.tail, 0.9), size: 2.4, phase: r(), dir: [vec.x, 0, vec.z] })
      }
    }
  }

  // High-rises: vertical stacks of windows, an obstruction light on top.
  const towers = Math.round((o.towers ?? 0) * Math.max(o.q, 0.45))
  for (let t = 0; t < towers; t++) {
    const a = r() * Math.PI * 2
    const rr = Math.pow(r(), 2.2) * o.radius * 0.45
    const x = o.cx + Math.cos(a) * rr
    const z = o.cz + Math.sin(a) * rr
    if (ex(x, z)) continue
    const H = 50 + Math.pow(r(), 2) * 190
    const w = 22 + r() * 18
    const per = 2 + Math.floor(r() * 3)
    const lit = 0.1 + r() * 0.14
    const cool = r() < 0.4
    for (let f = 1; f * 3.6 < H; f++) {
      for (let face = 0; face < 4; face++) {
        for (let k = 0; k < per; k++) {
          if (r() > lit) continue
          const s = (k + 0.5) / per - 0.5
          const fx = face === 0 ? s * w : face === 1 ? w / 2 : face === 2 ? -s * w : -w / 2
          const fz = face === 0 ? w / 2 : face === 1 ? s * w : face === 2 ? -w / 2 : -s * w
          steady.push({ p: [x + fx, f * 3.6, z + fz], c: scale(cool ? C.windowCool : C.window, 0.28 + r() * 0.32), size: 1.15 })
        }
      }
    }
    blink.push({ p: [x, H + 2, z], c: C.red, size: 2.6, mode: LightMode.slowBlink, phase: r() })
  }

  return { steady, blink, cars }
}

// ---------------------------------------------------------------- runway --
function runwayTexture() {
  const c = document.createElement('canvas')
  c.width = 128; c.height = 4096
  const g = c.getContext('2d')!
  g.fillStyle = '#2a2b2d'; g.fillRect(0, 0, c.width, c.height)
  // asphalt grain
  for (let i = 0; i < 9000; i++) {
    const v = 30 + Math.random() * 22
    g.fillStyle = `rgb(${v},${v},${v + 2})`
    g.fillRect(Math.random() * 128, Math.random() * 4096, 1, 2)
  }
  const m = 4096 / RWY_LEN // px per metre along the runway
  g.fillStyle = '#b9bab6'
  // threshold piano keys, both ends
  for (const end of [0, 1]) {
    for (let k = 0; k < 8; k++) {
      const x = 8 + k * 14.5 + (k >= 4 ? 6 : 0)
      const y0 = end ? 4096 - (6 + 30) * m : 6 * m
      g.fillRect(x * (128 / 128) * 0.98, y0, 7, 30 * m)
    }
  }
  // centreline dashes
  for (let z = 80; z < RWY_LEN - 80; z += 50) g.fillRect(62, z * m, 4, 30 * m)
  // touchdown zone and aiming point, both ends
  for (const end of [0, 1]) {
    const mk = (z: number, w: number, len: number, gap: number) => {
      const y = end ? 4096 - (z + len) * m : z * m
      g.fillRect(64 - gap - w, y, w, len * m)
      g.fillRect(64 + gap, y, w, len * m)
    }
    mk(300, 12, 50, 9)
    for (const z of [150, 450, 600, 750]) mk(z, 6, 22, 12)
  }
  // edge lines
  g.fillRect(2, 0, 3, 4096); g.fillRect(123, 0, 3, 4096)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

interface RunwayOpts { zThr: number; approach?: boolean; papiDeg?: number; taxi?: boolean; apron?: boolean }

/** A runway in local space: threshold at z = zThr, running toward -Z. */
function runway(o: RunwayOpts, tex: THREE.Texture, q: number) {
  const g = new THREE.Group()
  const L = RWY_LEN, W = RWY_W, z0 = o.zThr
  const steady: LightSpec[] = []
  const flash: LightSpec[] = []

  const surf = new THREE.Mesh(
    new THREE.PlaneGeometry(W, L),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.82, metalness: 0, color: 0x9a9a9a, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 2 }),
  )
  surf.rotation.x = -Math.PI / 2
  surf.position.set(0, 0.03, z0 - L / 2)
  g.add(surf)

  for (let d = 0; d <= L; d += 60) {
    const amber = d > L - 600
    for (const sx of [-1, 1]) steady.push({ p: [sx * (W / 2 + 1.5), 0.4, z0 - d], c: amber ? C.runwayAmber : C.runway, size: 0.85 })
  }
  for (let d = 15; d < L; d += 15) {
    const left = L - d
    const red = left < 300 || (left < 900 && Math.round(d / 15) % 2 === 0)
    steady.push({ p: [0, 0.25, z0 - d], c: red ? scale(C.red, 0.8) : scale(C.runway, 0.75), size: 0.5 })
  }
  for (let x = -W / 2 - 4; x <= W / 2 + 4; x += 3) {
    steady.push({ p: [x, 0.3, z0 + 1], c: scale(C.green, 0.7), size: 0.42 })
    steady.push({ p: [x, 0.3, z0 - L - 1], c: C.red, size: 0.75 })
  }
  for (let d = 60; d <= 900; d += 30) {
    for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) steady.push({ p: [sx * (9 + k * 1.5), 0.25, z0 - d], c: scale(C.runway, 0.7), size: 0.45 })
  }

  if (o.approach) {
    // ALSF-2: centreline barrettes every 30 m out to 720 m, the 1000 ft bar,
    // red side rows in the inner 300 m, and the sequenced flashers (the
    // "rabbit") racing from the outer end toward the threshold twice a second.
    for (let d = 30; d <= 720; d += 30) {
      for (let k = -2; k <= 2; k++) steady.push({ p: [k * 1.1, 1.2 + d * 0.01, z0 + d], c: scale(C.runway, 0.9), size: 0.9 })
      if (d >= 300) flash.push({ p: [0, 2.5 + d * 0.01, z0 + d], c: C.strobe, size: 2.4, mode: LightMode.rabbit, phase: (720 - d) / 450 * 0.9 })
      if (d < 300) for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) steady.push({ p: [sx * (10 + k * 1.5), 1.2, z0 + d], c: C.red, size: 0.85 })
    }
    for (let x = -15; x <= 15; x += 1.5) if (Math.abs(x) > 3) steady.push({ p: [x, 4, z0 + 300], c: C.runway, size: 0.9 })
  }
  if (o.papiDeg) {
    const base = o.papiDeg
    const thr = [base + 0.9, base + 0.3, base - 0.3, base - 0.9]
    for (let i = 0; i < 4; i++) flash.push({ p: [-(W / 2 + 15 + i * 9), 1, z0 - 300], c: C.runway, size: 1.6, mode: LightMode.papi, phase: thr[i] * Math.PI / 180 })
  }
  if (o.taxi) {
    const tx = 190
    for (let d = -100; d <= L + 100; d += 50) {
      for (const sx of [-1, 1]) steady.push({ p: [tx + sx * 12, 0.35, z0 - d], c: C.blue, size: 0.75 })
      steady.push({ p: [tx, 0.25, z0 - d], c: scale(C.green, 0.75), size: 0.45 })
    }
    for (const d of [300, 1100, 1900, 2700, L]) {
      for (let x = W / 2 + 10; x < tx; x += 18) steady.push({ p: [x, 0.25, z0 - d], c: scale(C.green, 0.75), size: 0.45 })
    }
  }
  if (o.apron) {
    const r = rng(z0 | 0)
    // high-mast floods over the stands, and the terminal's long window line
    for (let d = 500; d <= 2600; d += 140) {
      steady.push({ p: [330 + r() * 30, 26, z0 - d], c: scale(C.sodium, 1.25), size: 5.5 })
      steady.push({ p: [560 + r() * 30, 26, z0 - d - 70], c: scale(C.sodium, 1.1), size: 5.5 })
    }
    for (let d = 600; d <= 2500; d += 6) {
      if (r() < 0.25 * Math.max(q, 0.5)) continue
      for (const h of [6, 10.5, 15]) if (r() < 0.75) steady.push({ p: [700, h, z0 - d], c: scale(r() < 0.6 ? C.window : C.windowCool, 0.9), size: 1.4 })
    }
    // parked aircraft show their own small lights
    for (let d = 650; d <= 2450; d += 120) {
      steady.push({ p: [420, 9, z0 - d], c: scale(C.red, 0.6), size: 1 })
      steady.push({ p: [470, 4, z0 - d - 10], c: scale(C.window, 1.2), size: 1.2 })
    }
  }

  g.add(makeLights(steady, { extinction: 0.00012, near: 34 }))
  if (flash.length) g.add(makeLights(flash, { extinction: 0.00008, near: 34 }))
  return g
}

// ------------------------------------------------------------ destinations --
function stadiumTexture() {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 512
  const g = c.getContext('2d')!
  for (let i = 0; i < 16; i++) {
    g.fillStyle = i % 2 ? '#2f6a33' : '#2a612e'
    g.fillRect(0, i * 32, 512, 32)
  }
  // six floodlights pool toward the middle; the boundary falls off into dark
  const grad = g.createRadialGradient(256, 256, 20, 256, 256, 256)
  grad.addColorStop(0, 'rgba(255,255,235,0.22)')
  grad.addColorStop(0.7, 'rgba(0,0,0,0.05)')
  grad.addColorStop(1, 'rgba(0,0,0,0.6)')
  g.fillStyle = grad; g.fillRect(0, 0, 512, 512)
  g.fillStyle = '#b8a27a'; g.fillRect(244, 196, 24, 120) // the pitch
  g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = 2
  g.beginPath(); g.ellipse(256, 256, 120, 150, 0, 0, Math.PI * 2); g.stroke() // 30-yard circle
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function stadium(q: number) {
  const g = new THREE.Group()
  const rx = 120, rz = 136
  const field = new THREE.Mesh(
    new THREE.CircleGeometry(1, 64),
    new THREE.MeshBasicMaterial({ map: stadiumTexture(), color: new THREE.Color(1.05, 1.1, 1.0) }),
  )
  field.rotation.x = -Math.PI / 2
  field.scale.set(rx, rz, 1)
  field.position.y = 2
  g.add(field)
  const stands = new THREE.Mesh(
    new THREE.RingGeometry(1, 1.32, 64),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.045, 0.042, 0.04) }),
  )
  stands.rotation.x = -Math.PI / 2
  stands.scale.set(rx, rz, 1)
  stands.position.y = 4
  g.add(stands)
  const r = rng(404)
  const steady: LightSpec[] = []
  const tw: LightSpec[] = []
  for (let a = 0; a < Math.PI * 2; a += 0.012) {
    if (r() < 0.35) steady.push({ p: [Math.cos(a) * rx * 1.005, 2.5, Math.sin(a) * rz * 1.005], c: scale(C.led, 0.35), size: 1.2 })
    for (let k = 0; k < 2; k++) {
      if (r() > 0.22 * Math.max(q, 0.5)) continue
      const rr = 1.05 + r() * 0.25
      tw.push({ p: [Math.cos(a) * rx * rr, 6 + r() * 14, Math.sin(a) * rz * rr], c: scale(r() < 0.5 ? C.window : C.led, 0.25 + r() * 0.35), size: 1.3, mode: LightMode.twinkle, phase: r() })
    }
  }
  // six floodlight towers, each a bank of lamps
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3
    const x = Math.cos(a) * rx * 1.42, z = Math.sin(a) * rz * 1.42
    const tx = -Math.sin(a), tz = Math.cos(a)
    for (let u = 0; u < 6; u++) for (let v = 0; v < 3; v++) {
      steady.push({ p: [x + tx * (u - 2.5) * 2.2, 55 + v * 2.2, z + tz * (u - 2.5) * 2.2], c: scale(C.flood, 0.55), size: 1.6 })
    }
  }
  g.add(makeLights(steady, { extinction: 0.00006 }))
  g.add(makeLights(tw, { extinction: 0.00006 }))
  return g
}

function highway(q: number, tracked: Tracked[], origin: THREE.Vector3) {
  const g = new THREE.Group()
  const r = rng(77)
  const steady: LightSpec[] = []
  const cars: LightSpec[] = []
  // a sweeping S through the middle of the gap
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= 24; i++) {
    const u = i / 24
    pts.push(new THREE.Vector3(Math.sin(u * Math.PI * 1.6) * 520 - 120, 0, (u - 0.5) * 5200))
  }
  const speed = 26
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1]
    const dir = b.clone().sub(a)
    const len = dir.length()
    const nd = dir.clone().normalize()
    const nrm = new THREE.Vector3(-nd.z, 0, nd.x)
    for (let u = 0; u < len; u += 40) {
      const p = a.clone().addScaledVector(nd, u)
      steady.push({ p: [p.x, 11, p.z], c: scale(C.sodium, 0.85), size: 3.4 })
      for (const side of [-1, 1]) {
        const s = p.clone().addScaledVector(nrm, side * 22)
        steady.push({ p: [s.x, 10, s.z], c: scale(C.sodium, 0.6), size: 3 })
      }
    }
    const count = Math.round(26 * Math.max(q, 0.5))
    for (let k = 0; k < count; k++) {
      const fwd = k % 2 === 0
      const lane = (fwd ? 1 : -1) * (5 + (k % 3) * 3.6)
      const s = a.clone().addScaledVector(nrm, lane)
      const vec = dir.clone().multiplyScalar(fwd ? 1 : -1)
      if (!fwd) s.add(dir)
      const phase = r()
      cars.push({ p: [s.x, 1, s.z], c: fwd ? C.head : C.tail, size: 2.6, phase, dir: [vec.x, 0, vec.z] })
      if ((i === 10 && k === 0) || (i === 13 && k === 1)) {
        tracked.push({
          start: s.clone().add(origin), dir: vec.clone(), phase, speed,
          label: k === 0 ? 'Rider · helmet' : 'Rider · no helmet · plate read',
        })
      }
    }
  }
  g.add(makeLights(steady, { extinction: 0.00006 }))
  g.add(makeLights(cars, { moving: true, speed, extinction: 0.00006 }))
  return g
}

// ------------------------------------------------------------------ world --
export function buildGround(q: number) {
  const root = new THREE.Group()
  const tracked: Tracked[] = []
  const tex = runwayTexture()

  // Ground: very dark, lit only by what is actually on it.
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    // pushed back in depth: from altitude, everything lying on the ground is
    // within a metre of it, which is below the depth buffer's resolution there
    new THREE.MeshStandardMaterial({ color: 0x0b0c0d, roughness: 1, metalness: 0, polygonOffset: true, polygonOffsetFactor: 6, polygonOffsetUnits: 6 }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.scale.set(260000, 260000, 1)
  ground.position.y = -1.2
  root.add(ground)

  // Departure: the runway, its taxiway and terminal, and a city around it with
  // a creek running down its eastern side.
  root.add(runway({ zThr: 0, taxi: true, apron: true }, tex, q))
  const creek = (x: number, z: number) => Math.abs(x - (2600 + 900 * Math.sin(z / 2300))) < 260
  const edge = makeNoise2D(9, 64)
  const ragged = (x: number, z: number) => (edge(x / 420, z / 420) - 0.5) * 360
  const depAirport = (x: number, z: number) => x > -300 + ragged(x, z) && x < 820 + ragged(z, x) && z < 450 + ragged(x, z) && z > -RWY_LEN - 700 + ragged(z, x)
  const dep = city({
    cx: -1800, cz: -6500, radius: 11000, seed: 11, q, towers: 90, highways: 3,
    exclude: (x, z) => depAirport(x, z) || creek(x, z),
  })

  // Arrival: a bigger city under the approach, with the sea to the east and a
  // necklace of streetlights along the shore.
  const zA = zOf(S_ARR)
  const shore = (z: number) => 5200 + 1400 * Math.sin((z - zA) / 3100)
  const arrAirport = (x: number, z: number) => x > -300 + ragged(x, z) && x < 820 + ragged(z, x) && z < zA + 700 + ragged(x, z) && z > zA - RWY_LEN - 600 + ragged(z, x)
  const approachPath = (x: number, z: number) => Math.abs(x) < 120 && z > zA && z < zA + 900
  const arr = city({
    cx: -2600, cz: zA - 1500, radius: 14000, seed: 23, q, towers: 120, highways: 4,
    exclude: (x, z) => x > shore(z) || arrAirport(x, z) || approachPath(x, z),
  })
  const necklace: LightSpec[] = []
  for (let z = zA + 15000; z > zA - 12000; z -= 30) {
    necklace.push({ p: [shore(z) - 20, 10, z], c: scale(C.sodium, 0.95), size: 3.6 })
  }
  const arrRwy = runway({ zThr: zA, approach: true, papiDeg: 6.5, taxi: true, apron: true }, tex, q)
  root.add(arrRwy)

  // Destinations, each sitting under its own gap in the cloud deck.
  const patches: ReturnType<typeof city>[] = []
  const dests: Record<string, THREE.Vector3> = {}
  for (const [id, seed] of [['flights', 31], ['scoreboard', 37], ['detection', 41]] as const) {
    const gp = destinationGap(id)
    const c = new THREE.Vector3(gp.x, 0, zOf(gp.s))
    dests[id] = c
    const keep = id === 'flights'
      ? (x: number, z: number) => Math.abs(x - c.x) < 1500 && Math.abs(z - c.z) < 1900
      : id === 'scoreboard'
        ? (x: number, z: number) => Math.hypot(x - c.x, z - c.z) < 380
        : (x: number, z: number) => Math.abs(x - c.x + 120) < 650 && Math.abs(z - c.z) < 2700
    patches.push(city({ cx: c.x, cz: c.z, radius: 4200, seed, q: Math.min(q * 1.4, 1.4), density: 1.15, towers: 25, highways: 1, exclude: keep }))
  }
  {
    const c = dests.flights
    const a = new THREE.Group()
    a.position.copy(c)
    const r1 = runway({ zThr: 1600, taxi: true, apron: true }, tex, q)
    a.add(r1)
    const r2 = runway({ zThr: 1500 }, tex, q)
    r2.rotation.y = 0.82
    r2.position.set(-500, 0, -300)
    a.add(r2)
    a.rotation.y = -0.35
    root.add(a)
  }
  {
    const s = stadium(q)
    s.position.copy(dests.scoreboard)
    root.add(s)
  }
  {
    const h = highway(q, tracked, dests.detection)
    h.position.copy(dests.detection)
    root.add(h)
  }

  const all = [dep, arr, ...patches]
  root.add(makeLights(all.flatMap((c) => c.steady).concat(necklace), { extinction: 0.00009, intensity: 0.8 }))
  root.add(makeLights(all.flatMap((c) => c.blink), { extinction: 0.00004 }))
  root.add(makeLights(all.flatMap((c) => c.cars), { moving: true, speed: 24, extinction: 0.00005 }))

  return { root, ground, tracked, dests }
}
