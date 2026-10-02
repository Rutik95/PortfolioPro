import * as THREE from 'three'
import { rng } from './noise'

// The sky is a dome that follows the camera: a night gradient, a moon, and a
// star field that only the clear air above the cloud deck really shows.

export function buildSky(moonDir: THREE.Vector3) {
  const uniforms = {
    uZenith: { value: new THREE.Color(0.006, 0.01, 0.022) },
    uHorizon: { value: new THREE.Color(0.03, 0.04, 0.06) },
    uGlow: { value: new THREE.Color(0.0, 0.0, 0.0) },
    uMoonDir: { value: moonDir.clone() },
  }
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 24),
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main(){
          vDir = normalize(position);
          vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_Position = p.xyww;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uZenith; uniform vec3 uHorizon; uniform vec3 uGlow; uniform vec3 uMoonDir;
        varying vec3 vDir;
        void main(){
          float h = vDir.y;
          vec3 col = mix(uHorizon, uZenith, pow(clamp(h, 0.0, 1.0), 0.45));
          col += uGlow * exp(-abs(h) * 5.0);
          col = h < 0.0 ? uHorizon + uGlow : col;
          float m = max(dot(normalize(vDir), uMoonDir), 0.0);
          col += vec3(0.42, 0.48, 0.6) * pow(m, 60.0) * 0.12 + vec3(0.3, 0.34, 0.42) * pow(m, 8.0) * 0.035;
          gl_FragColor = vec4(col, 1.0);
        }`,
      side: THREE.BackSide,
      depthWrite: false,
    }),
  )
  dome.scale.setScalar(1000)
  dome.renderOrder = -10
  dome.frustumCulled = false

  // stars
  const r = rng(5)
  const n = 2600
  const pos = new Float32Array(n * 3)
  const col = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const z = r() * 0.96 + 0.04
    const a = r() * Math.PI * 2
    const rr = Math.sqrt(1 - z * z)
    pos.set([Math.cos(a) * rr * 900, z * 900, Math.sin(a) * rr * 900], i * 3)
    const b = Math.pow(r(), 6) * 2.2 + 0.18
    const warm = r()
    col.set([b * (0.85 + warm * 0.2), b * 0.9, b * (1.05 - warm * 0.15)], i * 3)
  }
  const sg = new THREE.BufferGeometry()
  sg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  sg.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const starMat = new THREE.ShaderMaterial({
    uniforms: { uVis: { value: 1 }, uPx: { value: 1.5 } },
    vertexShader: /* glsl */ `
      attribute vec3 color; varying vec3 vC; uniform float uVis; uniform float uPx;
      void main(){ vC = color * uVis; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; gl_PointSize = uPx; }`,
    fragmentShader: /* glsl */ `
      varying vec3 vC; void main(){ float r = length(gl_PointCoord - 0.5) * 2.0; gl_FragColor = vec4(vC * (1.0 - r * r), 1.0); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  })
  const stars = new THREE.Points(sg, starMat)
  stars.frustumCulled = false
  stars.renderOrder = -9

  // the moon: a disc with a soft halo, far enough that it never parallaxes
  const mc = document.createElement('canvas')
  mc.width = mc.height = 256
  const g = mc.getContext('2d')!
  const halo = g.createRadialGradient(128, 128, 10, 128, 128, 128)
  halo.addColorStop(0, 'rgba(225,230,240,0.55)')
  halo.addColorStop(0.12, 'rgba(200,210,230,0.18)')
  halo.addColorStop(0.4, 'rgba(160,175,205,0.04)')
  halo.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = halo; g.fillRect(0, 0, 256, 256)
  g.fillStyle = 'rgb(236,238,242)'
  g.beginPath(); g.arc(128, 128, 13, 0, Math.PI * 2); g.fill()
  g.fillStyle = 'rgba(150,155,165,0.35)'
  g.beginPath(); g.arc(124, 125, 4, 0, Math.PI * 2); g.fill()
  g.beginPath(); g.arc(133, 132, 3, 0, Math.PI * 2); g.fill()
  const moonTex = new THREE.CanvasTexture(mc)
  moonTex.colorSpace = THREE.SRGBColorSpace
  const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: moonTex, color: new THREE.Color(1.6, 1.6, 1.7), depthWrite: false, transparent: true, fog: false }))
  moon.scale.setScalar(110)
  moon.renderOrder = -8

  const group = new THREE.Group()
  group.add(dome, stars, moon)
  moon.position.copy(moonDir).multiplyScalar(850)

  return { group, uniforms, starMat }
}
