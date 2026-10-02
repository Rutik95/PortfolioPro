import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { buildAircraft } from './aircraft'
import { buildClouds } from './clouds'
import { buildGround } from './ground'
import { lightUniforms } from './lights'
import { makeNoiseTexture } from './noise'
import {
  CLOUD_BASE, CLOUD_TOP, S_ARR, TOTAL, aircraftAt, camDesktop, camMobile,
  destinationGap, routeOpacity, zOf, type AircraftState,
} from './path'
import { buildRoute } from './route'
import { buildSky } from './sky'

export interface FrameInfo {
  t: number
  st: AircraftState
  inCloud: number
  fixes: { x: number; y: number; front: boolean; passed: boolean; dist: number }[]
  cars: { x: number; y: number; front: boolean; label: string }[]
  routeOpacity: number
}

export interface FlightWorld {
  setTarget(t: number): void
  snap(t: number): void
  setPointer(x: number, y: number): void
  resize(): void
  capture(t: number, type?: string, quality?: number): string
  dispose(): void
}

const finishShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uGrain: { value: 0.045 }, uVignette: { value: 0.32 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uTime; uniform float uGrain; uniform float uVignette;
    varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime * 0.0) * 43758.5453); }
    void main(){
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      vec2 q = vUv - 0.5;
      c *= 1.0 - uVignette * dot(q, q) * 2.2;
      float g = hash(vUv * vec2(1931.0, 1213.0) + fract(uTime * 7.31)) - 0.5;
      c += g * uGrain * (0.35 + 0.65 * (1.0 - dot(c, vec3(0.333))));
      gl_FragColor = vec4(c, 1.0);
    }`,
}

export function createFlightWorld(canvas: HTMLCanvasElement, opts: { mobile: boolean; onFrame?: (f: FrameInfo) => void }): FlightWorld {
  const mobile = opts.mobile
  const q = mobile ? 0.42 : 1
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false })
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.outputColorSpace = THREE.SRGBColorSpace
  let dprCap = mobile ? 1.25 : 1.5
  let dpr = Math.min(window.devicePixelRatio || 1, dprCap)
  renderer.setPixelRatio(dpr)

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x080a0e, 0.00003)
  const camera = new THREE.PerspectiveCamera(36, 1, 0.5, 160000)

  const moonDir = new THREE.Vector3(0.62, 0.3, -0.52).normalize()
  const noise = makeNoiseTexture(256)

  // ---------------------------------------------------------------- light --
  const moon = new THREE.DirectionalLight(new THREE.Color(0.66, 0.74, 0.9), 0.8)
  scene.add(moon, moon.target)
  const hemi = new THREE.HemisphereLight(new THREE.Color(0.1, 0.13, 0.2), new THREE.Color(0.3, 0.17, 0.08), 0.7)
  scene.add(hemi)
  const sodium = new THREE.DirectionalLight(new THREE.Color(1.0, 0.58, 0.26), 0.0)
  scene.add(sodium, sodium.target)

  // A night environment for reflections on the skin: dark sky, a warm band of
  // city light along the horizon, the moon.
  {
    const pm = new THREE.PMREMGenerator(renderer)
    const envScene = new THREE.Scene()
    const env = new THREE.Mesh(
      new THREE.SphereGeometry(10, 32, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: { uMoon: { value: moonDir } },
        vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: /* glsl */ `
          uniform vec3 uMoon; varying vec3 vD;
          void main(){
            float h = vD.y;
            vec3 c = mix(vec3(0.05,0.06,0.09), vec3(0.01,0.015,0.03), clamp(h,0.0,1.0));
            c += vec3(0.5,0.28,0.12) * exp(-abs(h + 0.04) * 22.0) * 0.6;
            c = h < -0.05 ? vec3(0.04,0.03,0.025) : c;
            c += vec3(1.4,1.5,1.7) * pow(max(dot(vD, uMoon), 0.0), 400.0) * 1.6;
            gl_FragColor = vec4(c, 1.0);
          }`,
      }),
    )
    envScene.add(env)
    scene.environment = pm.fromScene(envScene, 0.02).texture
    pm.dispose()
  }

  // ---------------------------------------------------------------- world --
  const sky = buildSky(moonDir)
  scene.add(sky.group)
  const ground = buildGround(q)
  scene.add(ground.root)
  const clouds = buildClouds(noise, mobile ? 18 : 34)
  scene.add(clouds.group, clouds.veil)
  clouds.uniforms.uMoonDir.value.copy(moonDir)
  const gaps = (['flights', 'scoreboard', 'detection'] as const).map((id) => destinationGap(id))
  gaps.forEach((g, i) => clouds.uniforms.uGaps.value[i].set(g.x, zOf(g.s), 720, 520))
  clouds.uniforms.uGlow.value[0].set(-1800, -6500, 12000, 1.0)
  clouds.uniforms.uGlow.value[1].set(-1500, zOf(S_ARR) + 4000, 15000, 1.25)

  const aircraft = buildAircraft()
  scene.add(aircraft.group)
  const body = aircraft.group.children[0] as THREE.Group
  const route = buildRoute(noise, aircraft.engines)
  scene.add(route.group)

  // ----------------------------------------------------------- post stack --
  const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: mobile ? 0 : 4 })
  const composer = new EffectComposer(renderer, rt)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.7, 0.42, 1.05)
  composer.addPass(bloom)
  composer.addPass(new OutputPass())
  const finish = new ShaderPass(finishShader)
  composer.addPass(finish)

  // ---------------------------------------------------------------- state --
  let target = 0
  let cur = 0
  const pointer = new THREE.Vector2()
  const pointerS = new THREE.Vector2()
  let w = 1, h = 1
  let raf = 0
  let last = performance.now()
  let time = 0
  let dead = false
  const v = new THREE.Vector3()
  const pivot = new THREE.Vector3(0, 0, 1.4)
  const tmpQ = new THREE.Quaternion()
  const tmpE = new THREE.Euler(0, 0, 0, 'YXZ')
  const skyA = { hz: new THREE.Color(0.012, 0.011, 0.013), glow: new THREE.Color(0.022, 0.012, 0.006) }
  const skyB = { hz: new THREE.Color(0.032, 0.042, 0.066), glow: new THREE.Color(0.012, 0.016, 0.026) }
  const fogCloud = new THREE.Color(0.15, 0.16, 0.19)
  let frameMs = 16
  let slowFrames = 0

  function resize() {
    const r = canvas.getBoundingClientRect()
    w = Math.max(1, Math.round(r.width))
    h = Math.max(1, Math.round(r.height))
    renderer.setPixelRatio(dpr)
    renderer.setSize(w, h, false)
    composer.setPixelRatio(dpr)
    composer.setSize(w, h)
    bloom.resolution.set(w * dpr * 0.5, h * dpr * 0.5)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  function update(t: number) {
    const st = aircraftAt(t)
    const airborne = st.alt > 3 ? 1 : 0
    const z = zOf(st.s)
    aircraft.group.position.set(0, st.alt, z)
    // pitch and roll about the main gear, so the wheels stay on the runway
    // through rotation and touchdown
    tmpE.set(st.pitch + pointerS.y * 0.012 * airborne, 0, -(st.roll + pointerS.x * 0.05 * airborne))
    tmpQ.setFromEuler(tmpE)
    body.quaternion.copy(tmpQ)
    body.position.copy(pivot).sub(v.copy(pivot).applyQuaternion(tmpQ))
    const rig = mobile ? camMobile(t) : camDesktop(t)
    const ap = aircraft.group.position
    camera.position.set(ap.x + rig.o[0] + pointerS.x * 1.6, ap.y + rig.o[1] + pointerS.y * 0.8, ap.z + rig.o[2])
    camera.position.y = Math.max(camera.position.y, 0.9)
    camera.lookAt(ap.x + rig.l[0], ap.y + rig.l[1], ap.z + rig.l[2])
    // Near plane scales with how far the subject is, which buys depth precision
    // for the ground when the camera is a kilometre up.
    const near = THREE.MathUtils.clamp(camera.position.distanceTo(ap) * 0.08, 0.5, 8)
    if (Math.abs(camera.fov - rig.fov) > 0.01 || Math.abs(camera.near - near) > 0.05) {
      camera.fov = rig.fov; camera.near = near; camera.updateProjectionMatrix()
    }
    aircraft.update(time, st, camera.position)

    const cy = camera.position.y
    const inCloud = clouds.update(camera.position)
    const above = THREE.MathUtils.smoothstep(cy, CLOUD_BASE - 50, CLOUD_TOP + 60)
    const hz = skyA.hz.clone().lerp(skyB.hz, above)
    sky.uniforms.uHorizon.value.copy(hz)
    sky.uniforms.uGlow.value.copy(skyA.glow).lerp(skyB.glow, above)
    sky.starMat.uniforms.uVis.value = 0.12 + 0.88 * above
    sky.group.position.copy(camera.position)
    clouds.uniforms.uSky.value.copy(hz)
    clouds.uniforms.uTime.value = time
    ;(scene.fog as THREE.FogExp2).color.copy(hz).add(sky.uniforms.uGlow.value).lerp(fogCloud, inCloud)
    ;(scene.fog as THREE.FogExp2).density = 0.000028 + inCloud * 0.0065
    renderer.setClearColor(hz)

    moon.position.copy(ap).addScaledVector(moonDir, 500)
    moon.target.position.copy(ap)
    const low = 1 - THREE.MathUtils.smoothstep(st.alt, 60, 900)
    sodium.intensity = low * 0.75
    sodium.position.copy(ap).add(v.set(420, 140, -380))
    sodium.target.position.copy(ap)
    hemi.groundColor.setRGB(0.3 - above * 0.12, 0.17 + above * 0.03, 0.08 + above * 0.14)
    hemi.intensity = 0.55 + above * 0.15

    const ro = routeOpacity(t)
    const contrail = THREE.MathUtils.smoothstep(st.alt, 1650, 1850)
    route.update(st.s, ro, contrail)

    lightUniforms.uTime.value = time
    lightUniforms.uScale.value = (h * dpr * 0.5) / Math.tan((camera.fov * Math.PI) / 360)
    lightUniforms.uMinPx.value = 1.1 * dpr
    lightUniforms.uHaze.value = 1 + 4.6 * (1 - THREE.MathUtils.smoothstep(cy, 30, 900))
    lightUniforms.uMaxPx.value = 44 * dpr
    finish.uniforms.uTime.value = time
    bloom.strength = 0.68 + 0.22 * (THREE.MathUtils.smoothstep(t, 9.2, 10.2) - THREE.MathUtils.smoothstep(t, 10.9, 11.8))

    if (opts.onFrame) {
      camera.updateMatrixWorld()
      const fixes = route.fixes.map((f) => {
        v.copy(f.world).project(camera)
        return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, front: v.z < 1, passed: st.s >= f.s - 20, dist: f.s - st.s }
      })
      const cars = ground.tracked.map((c) => {
        const len = c.dir.length()
        const k = ((c.phase + (time * c.speed) / Math.max(len, 1)) % 1 + 1) % 1
        v.copy(c.start).addScaledVector(c.dir, k).project(camera)
        return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, front: v.z < 1, label: c.label }
      })
      opts.onFrame({ t, st, inCloud, fixes, cars, routeOpacity: ro })
    }
  }

  function frame(now: number) {
    if (dead) return
    raf = requestAnimationFrame(frame)
    const dt = Math.min((now - last) / 1000, 0.1)
    last = now
    time += dt
    // Damped playhead: wheel events arrive in bursts, and a camera that answers
    // each one 1:1 stutters. Frame-rate independent.
    const k = 1 - Math.pow(1 - 0.1, dt * 60)
    cur += (target - cur) * k
    if (Math.abs(target - cur) < 0.0004) cur = target
    pointerS.lerp(pointer, 1 - Math.pow(1 - 0.06, dt * 60))
    update(cur)
    composer.render(dt)

    // If the device cannot hold the frame rate, render fewer pixels rather
    // than drop frames: a soft image reads as atmosphere, a stutter as broken.
    frameMs = frameMs * 0.95 + dt * 1000 * 0.05
    if (frameMs > 26 && dpr > 0.75) {
      if (++slowFrames > 90) { dpr = Math.max(0.75, dpr - 0.25); dprCap = dpr; slowFrames = 0; resize() }
    } else slowFrames = 0
  }

  const ro = new ResizeObserver(() => resize())
  ro.observe(canvas)
  resize()
  raf = requestAnimationFrame(frame)

  return {
    setTarget(t) { target = Math.min(Math.max(t, 0), TOTAL) },
    snap(t) { target = cur = Math.min(Math.max(t, 0), TOTAL) },
    setPointer(x, y) { pointer.set(x, y) },
    resize,
    capture(t, type = 'image/webp', quality = 0.86) {
      target = cur = t
      pointerS.set(0, 0); pointer.set(0, 0)
      update(t)
      composer.render(0.016)
      return canvas.toDataURL(type, quality)
    },
    dispose() {
      dead = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
        const mat = m.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
        else if (mat) mat.dispose()
      })
      composer.dispose()
      rt.dispose()
      renderer.dispose()
    },
  }
}
