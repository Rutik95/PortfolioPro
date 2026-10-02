import * as THREE from 'three'

/** Seeded RNG, so the world (and therefore every poster) is identical on every load. */
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Periodic value noise, used both in JS (city density) and baked into a
// tileable texture for the cloud shader, where a texture fetch is far cheaper
// than evaluating fbm per pixel per cloud slice.
function lattice(seed: number, size: number) {
  const r = rng(seed)
  const g = new Float32Array(size * size)
  for (let i = 0; i < g.length; i++) g[i] = r()
  return g
}

export function makeNoise2D(seed: number, period = 64) {
  const g = lattice(seed, period)
  const at = (x: number, y: number) => g[(((y % period) + period) % period) * period + (((x % period) + period) % period)]
  const fade = (t: number) => t * t * (3 - 2 * t)
  const noise = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y)
    const xf = x - xi, yf = y - yi
    const u = fade(xf), v = fade(yf)
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
  }
  return (x: number, y: number, oct = 4) => {
    let sum = 0, amp = 0.5, f = 1, norm = 0
    for (let o = 0; o < oct; o++) {
      sum += amp * noise(x * f, y * f)
      norm += amp; amp *= 0.5; f *= 2
    }
    return sum / norm
  }
}

/** A tileable fbm texture: R and G are two decorrelated fields. */
export function makeNoiseTexture(size = 256) {
  const period = 16
  const n1 = makeNoise2D(7, period)
  const n2 = makeNoise2D(91, period)
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * period, v = (y / size) * period
      const i = (y * size + x) * 4
      data[i] = Math.round(n1(u, v, 5) * 255)
      data[i + 1] = Math.round(n2(u, v, 5) * 255)
      data[i + 2] = 0
      data[i + 3] = 255
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.magFilter = THREE.LinearFilter
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.generateMipmaps = true
  tex.needsUpdate = true
  return tex
}
