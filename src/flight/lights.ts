import * as THREE from 'three'

// Every light in the world (streetlights, runway edges, strobes, the approach
// rabbit, PAPI, car headlights) is a point in one of these. A light is an
// HDR colour and a physical size in metres; the shader keeps tiny distant
// lights energy-correct instead of letting them shimmer in and out.

export const LightMode = {
  steady: 0,
  strobe: 1, // double white flash, 1.2 s period
  beacon: 2, // red anti-collision pulse
  rabbit: 3, // sequenced flasher; phase = position in sequence 0..1
  twinkle: 4,
  papi: 5, // phase = threshold angle (rad); white above it, red below
  slowBlink: 6, // obstruction lights on towers
} as const

export interface LightSpec {
  p: [number, number, number]
  c: [number, number, number]
  size: number
  mode?: number
  phase?: number
  dir?: [number, number, number] // moving lights only: segment vector
}

const vert = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  attribute vec2 aAnim;
  #ifdef MOVING
  attribute vec3 aDir;
  uniform float uSpeed;
  #endif
  uniform float uTime;
  uniform float uScale;
  uniform float uMinPx;
  uniform float uMaxPx;
  uniform float uIntensity;
  uniform float uExtinction;
  uniform float uHaze;
  uniform float uNear;
  varying vec3 vColor;
  varying float vPx;

  void main() {
    vec3 pos = position;
    #ifdef MOVING
      float len = length(aDir);
      pos += aDir * fract(aAnim.y + uTime * uSpeed / max(len, 1.0));
    #endif
    vec4 world = modelMatrix * vec4(pos, 1.0);
    vec4 mv = viewMatrix * world;
    float dist = max(-mv.z, 0.001);
    float px = aSize * uScale / dist;
    float inten = uIntensity;
    int mode = int(aAnim.x + 0.5);
    vec3 col = aColor;
    if (mode == 1) {
      float ph = fract(uTime / 1.2 + aAnim.y);
      inten *= (1.0 - step(0.045, ph)) + step(0.13, ph) * (1.0 - step(0.175, ph));
    } else if (mode == 2) {
      float ph = fract(uTime * 0.85 + aAnim.y);
      inten *= 0.04 + pow(max(0.0, sin(ph * 3.14159)), 8.0);
    } else if (mode == 3) {
      float d = fract(uTime * 2.0) - aAnim.y;
      inten *= d >= 0.0 ? exp(-d * 70.0) * 1.6 : 0.0;
    } else if (mode == 4) {
      inten *= 0.82 + 0.18 * sin(uTime * (2.0 + aAnim.y * 4.0) + aAnim.y * 50.0);
    } else if (mode == 5) {
      vec3 toCam = cameraPosition - world.xyz;
      float ang = atan(toCam.y, length(toCam.xz));
      col = ang > aAnim.y ? vec3(4.2, 4.0, 3.6) : vec3(5.0, 0.35, 0.2);
    } else if (mode == 6) {
      float ph = fract(uTime * 0.5 + aAnim.y);
      inten *= 0.15 + 0.85 * step(ph, 0.5);
    }
    // Low down, a long horizontal path runs through the haze of a city at
    // night; from altitude the air between you and the ground is thin.
    inten *= exp(-dist * uExtinction * uHaze);
    // ground lights a few metres from the lens would be out of focus: let them go
    inten *= uNear > 0.0 ? smoothstep(uNear * 0.35, uNear, dist) : 1.0;
    // Below a pixel, a light keeps its point and loses brightness, but only
    // linearly: real runway and street lights carry for many kilometres.
    if (px < uMinPx) { inten *= max(px / uMinPx, 0.12); px = uMinPx; }
    vColor = col * inten;
    gl_PointSize = min(px, uMaxPx);
    vPx = gl_PointSize;
    gl_Position = projectionMatrix * mv;
    if (inten < 0.0015) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  }
`

const frag = /* glsl */ `
  varying vec3 vColor;
  varying float vPx;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c) * 2.0;
    // A light a pixel or two wide is sampled off its centre, so a sharp
    // profile would throw most of it away: flatten the profile as it shrinks.
    float k = mix(0.4, 9.0, smoothstep(1.5, 10.0, vPx));
    float edge = vPx < 3.0 ? 1.0 : 1.0 - r * r;
    if (r > 1.0 && vPx >= 3.0) discard;
    float core = exp(-r * r * k);
    float halo = exp(-r * 4.0) * 0.22;
    gl_FragColor = vec4(vColor * (core + halo) * edge, 1.0);
  }
`

/** Shared per-frame uniforms: every light material points at these objects. */
export const lightUniforms = {
  uTime: { value: 0 },
  uScale: { value: 800 },
  uMinPx: { value: 1.2 },
  uMaxPx: { value: 64 },
  uHaze: { value: 1 },
}

export function makeLights(specs: LightSpec[], opts: { moving?: boolean; speed?: number; extinction?: number; intensity?: number; near?: number } = {}) {
  const n = specs.length
  const pos = new Float32Array(n * 3)
  const col = new Float32Array(n * 3)
  const size = new Float32Array(n)
  const anim = new Float32Array(n * 2)
  const dir = opts.moving ? new Float32Array(n * 3) : null
  for (let i = 0; i < n; i++) {
    const s = specs[i]
    pos.set(s.p, i * 3)
    col.set(s.c, i * 3)
    size[i] = s.size
    anim[i * 2] = s.mode ?? 0
    anim[i * 2 + 1] = s.phase ?? 0
    if (dir && s.dir) dir.set(s.dir, i * 3)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  g.setAttribute('aAnim', new THREE.BufferAttribute(anim, 2))
  if (dir) g.setAttribute('aDir', new THREE.BufferAttribute(dir, 3))
  g.computeBoundingSphere()
  if (dir && g.boundingSphere) g.boundingSphere.radius += 6000

  const mat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      ...lightUniforms,
      uIntensity: { value: opts.intensity ?? 1 },
      uExtinction: { value: opts.extinction ?? 0.00004 },
      uNear: { value: opts.near ?? 0 },
      uSpeed: { value: opts.speed ?? 20 },
    },
    defines: opts.moving ? { MOVING: '' } : {},
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const pts = new THREE.Points(g, mat)
  pts.frustumCulled = true
  return pts
}

// ---------------------------------------------------------------- colours --
// HDR: anything over ~1 feeds the bloom. Real night lighting is a handful of
// specific sources, so the palette is the sources, not a theme.
export const C = {
  sodium: [3.4, 1.55, 0.42] as [number, number, number],
  sodiumDim: [1.6, 0.78, 0.24] as [number, number, number],
  warm: [2.6, 1.9, 1.15] as [number, number, number],
  led: [2.3, 2.45, 2.7] as [number, number, number],
  window: [1.5, 1.1, 0.62] as [number, number, number],
  windowCool: [0.95, 1.05, 1.25] as [number, number, number],
  runway: [4.4, 4.2, 3.8] as [number, number, number],
  runwayAmber: [4.6, 3.0, 0.9] as [number, number, number],
  red: [5.2, 0.3, 0.16] as [number, number, number],
  green: [0.3, 4.6, 1.6] as [number, number, number],
  blue: [0.35, 0.8, 4.8] as [number, number, number],
  strobe: [9, 9, 9.5] as [number, number, number],
  head: [3.2, 3.2, 3.0] as [number, number, number],
  tail: [3.0, 0.25, 0.15] as [number, number, number],
  flood: [6.5, 6.3, 5.8] as [number, number, number],
}
