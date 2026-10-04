import * as THREE from 'three'
import { C, LightMode, makeLights, type LightSpec } from './lights'

// A narrow-body twin, built from an A320's real proportions (37.6 m long,
// 35.8 m span, 3.95 m fuselage). Every surface is lofted from real sections:
// the fuselage from its crown, keel and width along the length, the wings,
// tail and pylons from airfoils, the nacelles from a CFM-style profile. At
// night an airliner is read by its lights and by the moonlight on its skin,
// so the skin gets the detail: clearcoat paint, panel seams in a normal map,
// doors, lit cabin windows, the flight deck glazing, bare-metal leading edges.

const LEN = 37.6
const R = 1.98
const CY = 3.6 // fuselage centreline height with the gear down
const DIH = 0.085 // wing dihedral, rad
const NOSE = 0.138 // nose section, fraction of length
const TAIL = 0.66 // tail cone starts here

type V3 = [number, number, number]

// deterministic, so the posters and the live scene light the same windows
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---------------------------------------------------------------- fuselage --

/** Crown, keel and half-width (m, from the centreline) at a fraction along the length. */
function section(u: number) {
  if (u < NOSE) {
    // radome tip sits below the centreline; the crown climbs to the flight deck
    const k = u / NOSE
    const tip = -0.45
    return {
      top: tip + (2.02 - tip) * Math.pow(1 - Math.pow(1 - k, 2.0), 0.75),
      bot: tip - (tip + 1.98) * Math.pow(1 - Math.pow(1 - k, 2.2), 0.6),
      w: R * Math.pow(1 - Math.pow(1 - k, 2.2), 0.55),
    }
  }
  if (u > TAIL) {
    // the keel sweeps up much faster than the crown drops, ending at the APU
    const k = (u - TAIL) / (1 - TAIL)
    return { top: 2.02 - 0.55 * Math.pow(k, 1.8), bot: -1.98 + 3.05 * Math.pow(k, 1.5), w: 0.22 + (R - 0.22) * (1 - Math.pow(k, 1.3)) }
  }
  return { top: 2.02, bot: -1.98, w: R }
}

function fuselageGeometry(M: number, N: number) {
  const pos = new Float32Array((M + 1) * (N + 1) * 3)
  const uv = new Float32Array((M + 1) * (N + 1) * 2)
  for (let i = 0; i <= M; i++) {
    const t = i / M
    // denser at the nose and tail, where the shape changes fastest
    const u = 0.7 * t + 0.3 * (0.5 - 0.5 * Math.cos(Math.PI * t))
    const s = section(u)
    const yc = (s.top + s.bot) / 2
    const b = (s.top - s.bot) / 2
    const z = -LEN / 2 + u * LEN
    for (let k = 0; k <= N; k++) {
      // v = 0.25 is the belly, 0.5 the right side, 0.75 the crown, 0/1 the left
      const th = -Math.PI + (2 * Math.PI * k) / N
      const j = i * (N + 1) + k
      pos[j * 3] = s.w * Math.cos(th)
      pos[j * 3 + 1] = yc + b * Math.sin(th)
      pos[j * 3 + 2] = z
      uv[j * 2] = u
      uv[j * 2 + 1] = k / N
    }
  }
  const idx: number[] = []
  for (let i = 0; i < M; i++) for (let k = 0; k < N; k++) {
    const a = i * (N + 1) + k, b = a + 1, c = a + N + 1, d = c + 1
    idx.push(a, b, c, b, d, c)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  g.setIndex(idx)
  g.computeVertexNormals()
  // weld the shading across the seam on the left side, and point the radome tip forward
  const n = g.attributes.normal as THREE.BufferAttribute
  for (let i = 0; i <= M; i++) {
    const a = i * (N + 1), b = a + N
    const x = n.getX(a) + n.getX(b), y = n.getY(a) + n.getY(b), z = n.getZ(a) + n.getZ(b)
    const l = Math.hypot(x, y, z) || 1
    n.setXYZ(a, x / l, y / l, z / l); n.setXYZ(b, x / l, y / l, z / l)
  }
  for (let k = 0; k <= N; k++) n.setXYZ(k, 0, 0, -1)
  return g
}

/** A height canvas to a tangent-space normal map (rows run with v: the canvas is not flipped). */
function normalFrom(c: HTMLCanvasElement, strength: number) {
  const w = c.width, h = c.height
  const src = c.getContext('2d')!.getImageData(0, 0, w, h).data
  const out = document.createElement('canvas')
  out.width = w; out.height = h
  const o = out.getContext('2d')!
  const img = o.createImageData(w, h)
  const d = img.data
  for (let y = 0; y < h; y++) {
    const yu = Math.max(y - 1, 0) * w, yd = Math.min(y + 1, h - 1) * w, yr = y * w
    for (let x = 0; x < w; x++) {
      const xl = Math.max(x - 1, 0), xr = Math.min(x + 1, w - 1)
      const dx = ((src[(yr + xr) * 4] - src[(yr + xl) * 4]) / 255) * strength
      const dy = ((src[(yd + x) * 4] - src[(yu + x) * 4]) / 255) * strength
      const l = Math.hypot(dx, dy, 1)
      const i = (yr + x) * 4
      d[i] = (-dx / l * 0.5 + 0.5) * 255
      d[i + 1] = (-dy / l * 0.5 + 0.5) * 255
      d[i + 2] = (1 / l * 0.5 + 0.5) * 255
      d[i + 3] = 255
    }
  }
  o.putImageData(img, 0, 0)
  return tex(out, false)
}

function tex(c: HTMLCanvasElement, srgb: boolean, flipY = false) {
  const t = new THREE.CanvasTexture(c)
  t.flipY = flipY
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
  t.anisotropy = 8
  return t
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  return [c, c.getContext('2d')!] as const
}

function fuselageTextures(W: number, H: number) {
  const [base, b] = canvas(W, H)
  const [emi, e] = canvas(W, H)
  const [hgt, h] = canvas(W, H)
  const [rgh, r] = canvas(W, H)
  const rand = rng(7)
  const X = (u: number) => u * W
  // an angle round the fuselage (deg, 0 = right side, 90 = crown) to a row
  const Y = (deg: number) => ((((deg + 180) % 360) + 360) % 360 / 360) * H
  // a feature at angle a on the right sits at 180 - a on the left
  const both = (a: number) => [a, 180 - a]
  const px = W / 4096 // scale for line widths

  b.fillStyle = '#edeff0'; b.fillRect(0, 0, W, H)
  e.fillStyle = '#000'; e.fillRect(0, 0, W, H)
  h.fillStyle = 'rgb(128,128,128)'; h.fillRect(0, 0, W, H)
  r.fillStyle = 'rgb(0,92,0)'; r.fillRect(0, 0, W, H) // G: roughness 0.36

  // belly: a light grey band, soft-edged, from -38 deg round to -142 deg
  {
    const y0 = Y(-142), y1 = Y(-38)
    const g = b.createLinearGradient(0, y0 - 6 * px, 0, y1 + 6 * px)
    const f = (6 * px) / (y1 - y0 + 12 * px)
    g.addColorStop(0, 'rgba(190,195,200,0)'); g.addColorStop(f, '#bec3c8')
    g.addColorStop(1 - f, '#bec3c8'); g.addColorStop(1, 'rgba(190,195,200,0)')
    b.fillStyle = g; b.fillRect(0, y0 - 6 * px, W, y1 - y0 + 12 * px)
    r.fillStyle = 'rgb(0,110,0)'; r.fillRect(0, y0, W, y1 - y0)
  }
  // one slim line under the windows; the only livery the aircraft has
  for (const a of both(-4.5)) {
    b.fillStyle = '#23272d'
    b.fillRect(X(0.105), Y(a) - 1.4 * px, X(0.6), 2.8 * px)
  }

  // panel seams: circumferential splices and longitudinal lap joints
  h.strokeStyle = 'rgb(70,70,70)'; h.lineWidth = 1.6 * px
  b.strokeStyle = 'rgba(70,76,84,0.10)'; b.lineWidth = 1 * px
  for (const u of [0.052, 0.155, 0.235, 0.31, 0.39, 0.475, 0.555, 0.62, 0.69, 0.75, 0.82, 0.9, 0.955]) {
    for (const c of [h, b]) { c.beginPath(); c.moveTo(X(u), 0); c.lineTo(X(u), H); c.stroke() }
  }
  for (const a of [28, 62, 118, 152, -28, -62, -118, -152, 90, -90]) {
    for (const c of [h, b]) { c.beginPath(); c.moveTo(X(0.05), Y(a)); c.lineTo(X(0.96), Y(a)); c.stroke() }
  }
  // fainter frame lines between the splices
  h.strokeStyle = 'rgb(108,108,108)'; h.lineWidth = 1 * px
  for (let u = 0.16; u < 0.9; u += 0.0141) { h.beginPath(); h.moveTo(X(u), Y(-150)); h.lineTo(X(u), Y(-30)); h.stroke() }

  const rr = (c: CanvasRenderingContext2D, x: number, y: number, w: number, hh: number, rad: number) => {
    c.beginPath(); c.roundRect(x - w / 2, y - hh / 2, w, hh, rad)
  }

  // doors: L1/R1, the overwing exits, L4/R4, each with its small window
  const door = (u: number, wM: number, a0: number, a1: number, win: boolean) => {
    for (const side of [0, 1]) {
      const lo = side ? 180 - a1 : a0, hi = side ? 180 - a0 : a1
      const y0 = Y(lo), y1 = Y(hi)
      const w = (wM / LEN) * W
      for (const [c, col, lw] of [[h, 'rgb(60,60,60)', 2.4], [b, 'rgba(58,64,72,0.55)', 1.6]] as const) {
        c.strokeStyle = col; c.lineWidth = lw * px
        c.beginPath(); c.roundRect(X(u) - w / 2, Math.min(y0, y1), w, Math.abs(y1 - y0), 7 * px); c.stroke()
      }
      if (win) {
        const yy = Y(side ? 180 - 10 : 10)
        b.fillStyle = '#16191d'; rr(b, X(u), yy, 13 * px, 18 * px, 5 * px); b.fill()
        e.fillStyle = 'rgba(255,214,150,0.55)'; rr(e, X(u), yy, 11 * px, 15 * px, 5 * px); e.fill()
      }
    }
  }
  door(0.128, 0.81, -24, 31, true)
  door(0.778, 0.81, -24, 31, true)
  door(0.445, 0.51, -9, 21, false)
  door(0.461, 0.51, -9, 21, false)
  // cargo doors, right side only
  for (const [u, wM] of [[0.27, 1.8], [0.62, 1.8]] as const) {
    const w = (wM / LEN) * W
    for (const [c, col] of [[h, 'rgb(64,64,64)'], [b, 'rgba(58,64,72,0.45)']] as const) {
      c.strokeStyle = col; c.lineWidth = 1.8 * px
      c.beginPath(); c.roundRect(X(u) - w / 2, Y(-58), w, Y(-26) - Y(-58), 6 * px); c.stroke()
    }
  }

  // cabin windows, both sides: 0.25 x 0.37 m on a 0.53 m pitch
  const ww = (0.25 / LEN) * W, wh = (0.37 / (2 * Math.PI * R)) * H
  for (let u = 0.168; u < 0.712; u += 0.0141) {
    if (u > 0.432 && u < 0.472) continue // overwing exits
    for (const a of both(6)) {
      const x = X(u), y = Y(a)
      h.fillStyle = 'rgb(84,84,84)'; rr(h, x, y, ww + 3 * px, wh + 3 * px, ww * 0.42); h.fill()
      b.fillStyle = '#b4b9be'; rr(b, x, y, ww + 3 * px, wh + 3 * px, ww * 0.45); b.fill()
      b.fillStyle = '#121519'; rr(b, x, y, ww, wh, ww * 0.42); b.fill()
      r.fillStyle = 'rgb(0,18,0)'; rr(r, x, y, ww, wh, ww * 0.42); r.fill()
      const lit = rand()
      if (lit > 0.12) {
        const k = 0.65 + rand() * 0.35
        e.fillStyle = `rgba(255,${196 + rand() * 30},${128 + rand() * 34},${k})`
        rr(e, x, y, ww * 0.88, wh * 0.88, ww * 0.4); e.fill()
      }
    }
  }

  // flight deck glazing: two windscreens, two side windows each side
  const panes: [number, number][][] = [
    [[0.0555, 62], [0.0742, 57], [0.0742, 88.8], [0.0575, 88.8]],
    [[0.0758, 56.5], [0.0858, 52.5], [0.0858, 27], [0.0758, 30]],
    [[0.0874, 52], [0.0965, 49], [0.0965, 25], [0.0874, 26.5]],
  ]
  for (const side of [0, 1]) {
    for (const p of panes) {
      const pts = p.map(([u, a]) => [X(u), Y(side ? 180 - a : a)] as const)
      const poly = (c: CanvasRenderingContext2D) => { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath() }
      b.strokeStyle = '#2b2f34'; b.lineWidth = 5 * px; poly(b); b.stroke()
      b.fillStyle = '#0a0c0f'; poly(b); b.fill()
      h.strokeStyle = 'rgb(60,60,60)'; h.lineWidth = 3 * px; poly(h); h.stroke()
      r.fillStyle = 'rgb(0,10,0)'; poly(r); r.fill()
      e.fillStyle = 'rgba(40,110,96,0.22)'; poly(e); e.fill()
    }
  }

  // weathering: a little exhaust grime at the tail, streaks off the belly
  for (let i = 0; i < 70; i++) {
    const u = 0.15 + rand() * 0.8
    const a = -150 + rand() * 120
    b.fillStyle = `rgba(70,62,52,${0.015 + rand() * 0.03})`
    b.fillRect(X(u), Y(a), X(0.02 + rand() * 0.08), 2 * px + rand() * 4 * px)
  }
  {
    const g = b.createLinearGradient(X(0.92), 0, X(1), 0)
    g.addColorStop(0, 'rgba(60,55,50,0)'); g.addColorStop(1, 'rgba(60,55,50,0.35)')
    b.fillStyle = g; b.fillRect(X(0.92), 0, X(0.08), H)
  }
  // roughness breakup, so the clearcoat highlight is not a perfect mirror
  for (let i = 0; i < 900; i++) {
    r.fillStyle = `rgba(0,${80 + rand() * 40},0,0.18)`
    r.fillRect(rand() * W, rand() * H, 20 * px + rand() * 90 * px, 6 * px + rand() * 26 * px)
  }

  return { map: tex(base, true), emissiveMap: tex(emi, true), normalMap: normalFrom(hgt, 2.4), roughnessMap: tex(rgh, false) }
}

// ----------------------------------------------------------------- lofting --

interface Station { o: V3; c: number; t: number; inc?: number }

const thick = (x: number) => 5 * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4)
const camberAt = (x: number, m: number, p = 0.42) => (m === 0 ? 0 : x < p ? (m / (p * p)) * (2 * p * x - x * x) : (m / ((1 - p) ** 2)) * (1 - 2 * p + 2 * p * x - x * x))

/**
 * A lifting surface lofted through airfoil sections. Each station is its
 * leading-edge point, chord and thickness ratio; the chord runs aft (+Z) and
 * the thickness grows along chord x span. UVs are (chord fraction, span
 * fraction). Group 0 is the +normal ("upper") side, group 1 the other.
 */
function loft(st: Station[], P: number, camber = 0) {
  const ring = 2 * P + 1
  const prof: { x: number; y: number; up: boolean }[] = []
  for (let k = 0; k < ring; k++) {
    const up = k <= P
    const j = up ? P - k : k - P
    const x = (1 - Math.cos((Math.PI * j) / P)) / 2
    prof.push({ x, y: camberAt(x, camber) + (up ? 1 : -1) * thick(x), up })
  }
  const n = st.length
  const len = [0]
  for (let i = 1; i < n; i++) len.push(len[i - 1] + Math.hypot(st[i].o[0] - st[i - 1].o[0], st[i].o[1] - st[i - 1].o[1], st[i].o[2] - st[i - 1].o[2]))
  const L = len[n - 1]
  const pos = new Float32Array((n * ring + 1) * 3)
  const uv = new Float32Array((n * ring + 1) * 2)
  const S = new THREE.Vector3(), D = new THREE.Vector3(), N = new THREE.Vector3()
  for (let i = 0; i < n; i++) {
    const a = st[Math.max(i - 1, 0)].o, b = st[Math.min(i + 1, n - 1)].o
    S.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize()
    const inc = st[i].inc ?? 0
    // the chord stays streamwise however the leading edge is swept
    D.set(0, -Math.sin(inc), Math.cos(inc))
    N.crossVectors(D, S).normalize()
    const { o, c, t } = st[i]
    for (let k = 0; k < ring; k++) {
      const p = prof[k]
      const yy = (p.y - camberAt(p.x, camber)) * t + camberAt(p.x, camber)
      const j = i * ring + k
      pos[j * 3] = o[0] + (D.x * p.x + N.x * yy) * c
      pos[j * 3 + 1] = o[1] + (D.y * p.x + N.y * yy) * c
      pos[j * 3 + 2] = o[2] + (D.z * p.x + N.z * yy) * c
      uv[j * 2] = p.x
      uv[j * 2 + 1] = len[i] / L
    }
  }
  // tip cap, fanned from the centre of the last section
  const cIdx = n * ring
  {
    let x = 0, y = 0, z = 0
    for (let k = 0; k < ring; k++) { const j = (n - 1) * ring + k; x += pos[j * 3]; y += pos[j * 3 + 1]; z += pos[j * 3 + 2] }
    pos[cIdx * 3] = x / ring; pos[cIdx * 3 + 1] = y / ring; pos[cIdx * 3 + 2] = z / ring
    uv[cIdx * 2] = 0.5; uv[cIdx * 2 + 1] = 1
  }
  const upper: number[] = [], lower: number[] = []
  for (let i = 0; i < n - 1; i++) for (let k = 0; k < ring - 1; k++) {
    const a = i * ring + k, b = a + 1, c = a + ring, d = c + 1
    ;(k < P ? upper : lower).push(a, c, b, b, c, d)
  }
  for (let k = 0; k < ring - 1; k++) upper.push(cIdx, (n - 1) * ring + k + 1, (n - 1) * ring + k)
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  g.setIndex([...upper, ...lower])
  g.addGroup(0, upper.length, 0)
  g.addGroup(upper.length, lower.length, 1)
  g.computeVertexNormals()
  return g
}

/** The port-side twin of a starboard part: mirrored in X, winding reversed. */
function mirrorX(src: THREE.BufferGeometry) {
  const g = src.clone()
  g.scale(-1, 1, 1)
  const ix = g.index!
  for (let i = 0; i < ix.count; i += 3) { const t = ix.getX(i + 1); ix.setX(i + 1, ix.getX(i + 2)); ix.setX(i + 2, t) }
  g.computeVertexNormals()
  return g
}

function lathe(pts: [number, number][], seg = 72) {
  const g = new THREE.LatheGeometry(pts.map(([r, z]) => new THREE.Vector2(r, z)), seg)
  g.rotateX(Math.PI / 2) // lathe axis +Y -> +Z, so the profile runs aft
  return g
}

// ------------------------------------------------------------------ wings --

// Planform (starboard, x outboard, m): a straight 26 deg leading edge, an
// unswept inboard trailing edge to the kink at the engine, swept beyond.
const WING_TIP = 16.85
const zLE = (x: number) => -4.6 + x * 0.49
const zTE = (x: number) => (x < 6.3 ? 3.0 + (0.2 / 6.3) * x : 3.2 + ((x - 6.3) * (zLE(WING_TIP) + 1.45 - 3.2)) / (WING_TIP - 6.3))
const wingY = (x: number) => CY - 1.15 + x * Math.tan(DIH)

function wingStations(): { st: Station[]; vSharklet: number } {
  const st: Station[] = []
  const xs = [0, 2, 4.2, 6.3, 9, 12, 14.6, WING_TIP]
  for (const x of xs) {
    const f = x / WING_TIP
    st.push({
      o: [x, wingY(x), zLE(x)],
      c: zTE(x) - zLE(x),
      t: x < 6.3 ? 0.15 - (0.03 * x) / 6.3 : 0.12 - (0.02 * (x - 6.3)) / (WING_TIP - 6.3),
      inc: (2.5 - 3 * f) * (Math.PI / 180),
    })
  }
  // the blended sharklet: the tip turns up through a short radius, 2.4 m tall
  const x0 = WING_TIP, y0 = wingY(WING_TIP), z0 = zLE(WING_TIP)
  const sh: [number, number, number, number, number][] = [
    [0.22, 0.05, 0.12, 1.32, 0.1], [0.42, 0.22, 0.3, 1.15, 0.095], [0.55, 0.5, 0.5, 0.98, 0.09],
    [0.62, 0.9, 0.78, 0.85, 0.09], [0.72, 1.75, 1.35, 0.62, 0.085], [0.8, 2.4, 1.8, 0.42, 0.08],
  ]
  for (const [dx, dy, dz, c, t] of sh) st.push({ o: [x0 + dx, y0 + dy, z0 + dz], c, t })
  let total = 0, toTip = 0
  for (let i = 1; i < st.length; i++) {
    const d = Math.hypot(st[i].o[0] - st[i - 1].o[0], st[i].o[1] - st[i - 1].o[1], st[i].o[2] - st[i - 1].o[2])
    total += d
    if (i < xs.length) toTip += d
  }
  return { st, vSharklet: toTip / total }
}

/** Grey wing or tailplane skin: bare-metal leading edge, hinge lines, spoiler and flap panels. */
function surfaceTextures(W: number, H: number, o: { hinge: number; spoilers?: [number, number]; flaps?: [number, number][]; aileron?: [number, number]; white?: number }) {
  const [base, b] = canvas(W, H)
  const [hgt, h] = canvas(W, H)
  const [orm, m] = canvas(W, H) // G roughness, B metalness
  const X = (u: number) => u * W
  const Y = (v: number) => v * H
  const px = W / 1024
  b.fillStyle = '#c8ccd0'; b.fillRect(0, 0, W, H)
  h.fillStyle = 'rgb(128,128,128)'; h.fillRect(0, 0, W, H)
  m.fillStyle = 'rgb(0,142,0)'; m.fillRect(0, 0, W, H)
  // leading-edge slats, bare metal
  b.fillStyle = '#b3b8be'; b.fillRect(0, 0, X(0.085), H)
  m.fillStyle = 'rgb(0,100,115)'; m.fillRect(0, 0, X(0.085), H)
  const line = (x0: number, y0: number, x1: number, y1: number, depth = 66, col = 'rgba(70,76,84,0.35)') => {
    h.strokeStyle = `rgb(${depth},${depth},${depth})`; h.lineWidth = 2 * px
    h.beginPath(); h.moveTo(X(x0), Y(y0)); h.lineTo(X(x1), Y(y1)); h.stroke()
    b.strokeStyle = col; b.lineWidth = 1.2 * px
    b.beginPath(); b.moveTo(X(x0), Y(y0)); b.lineTo(X(x1), Y(y1)); b.stroke()
  }
  const top = o.white ?? 1
  line(0.088, 0, 0.088, top)
  for (let v = 0.12; v < top; v += 0.13) line(0, v, 0.088, v, 80)
  line(o.hinge, 0.04, o.hinge, top * 0.9)
  if (o.spoilers) {
    const [a, z] = o.spoilers
    b.fillStyle = '#bfc3c8'; b.fillRect(X(0.6), Y(a), X(o.hinge - 0.6), Y(z - a))
    line(0.6, a, 0.6, z)
    for (let v = a; v <= z + 1e-6; v += (z - a) / 5) line(0.6, v, o.hinge, v)
  }
  for (const [a, z] of o.flaps ?? []) { line(o.hinge, a, 1, a); line(o.hinge, z, 1, z) }
  if (o.aileron) { line(o.hinge, o.aileron[0], 1, o.aileron[0]); line(o.hinge, o.aileron[1], 1, o.aileron[1]) }
  // spanwise skin seams and a few access panels
  for (const u of [0.25, 0.42]) line(u, 0.05, u, top * 0.95, 96, 'rgba(70,76,84,0.12)')
  const rand = rng(3)
  for (let i = 0; i < 26; i++) {
    const u = 0.2 + rand() * 0.35, v = 0.08 + rand() * top * 0.8
    h.strokeStyle = 'rgb(96,96,96)'; h.lineWidth = 1.2 * px
    h.strokeRect(X(u), Y(v), 22 * px, 14 * px)
  }
  if (o.white !== undefined) {
    // the sharklet is painted like the fuselage
    b.fillStyle = '#eceeef'; b.fillRect(X(0.085), Y(o.white), W, H)
    m.fillStyle = 'rgb(0,92,0)'; m.fillRect(X(0.085), Y(o.white), W, H)
  }
  return { map: tex(base, true), normalMap: normalFrom(hgt, 2), roughnessMap: tex(orm, false), metalnessMap: tex(orm, false) }
}

// --------------------------------------------------------------- the fin --

const FIN: [number, number, number, number][] = [
  // height above the centreline, leading edge z, chord, thickness ratio
  [1.45, 10.2, 8.3, 0.05], [1.9, 11.1, 7.35, 0.075], [2.3, 12.0, 6.4, 0.1],
  [5.0, 14.29, 4.55, 0.1], [7.85, 16.7, 2.6, 0.1],
]
const FIN_Z = [10.2, 19.4]
const FIN_H = [1.45, 7.9]

function finTexture(starboard: boolean) {
  const W = 1024
  const H = Math.round((W * (FIN_H[1] - FIN_H[0])) / (FIN_Z[1] - FIN_Z[0]))
  const [c, g] = canvas(W, H)
  const X = (z: number) => ((z - FIN_Z[0]) / (FIN_Z[1] - FIN_Z[0])) * W
  const Y = (hh: number) => (1 - (hh - FIN_H[0]) / (FIN_H[1] - FIN_H[0])) * H
  // seen from the right, the tail is on the viewer's left: draw it mirrored
  if (starboard) { g.translate(W, 0); g.scale(-1, 1) }
  g.fillStyle = '#eceeef'; g.fillRect(0, 0, W, H)
  // rudder hinge and the tip cap seam
  g.strokeStyle = 'rgba(60,66,74,0.35)'; g.lineWidth = 2
  g.beginPath()
  FIN.slice(2).forEach(([hh, z, ch], i) => (i ? g.lineTo(X(z + ch * 0.7), Y(hh)) : g.moveTo(X(z + ch * 0.7), Y(hh))))
  g.stroke()
  g.beginPath(); g.moveTo(X(16.2), Y(7.55)); g.lineTo(X(19.4), Y(7.55)); g.stroke()
  // a bare-metal leading edge
  g.strokeStyle = 'rgba(160,166,172,0.9)'; g.lineWidth = 7
  g.beginPath()
  FIN.slice(2).forEach(([hh, z], i) => (i ? g.lineTo(X(z) + 4, Y(hh)) : g.moveTo(X(z) + 4, Y(hh))))
  g.stroke()
  // the tail mark: initials, set in the display face
  g.fillStyle = '#1e2329'
  g.font = `700 ${Math.round(H * 0.34)}px "Archivo Variable", "Archivo", system-ui, sans-serif`
  g.textAlign = 'center'; g.textBaseline = 'middle'
  g.save(); g.translate(X(15.9), Y(4.55)); g.rotate(-0.06); g.fillText('RT', 0, 0); g.restore()
  return tex(c, true, true)
}

// ----------------------------------------------------------------- engine --

const NAC_Z = -2.0 // inlet plane, relative to the engine origin

function engineParts(m: Record<string, THREE.Material>) {
  const e = new THREE.Group()
  const at = (g: THREE.BufferGeometry) => g.translate(0, 0, NAC_Z)
  // inlet lip, polished
  e.add(new THREE.Mesh(at(lathe([[0.835, 0.12], [0.845, 0.05], [0.87, 0.008], [0.905, 0], [0.94, 0.012], [0.97, 0.05], [0.988, 0.11]], 96)), m.lip))
  // fan cowl and thrust reverser sleeve
  e.add(new THREE.Mesh(at(lathe([[0.988, 0.11], [1.02, 0.35], [1.045, 0.8], [1.048, 1.4], [1.025, 2.0], [0.975, 2.6], [0.9, 3.05], [0.83, 3.4], [0.79, 3.42]], 96)), m.cowl))
  // reverser seam
  e.add(new THREE.Mesh(at(lathe([[1.049, 1.6], [1.049, 1.62]], 96)), m.duct))
  // intake duct
  e.add(new THREE.Mesh(at(lathe([[0.79, 0.64], [0.805, 0.35], [0.835, 0.12]], 96)), m.duct))
  // bypass duct and core cowl
  e.add(new THREE.Mesh(at(lathe([[0.79, 3.42], [0.76, 2.6], [0.72, 2.4]], 96)), m.duct))
  e.add(new THREE.Mesh(at(lathe([[0.7, 2.9], [0.66, 3.4], [0.58, 3.85], [0.5, 4.2], [0.465, 4.32]], 96)), m.core))
  // core nozzle and plug
  e.add(new THREE.Mesh(at(lathe([[0.465, 4.32], [0.42, 4.33], [0.39, 4.26]], 96)), m.hot))
  e.add(new THREE.Mesh(at(lathe([[0.39, 4.1], [0.38, 4.3], [0.33, 4.55], [0.22, 4.8], [0.08, 4.97], [0.0, 5.0]], 64)), m.hot))
  // fan: spinner, blades, and the dark disc behind them
  e.add(new THREE.Mesh(at(lathe([[0.0, 0.22], [0.09, 0.3], [0.17, 0.42], [0.23, 0.56], [0.26, 0.66]], 48)), m.spinner))
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.8, 48), m.fanDisc)
  disc.position.z = NAC_Z + 0.78
  disc.rotation.y = Math.PI
  e.add(disc)
  {
    const n = 22, pos: number[] = []
    for (let j = 0; j < n; j++) {
      const a = (j / n) * Math.PI * 2
      const corner = (r: number, side: number, pitch: number) => {
        const ta = a + (side * 0.13) / r * Math.cos(pitch)
        return [r * Math.cos(ta), r * Math.sin(ta), NAC_Z + 0.66 + side * 0.15 * Math.sin(pitch)]
      }
      const r0 = 0.27, r1 = 0.79
      const A = corner(r0, -1, 0.95), B = corner(r0, 1, 0.95), Cc = corner(r1, -1, 0.45), Dd = corner(r1, 1, 0.45)
      pos.push(...A, ...Cc, ...B, ...B, ...Cc, ...Dd)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.computeVertexNormals()
    e.add(new THREE.Mesh(g, m.blades))
  }
  return e
}

// ------------------------------------------------------------------- gear --

function wheelGeometry(r: number, w: number) {
  const ri = r * 0.56, hw = w / 2, cr = w * 0.32
  const pts: [number, number][] = [[ri, -hw]]
  for (let i = 0; i <= 6; i++) { const a = -Math.PI / 2 + (i / 6) * (Math.PI / 2); pts.push([r - cr + Math.cos(a) * cr, -hw + cr + Math.sin(a) * cr]) }
  for (let i = 0; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2); pts.push([r - cr + Math.cos(a) * cr, hw - cr + Math.sin(a) * cr]) }
  pts.push([ri, hw])
  const g = new THREE.LatheGeometry(pts.map(([a, b]) => new THREE.Vector2(a, b)), 40)
  g.rotateZ(Math.PI / 2) // axle along X
  return g
}

function rod(m: THREE.Material, r: number, a: V3, b: V3) {
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b)
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, va.distanceTo(vb), 16), m)
  mesh.position.copy(va).add(vb).multiplyScalar(0.5)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize())
  return mesh
}

// --------------------------------------------------------------- assembly --

export interface AircraftControls {
  group: THREE.Group
  /** Positions (aircraft-local) worth tracking: engines for the contrail. */
  engines: THREE.Vector3[]
  update(time: number, s: { gear: number; landingLights: number; strobes: number; beacon: number; taxiLight: number }, cam: THREE.Vector3): void
}

export function buildAircraft(opts: { hd?: boolean } = {}): AircraftControls {
  const hd = opts.hd ?? true
  const group = new THREE.Group()
  const body = new THREE.Group() // pitch/roll pivot sits at the main gear
  group.add(body)

  const phys = (p: THREE.MeshPhysicalMaterialParameters) => new THREE.MeshPhysicalMaterial(p)
  const fusTex = fuselageTextures(hd ? 4096 : 2048, hd ? 1024 : 512)
  const paint = phys({
    map: fusTex.map, normalMap: fusTex.normalMap, normalScale: new THREE.Vector2(0.55, 0.55),
    roughnessMap: fusTex.roughnessMap, roughness: 1, metalness: 0,
    emissiveMap: fusTex.emissiveMap, emissive: new THREE.Color(1.6, 1.25, 0.85),
    clearcoat: 0.65, clearcoatRoughness: 0.14,
  })
  const white = phys({ color: 0xeceeef, roughness: 0.36, metalness: 0, clearcoat: 0.55, clearcoatRoughness: 0.16, side: THREE.DoubleSide })
  const belly = phys({ color: 0xbec3c8, roughness: 0.44, metalness: 0, clearcoat: 0.3, clearcoatRoughness: 0.25, side: THREE.DoubleSide })
  const std = (color: number, metalness: number, roughness: number) => new THREE.MeshStandardMaterial({ color, metalness, roughness, side: THREE.DoubleSide })
  const m = {
    lip: std(0xd3d7db, 1, 0.16),
    cowl: white,
    duct: std(0x3b3f45, 0.35, 0.6),
    core: std(0x7b8087, 0.85, 0.3),
    hot: std(0x3d3935, 0.7, 0.45),
    spinner: std(0x34373c, 0.75, 0.22),
    fanDisc: std(0x0d0e10, 0.3, 0.7),
    blades: std(0x6a6f76, 0.9, 0.28),
  }
  const chrome = std(0xe2e6ea, 1, 0.1)
  const strut = std(0xb7bcc2, 0.55, 0.35)
  const tyre = new THREE.MeshStandardMaterial({ color: 0x141516, roughness: 0.88 })
  const hub = std(0xa4a9b0, 0.7, 0.3)
  const dark = std(0x0f1113, 0.4, 0.6)

  // fuselage
  const fus = new THREE.Mesh(fuselageGeometry(hd ? 240 : 160, hd ? 128 : 96), paint)
  fus.position.y = CY
  body.add(fus)
  // APU exhaust at the end of the tail cone
  {
    const s = section(1)
    const apu = new THREE.Mesh(new THREE.CircleGeometry(1, 32), dark)
    apu.scale.set(s.w, (s.top - s.bot) / 2, 1)
    apu.position.set(0, CY + (s.top + s.bot) / 2, LEN / 2 + 0.005)
    body.add(apu)
  }
  // wing-to-body fairing
  {
    const f = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), belly)
    f.scale.set(2.2, 0.78, 6.3)
    f.position.set(0, CY - 1.35, -0.4)
    body.add(f)
  }

  // wings, flap-track fairings, tailplane, pylons: built for starboard, mirrored to port
  const { st: wst, vSharklet } = wingStations()
  const wingTex = surfaceTextures(hd ? 1024 : 512, hd ? 2048 : 1024, {
    hinge: 0.745, spoilers: [0.1, 0.6], flaps: [[0.06, 0.36], [0.37, 0.66]], aileron: [0.68, 0.84], white: vSharklet,
  })
  const wingMat = phys({ ...wingTex, roughness: 1, metalness: 1, side: THREE.DoubleSide })
  const wingGeo = loft(wst, hd ? 40 : 24, 0.018)

  const htpTex = surfaceTextures(512, 512, { hinge: 0.7 })
  const htpMat = phys({ ...htpTex, roughness: 1, metalness: 1, clearcoat: 0.25, side: THREE.DoubleSide })
  const htpGeo = loft([0, 1.2, 3, 6.15].map((x) => ({
    o: [x, CY + 0.92 + x * Math.tan(6 * Math.PI / 180), 13.25 + x * 0.55] as V3,
    c: 4.1 - (x / 6.15) * 2.65,
    t: 0.11 - (x / 6.15) * 0.02,
  })), hd ? 28 : 18)

  const canoe = lathe([[0, 0], [0.08, 0.25], [0.17, 0.8], [0.19, 1.5], [0.15, 2.3], [0.06, 2.95], [0, 3.15]], 24)
  const canoeGeos: THREE.BufferGeometry[] = []
  for (const x of [4.6, 8.6, 11.6, 14.2]) {
    const c = zTE(x) - zLE(x)
    const g = canoe.clone()
    g.scale(0.75, 1.1, 1)
    g.translate(x, wingY(x) - c * 0.05, zTE(x) - 2.35)
    canoeGeos.push(g)
  }

  const pylonGeo = loft([
    { o: [5.75, CY - 1.15, -4.0], c: 6.2, t: 0.075 },
    { o: [5.75, wingY(5.75) - 0.02, -3.3], c: 4.9, t: 0.08 },
  ], 16)

  for (const side of [1, -1]) {
    const g = (geo: THREE.BufferGeometry) => (side > 0 ? geo : mirrorX(geo))
    body.add(new THREE.Mesh(g(wingGeo), wingMat))
    body.add(new THREE.Mesh(g(htpGeo), htpMat))
    body.add(new THREE.Mesh(g(pylonGeo), white))
    for (const c of canoeGeos) body.add(new THREE.Mesh(g(c), belly))
  }

  // fin, with the mark on both sides reading the right way round
  {
    const geo = loft(FIN.map(([hh, z, c, t]) => ({ o: [0, CY + hh, z] as V3, c, t })), hd ? 32 : 20)
    // planar UVs from the side, so the lettering stays upright on the swept fin
    const p = geo.attributes.position as THREE.BufferAttribute
    const uv = geo.attributes.uv as THREE.BufferAttribute
    for (let i = 0; i < p.count; i++) {
      uv.setXY(i, (p.getZ(i) - FIN_Z[0]) / (FIN_Z[1] - FIN_Z[0]), (p.getY(i) - CY - FIN_H[0]) / (FIN_H[1] - FIN_H[0]))
    }
    const finMat = (sb: boolean) => phys({ map: finTexture(sb), roughness: 0.36, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.15, side: THREE.DoubleSide })
    // group 0 is the +normal side, which for a vertical surface is port
    body.add(new THREE.Mesh(geo, [finMat(false), finMat(true)]))
  }

  // engines under the wing, 5.75 m out
  const engines: THREE.Vector3[] = []
  for (const side of [1, -1]) {
    const e = engineParts(m)
    e.position.set(side * 5.75, CY - 2.05, -2.4)
    body.add(e)
    engines.push(new THREE.Vector3(side * 5.75, CY - 2.05, 3.4))
  }

  // antennas and probes
  {
    const blade = (o: V3, up: number) => loft([{ o, c: 0.42, t: 0.12 }, { o: [o[0], o[1] + up * 0.34, o[2] + 0.2], c: 0.2, t: 0.12 }], 8)
    for (const [z, up] of [[-6, 1], [3.5, 1], [-9, -1]] as const) {
      const s = section((z + LEN / 2) / LEN)
      body.add(new THREE.Mesh(blade([0, CY + (up > 0 ? s.top - 0.02 : s.bot + 0.02), z], up), white))
    }
    for (const a of [0.45, Math.PI - 0.45, -0.35, Math.PI + 0.35]) {
      const z = -15.9
      const s = section((z + LEN / 2) / LEN)
      const yc = (s.top + s.bot) / 2, b = (s.top - s.bot) / 2
      const x = s.w * Math.cos(a), y = CY + yc + b * Math.sin(a)
      body.add(rod(chrome, 0.018, [x, y, z], [x * 1.09, y + Math.sin(a) * 0.17, z + 0.06]))
    }
  }

  // landing gear: two-wheel mains under the wing, a twin-wheel nose leg
  const gear = new THREE.Group()
  {
    const mainWheel = wheelGeometry(0.58, 0.38)
    const mainHub = new THREE.CylinderGeometry(0.31, 0.31, 0.4, 24).rotateZ(Math.PI / 2)
    for (const side of [1, -1]) {
      const x = side * 3.8, z = 1.4
      gear.add(rod(strut, 0.16, [x, wingY(3.8) - 0.1, z], [x, 1.25, z]))
      gear.add(rod(chrome, 0.11, [x, 1.32, z], [x, 0.6, z]))
      gear.add(rod(strut, 0.075, [x - 0.62, 0.58, z], [x + 0.62, 0.58, z]))
      gear.add(rod(strut, 0.07, [x, 1.9, z + 0.05], [side * 1.7, 2.35, z + 0.3])) // side brace
      gear.add(rod(strut, 0.05, [x, 1.2, z - 0.18], [x, 0.78, z - 0.3])) // torque link
      for (const dx of [-0.43, 0.43]) {
        const w = new THREE.Mesh(mainWheel, tyre)
        w.position.set(x + dx, 0.58, z)
        gear.add(w)
        const hb = new THREE.Mesh(mainHub, hub)
        hb.position.copy(w.position)
        gear.add(hb)
      }
      const door = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.25, 1.05), belly)
      door.position.set(x + side * 0.24, 1.75, z - 0.05)
      gear.add(door)
    }
    const nz = -13.4
    gear.add(rod(strut, 0.11, [0, CY - 1.95, nz], [0, 1.0, nz]))
    gear.add(rod(chrome, 0.075, [0, 1.05, nz], [0, 0.42, nz + 0.12]))
    gear.add(rod(strut, 0.05, [-0.3, 0.4, nz + 0.12], [0.3, 0.4, nz + 0.12]))
    gear.add(rod(strut, 0.05, [0, 1.6, nz], [0, 2.0, nz + 1.4])) // drag brace
    const nw = wheelGeometry(0.38, 0.24)
    const nh = new THREE.CylinderGeometry(0.2, 0.2, 0.26, 20).rotateZ(Math.PI / 2)
    for (const dx of [-0.2, 0.2]) {
      const w = new THREE.Mesh(nw, tyre)
      w.position.set(dx, 0.4, nz + 0.12)
      gear.add(w)
      const hb = new THREE.Mesh(nh, hub)
      hb.position.copy(w.position)
      gear.add(hb)
    }
    for (const side of [1, -1]) {
      const d = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.55, 1.25), belly)
      d.position.set(side * 0.5, CY - 2.15, nz - 0.45)
      gear.add(d)
    }
  }
  body.add(gear)

  // the external lights
  const tipX = WING_TIP + 0.12, tipY = wingY(WING_TIP) + 0.05, tipZ = zLE(WING_TIP)
  const tail = section(1)
  const tailY = CY + (tail.top + tail.bot) / 2
  const lights: LightSpec[] = [
    { p: [-tipX, tipY, tipZ - 0.05], c: [6, 0.35, 0.2], size: 0.55 }, // port nav, red
    { p: [tipX, tipY, tipZ - 0.05], c: [0.35, 6, 1.9], size: 0.55 }, // starboard nav, green
    { p: [0, tailY, LEN / 2 + 0.12], c: [5, 5, 5], size: 0.5 }, // tail nav, white
    { p: [-tipX, tipY + 0.02, tipZ + 0.3], c: C.strobe, size: 2.2, mode: LightMode.strobe, phase: 0 },
    { p: [tipX, tipY + 0.02, tipZ + 0.3], c: C.strobe, size: 2.2, mode: LightMode.strobe, phase: 0 },
    { p: [0, tailY, LEN / 2 + 0.22], c: C.strobe, size: 1.8, mode: LightMode.strobe, phase: 0.02 },
    { p: [0, CY + 2.02 + 0.12, -1.2], c: [7, 0.4, 0.2], size: 1.3, mode: LightMode.beacon, phase: 0 },
    { p: [0, CY - 2.0 - 0.14, 6.6], c: [7, 0.4, 0.2], size: 1.3, mode: LightMode.beacon, phase: 0.5 },
  ]
  const steadyPart = makeLights(lights.slice(0, 3), { extinction: 0 })
  steadyPart.frustumCulled = false
  const strobePts = makeLights(lights.slice(3, 6), { extinction: 0 })
  strobePts.frustumCulled = false
  const beaconPts = makeLights(lights.slice(6), { extinction: 0 })
  beaconPts.frustumCulled = false
  body.add(steadyPart, strobePts, beaconPts)
  // after the cloud volume, or the deck behind the aircraft dims its own lights
  for (const p of [steadyPart, strobePts, beaconPts]) p.renderOrder = 30

  // landing and taxi lights: a real spot that lights the runway ahead, plus
  // the glare you see when they point at you
  const spot = new THREE.SpotLight(0xfff1dc, 0, 1600, 0.3, 0.6, 2)
  spot.position.set(0, CY - 1.2, -6)
  spot.target.position.set(0, -6, -420)
  body.add(spot, spot.target)
  const glare: LightSpec[] = [
    { p: [-3.4, wingY(3.4) - 0.3, zLE(3.4) - 0.05], c: [9, 8.6, 7.8], size: 1.4 },
    { p: [3.4, wingY(3.4) - 0.3, zLE(3.4) - 0.05], c: [9, 8.6, 7.8], size: 1.4 },
  ]
  const glarePts = makeLights(glare, { extinction: 0 })
  glarePts.frustumCulled = false
  body.add(glarePts)
  const taxi = makeLights([{ p: [0, 1.25, -13.75], c: [8, 7.6, 7], size: 1.2 }], { extinction: 0 })
  taxi.frustumCulled = false
  body.add(taxi)
  glarePts.renderOrder = 30
  taxi.renderOrder = 30
  const glareMat = glarePts.material as THREE.ShaderMaterial
  const taxiMat = taxi.material as THREE.ShaderMaterial
  const strobeMat = strobePts.material as THREE.ShaderMaterial
  const beaconMat = beaconPts.material as THREE.ShaderMaterial

  group.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) { o.castShadow = false; o.receiveShadow = false }
  })

  return {
    group,
    engines,
    update(_time, st, cam) {
      // Landing and taxi lights point forward: you only see their glare from
      // in front of the aircraft, which is exactly what the arrival is for.
      body.updateMatrixWorld()
      const fwd = _fwd.set(0, 0, -1).transformDirection(body.matrixWorld)
      const to = _to.copy(cam).sub(_pos.setFromMatrixPosition(body.matrixWorld)).normalize()
      const facing = Math.pow(Math.max(0, fwd.dot(to)), 3)
      gear.visible = st.gear > 0.02
      gear.scale.y = Math.max(st.gear, 0.02)
      gear.position.y = (1 - st.gear) * 1.6
      spot.intensity = st.landingLights * 14000
      glareMat.uniforms.uIntensity.value = st.landingLights * facing
      taxiMat.uniforms.uIntensity.value = st.taxiLight * facing
      strobeMat.uniforms.uIntensity.value = st.strobes
      beaconMat.uniforms.uIntensity.value = st.beacon
      body.userData.cy = CY
    },
  }
}

export const AIRCRAFT_CY = CY
const _fwd = new THREE.Vector3()
const _to = new THREE.Vector3()
const _pos = new THREE.Vector3()
