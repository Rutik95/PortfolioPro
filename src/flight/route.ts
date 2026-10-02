import * as THREE from 'three'
import { AIRCRAFT_CY } from './aircraft'
import { FIX_S, TOTAL, altAt, sAt, zOf } from './path'

// The contrail ledger. Behind the aircraft, its real contrail: the route
// already flown. Ahead of it, a dashed track at flight level: the route still
// to fly. The career fixes sit on that track, and they change state as the
// aircraft flies through them.

/** Altitude as a function of path distance, by inverting the scroll timeline. */
function altBySFactory() {
  const N = 4000
  const ts = new Float32Array(N + 1)
  const ss = new Float32Array(N + 1)
  for (let i = 0; i <= N; i++) { ts[i] = (i / N) * TOTAL; ss[i] = sAt(ts[i]) }
  return (s: number) => {
    let lo = 0, hi = N
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ss[m] < s) lo = m; else hi = m }
    const k = (s - ss[lo]) / Math.max(ss[hi] - ss[lo], 1e-6)
    return altAt(ts[lo] + (ts[hi] - ts[lo]) * Math.min(Math.max(k, 0), 1))
  }
}

const trailVert = /* glsl */ `
  attribute float aS;
  attribute float aSide;
  attribute vec3 aAcross;
  uniform float uNow;
  varying float vAge;
  varying float vSide;
  varying float vS;
  void main() {
    float age = uNow - aS;
    float w = 0.9 + max(age, 0.0) * 0.0042;
    vec3 p = position + aAcross * aSide * w;
    p.y -= max(age, 0.0) * 0.0035; // trails sink and spread as they age
    vAge = age; vSide = aSide; vS = aS;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.0);
  }
`
const trailFrag = /* glsl */ `
  uniform sampler2D uNoise;
  uniform float uOpacity;
  varying float vAge;
  varying float vSide;
  varying float vS;
  void main() {
    if (vAge < 35.0) discard;
    float form = smoothstep(35.0, 260.0, vAge);
    float fade = 1.0 - smoothstep(4000.0, 14000.0, vAge);
    float edge = 1.0 - vSide * vSide;
    float br = texture2D(uNoise, vec2(vS / 1700.0, 0.31 + vSide * 0.02)).r;
    float a = form * fade * edge * mix(0.55, 1.0, smoothstep(0.35, 0.65, br)) * uOpacity;
    gl_FragColor = vec4(vec3(0.8, 0.84, 0.92) * (0.85 + 0.15 * edge), a * 0.62);
  }
`

const routeFrag = /* glsl */ `
  uniform float uNow;
  uniform float uOpacity;
  uniform float uEnd;
  varying float vAge;
  varying float vSide;
  varying float vS;
  void main() {
    float ahead = vS - uNow;
    if (ahead < 60.0 || vS > uEnd) discard;
    float dash = step(fract(vS / 90.0), 0.45);
    float reach = 1.0 - smoothstep(4500.0, 9000.0, ahead);
    float edge = 1.0 - smoothstep(0.55, 1.0, abs(vSide));
    float a = dash * reach * edge * smoothstep(60.0, 220.0, ahead) * uOpacity;
    gl_FragColor = vec4(0.96, 0.69, 0.4, a * 0.85);
  }
`
const routeVert = /* glsl */ `
  attribute float aS;
  attribute float aSide;
  attribute vec3 aAcross;
  varying float vAge;
  varying float vSide;
  varying float vS;
  void main() {
    vec3 p = position + aAcross * aSide * 1.6;
    vAge = 0.0; vSide = aSide; vS = aS;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.0);
  }
`

function ribbon(s0: number, s1: number, step: number, at: (s: number) => THREE.Vector3, across: THREE.Vector3) {
  const n = Math.ceil((s1 - s0) / step) + 1
  const pos = new Float32Array(n * 2 * 3)
  const aS = new Float32Array(n * 2)
  const side = new Float32Array(n * 2)
  const acr = new Float32Array(n * 2 * 3)
  const idx: number[] = []
  for (let i = 0; i < n; i++) {
    const s = Math.min(s0 + i * step, s1)
    const p = at(s)
    for (let k = 0; k < 2; k++) {
      const j = i * 2 + k
      pos.set([p.x, p.y, p.z], j * 3)
      aS[j] = s
      side[j] = k ? 1 : -1
      acr.set([across.x, across.y, across.z], j * 3)
    }
    if (i < n - 1) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2) }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aS', new THREE.BufferAttribute(aS, 1))
  g.setAttribute('aSide', new THREE.BufferAttribute(side, 1))
  g.setAttribute('aAcross', new THREE.BufferAttribute(acr, 3))
  g.setIndex(idx)
  return g
}

export function buildRoute(noise: THREE.Texture, engines: THREE.Vector3[]) {
  const group = new THREE.Group()
  const altByS = altBySFactory()
  const trailU = { uNow: { value: 0 }, uOpacity: { value: 1 }, uNoise: { value: noise } }
  const trailMat = new THREE.ShaderMaterial({
    vertexShader: trailVert, fragmentShader: trailFrag, uniforms: trailU,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
  })
  // contrails form only in the cold air at cruise
  const s0 = 12600, s1 = 56000
  for (const e of engines) {
    for (const across of [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0)]) {
      const g = ribbon(s0, s1, 30, (s) => new THREE.Vector3(e.x, altByS(s) + e.y, zOf(s) + e.z), across)
      const m = new THREE.Mesh(g, trailMat)
      m.frustumCulled = false
      m.renderOrder = 20
      group.add(m)
    }
  }

  const routeU = { uNow: { value: 0 }, uOpacity: { value: 0 }, uEnd: { value: FIX_S[FIX_S.length - 1] + 9000 } }
  const routeMat = new THREE.ShaderMaterial({
    vertexShader: routeVert, fragmentShader: routeFrag, uniforms: routeU,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
  })
  // the planned track runs out of the nose at the height of the fuselage
  const lvl = (s: number) => altByS(s) + AIRCRAFT_CY
  const route = new THREE.Mesh(ribbon(17000, 46000, 20, (s) => new THREE.Vector3(0, lvl(s), zOf(s)), new THREE.Vector3(1, 0, 0)), routeMat)
  route.frustumCulled = false
  route.renderOrder = 15
  group.add(route)

  // fixes: a diamond outline ahead, a filled diamond once flown over
  const fixes = FIX_S.map((s) => {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(22, 26, 4, 1),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(0.96, 0.69, 0.4), transparent: true, depthWrite: false, opacity: 0, side: THREE.DoubleSide }),
    )
    ring.rotation.x = -Math.PI / 2
    ring.rotation.z = Math.PI / 4
    ring.position.set(0, lvl(s), zOf(s))
    ring.renderOrder = 16
    const fill = new THREE.Mesh(
      new THREE.CircleGeometry(14, 4),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(0.92, 0.93, 0.95), transparent: true, depthWrite: false, opacity: 0, side: THREE.DoubleSide }),
    )
    fill.rotation.copy(ring.rotation)
    fill.position.copy(ring.position)
    fill.renderOrder = 16
    group.add(ring, fill)
    return { s, ring, fill, world: ring.position.clone() }
  })

  return {
    group,
    fixes,
    update(sNow: number, routeOpacity: number, contrailOn: number) {
      trailU.uNow.value = sNow
      trailU.uOpacity.value = contrailOn
      routeU.uNow.value = sNow
      routeU.uOpacity.value = routeOpacity
      for (const f of fixes) {
        const passed = sNow >= f.s - 20
        ;(f.ring.material as THREE.MeshBasicMaterial).opacity = routeOpacity * (passed ? 0.25 : 0.95)
        ;(f.fill.material as THREE.MeshBasicMaterial).opacity = routeOpacity * (passed ? 0.9 : 0)
      }
    },
  }
}
