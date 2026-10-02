import * as THREE from 'three'
import { C, LightMode, makeLights, type LightSpec } from './lights'

// A narrow-body twin, built from its real proportions (37.6 m long, 35.8 m
// span, 3.95 m fuselage). At night an airliner is read by its lights and by
// the rim of moonlight on its skin, so those get the detail: cabin windows,
// navigation lights, double-flash strobes, the beacon, and the logo lights
// washing the fin.

const LEN = 37.6
const R = 1.98
const CY = 3.6 // fuselage centreline height with the gear down

function fuselageGeometry() {
  const pts: THREE.Vector2[] = []
  const N = 72
  for (let i = 0; i <= N; i++) {
    const u = i / N
    let r: number
    if (u < 0.115) {
      const k = u / 0.115
      r = R * Math.pow(1 - Math.pow(1 - k, 2.2), 0.55)
    } else if (u < 0.7) {
      r = R
    } else {
      const k = Math.min((u - 0.7) / 0.3, 1)
      r = R * Math.pow(1 - k, 1.25) * 0.86 + 0.28 * k + R * 0.14 * (1 - k)
    }
    pts.push(new THREE.Vector2(Math.max(r, 0.001), u * LEN))
  }
  const g = new THREE.LatheGeometry(pts, 56)
  g.rotateX(Math.PI / 2) // lathe axis Y -> +Z, nose at z=0
  g.translate(0, 0, -LEN / 2) // nose forward at -Z
  // Sweep the tail cone up, and rebuild UVs as (length, angle) for the livery.
  const p = g.attributes.position as THREE.BufferAttribute
  const uv = g.attributes.uv as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i)
    const along = (z + LEN / 2) / LEN // 0 nose .. 1 tail
    const lift = along > 0.62 ? Math.pow((along - 0.62) / 0.38, 2) * 1.55 : 0
    // the belly rises faster than the crown: tail cones flatten from below
    const squash = along > 0.62 && y < 0 ? 1 - (along - 0.62) * 0.9 : 1
    p.setY(i, y * squash + lift)
    const ang = Math.atan2(y, x)
    uv.setXY(i, along, (ang + Math.PI) / (Math.PI * 2))
  }
  g.computeVertexNormals()
  return g
}

function liveryTextures() {
  const W = 2048, H = 1024
  const base = document.createElement('canvas')
  base.width = W; base.height = H
  const b = base.getContext('2d')!
  const emi = document.createElement('canvas')
  emi.width = W; emi.height = H
  const e = emi.getContext('2d')!
  e.fillStyle = '#000'; e.fillRect(0, 0, W, H)
  // v = 0.25 is the belly, 0.5 the right side, 0.75 the crown, 0/1 the left
  const grad = b.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#d9dadb')
  grad.addColorStop(0.2, '#9a9ea3')
  grad.addColorStop(0.3, '#8d9196')
  grad.addColorStop(0.42, '#d6d7d8')
  grad.addColorStop(0.75, '#ecedee')
  grad.addColorStop(1, '#d9dadb')
  b.fillStyle = grad; b.fillRect(0, 0, W, H)
  // panel lines
  b.strokeStyle = 'rgba(60,64,70,0.18)'; b.lineWidth = 1
  for (let x = 0.12; x < 0.7; x += 0.021) { b.beginPath(); b.moveTo(x * W, 0); b.lineTo(x * W, H); b.stroke() }
  // one slim line under the windows; the only livery the aircraft has
  for (const v of [0.5 + 0.025, 1 - 0.025]) {
    b.fillStyle = '#23272d'
    b.fillRect(0.11 * W, (v - 0.009) * H - 2, 0.6 * W, 3)
  }
  // windows, both sides
  const win = (v: number) => {
    for (let k = 0; k < 64; k++) {
      const u = 0.14 + k * 0.0086
      if (u > 0.235 && u < 0.25) continue // door
      if (u > 0.46 && u < 0.475) continue // overwing exits stay, but this gap is the wing box
      const x = u * W, y = v * H
      b.fillStyle = '#1b1e22'
      b.beginPath(); b.roundRect(x - 4, y - 7, 8, 13, 3); b.fill()
      const lit = 0.75 + Math.random() * 0.25
      e.fillStyle = `rgba(255,${190 + Math.random() * 30},${120 + Math.random() * 30},${lit})`
      e.beginPath(); e.roundRect(x - 3.5, y - 6, 7, 11, 3); e.fill()
    }
    // doors
    for (const u of [0.125, 0.69]) {
      b.strokeStyle = 'rgba(40,44,50,0.55)'; b.lineWidth = 2
      b.strokeRect(u * W - 9, v * H - 26, 18, 44)
    }
  }
  win(0.5 + 0.045)
  win(1 - 0.045)
  // cockpit windscreen, wrapping the nose
  b.fillStyle = '#0d0f12'
  b.beginPath()
  b.moveTo(0.045 * W, 0.55 * H); b.lineTo(0.075 * W, 0.6 * H); b.lineTo(0.075 * W, 0.9 * H); b.lineTo(0.045 * W, 0.95 * H)
  b.closePath(); b.fill()
  e.fillStyle = 'rgba(40,90,80,0.35)' // instrument glow behind the glass
  e.fillRect(0.05 * W, 0.6 * H, 0.02 * W, 0.3 * H)
  const map = new THREE.CanvasTexture(base)
  map.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = 8
  const emissiveMap = new THREE.CanvasTexture(emi)
  emissiveMap.colorSpace = THREE.SRGBColorSpace
  return { map, emissiveMap }
}

function finTextures() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')!
  g.fillStyle = '#e7e8e9'; g.fillRect(0, 0, 512, 512)
  g.strokeStyle = 'rgba(60,64,70,0.25)'; g.lineWidth = 2
  g.beginPath(); g.moveTo(370, 512); g.lineTo(450, 0); g.stroke() // rudder hinge
  // the tail mark: initials, set in the display face
  g.fillStyle = '#1e2329'
  g.font = '700 150px "Archivo Variable", "Archivo", system-ui, sans-serif'
  g.textAlign = 'center'; g.textBaseline = 'middle'
  g.save(); g.translate(290, 285); g.rotate(-0.08); g.fillText('RT', 0, 0); g.restore()
  const map = new THREE.CanvasTexture(c)
  map.colorSpace = THREE.SRGBColorSpace
  // the logo lights sit on the stabilisers and throw a fan of light up the fin
  const e = document.createElement('canvas')
  e.width = e.height = 512
  const h = e.getContext('2d')!
  const grad = h.createRadialGradient(250, 560, 20, 250, 560, 470)
  grad.addColorStop(0, 'rgba(255,240,220,0.95)')
  grad.addColorStop(0.5, 'rgba(255,236,214,0.4)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  h.fillStyle = '#000'; h.fillRect(0, 0, 512, 512)
  h.fillStyle = grad; h.fillRect(0, 0, 512, 512)
  const emissiveMap = new THREE.CanvasTexture(e)
  emissiveMap.colorSpace = THREE.SRGBColorSpace
  return { map, emissiveMap }
}

/** A swept, tapered surface from a planform, given a little thickness. */
function surface(points: [number, number][], thick: number) {
  const s = new THREE.Shape()
  s.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; i++) s.lineTo(points[i][0], points[i][1])
  s.closePath()
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: true, bevelThickness: thick * 0.45, bevelSize: thick * 0.6, bevelSegments: 3, curveSegments: 1 })
  g.rotateX(Math.PI / 2) // planform into XZ, thickness downward
  g.translate(0, thick / 2, 0)
  g.computeVertexNormals()
  return g
}

function nacelleGeometry() {
  const pts: THREE.Vector2[] = []
  const L = 4.4
  const prof = [[0.0, 0.93], [0.06, 1.02], [0.3, 1.07], [0.62, 0.98], [0.86, 0.78], [1.0, 0.56]]
  for (const [u, r] of prof) pts.push(new THREE.Vector2(r, u * L))
  const g = new THREE.LatheGeometry(pts, 40)
  g.rotateX(Math.PI / 2)
  g.translate(0, 0, -L * 0.45)
  g.computeVertexNormals()
  return g
}

export interface AircraftControls {
  group: THREE.Group
  /** Positions (aircraft-local) worth tracking: engines for the contrail. */
  engines: THREE.Vector3[]
  update(time: number, s: { gear: number; landingLights: number; strobes: number; beacon: number; taxiLight: number }, cam: THREE.Vector3): void
}

export function buildAircraft(): AircraftControls {
  const group = new THREE.Group()
  const body = new THREE.Group() // pitch/roll pivot sits at the main gear
  group.add(body)

  const liv = liveryTextures()
  const paint = new THREE.MeshStandardMaterial({
    map: liv.map, emissiveMap: liv.emissiveMap, emissive: new THREE.Color(1.6, 1.25, 0.85),
    roughness: 0.42, metalness: 0.12,
  })
  const white = new THREE.MeshStandardMaterial({ color: 0xdfe0e2, roughness: 0.62, metalness: 0.08 })
  const grey = new THREE.MeshStandardMaterial({ color: 0x8d9298, roughness: 0.5, metalness: 0.35, side: THREE.DoubleSide })
  const dark = new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: 0.6, metalness: 0.2 })
  const metal = new THREE.MeshStandardMaterial({ color: 0xa9adb3, roughness: 0.25, metalness: 0.85 })
  const fin = finTextures()
  const finMat = new THREE.MeshStandardMaterial({ map: fin.map, emissiveMap: fin.emissiveMap, emissive: new THREE.Color(0.55, 0.5, 0.44), roughness: 0.4, metalness: 0.12 })

  const fus = new THREE.Mesh(fuselageGeometry(), paint)
  fus.position.y = CY
  body.add(fus)

  // wings: root chord 6.7 m, tip 1.6 m, 25 degree sweep, a trailing-edge kink
  const wingPlan: [number, number][] = [[1.6, -4.3], [17.0, 2.8], [17.1, 4.4], [6.4, 2.9], [1.6, 2.6]]
  const wingGeo = surface(wingPlan, 0.34)
  for (const side of [1, -1]) {
    const w = new THREE.Group()
    const m = new THREE.Mesh(wingGeo, white)
    w.add(m)
    // sharklet
    const sh = new THREE.Mesh(surface([[0, -0.1], [2.2, 0.95], [2.3, 1.45], [0, 1.55]], 0.12), white)
    sh.rotation.z = Math.PI / 2 - 0.25
    sh.position.set(17.05, 0.12, 2.85)
    w.add(sh)
    w.position.set(0, CY - 1.15, 0)
    w.rotation.z = 0.085
    if (side < 0) { w.scale.x = -1; w.rotation.z = -0.085 }
    body.add(w)
  }

  // engines under the wing, 5.75 m out
  const nac = nacelleGeometry()
  const engines: THREE.Vector3[] = []
  for (const side of [1, -1]) {
    const e = new THREE.Group()
    const shell = new THREE.Mesh(nac, grey)
    e.add(shell)
    const fan = new THREE.Mesh(new THREE.CircleGeometry(0.88, 32), dark)
    fan.position.z = -1.6
    fan.rotation.y = Math.PI
    e.add(fan)
    const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.6, 20), metal)
    spinner.rotation.x = -Math.PI / 2
    spinner.position.z = -1.78
    e.add(spinner)
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.07, 10, 40), metal)
    lip.position.z = -1.98
    e.add(lip)
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.25, 1.1, 20), dark)
    nozzle.rotation.x = Math.PI / 2
    nozzle.position.z = 2.9
    e.add(nozzle)
    const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.1, 4.2), white)
    pylon.position.set(0, 0.95, 0.6)
    e.add(pylon)
    e.position.set(side * 5.75, CY - 2.05, -2.4)
    body.add(e)
    engines.push(new THREE.Vector3(side * 5.75, CY - 2.05, 3.4))
  }

  // tailplane and fin
  const hPlan: [number, number][] = [[0.6, 13.2], [6.2, 16.4], [6.25, 17.5], [0.6, 17.0]]
  const hGeo = surface(hPlan, 0.18)
  for (const side of [1, -1]) {
    const h = new THREE.Mesh(hGeo, white)
    h.position.set(0, CY + 0.75, 0)
    h.rotation.z = 0.1
    if (side < 0) { h.scale.x = -1; h.rotation.z = -0.1 }
    body.add(h)
  }
  const finShape = new THREE.Shape()
  finShape.moveTo(11.4, 0); finShape.lineTo(18.4, 0); finShape.lineTo(18.6, 6.6); finShape.lineTo(16.2, 6.6); finShape.closePath()
  const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.16, bevelSegments: 3, curveSegments: 1 })
  // UVs for the fin texture: planar, from the side
  {
    const p = finGeo.attributes.position as THREE.BufferAttribute
    const uv = finGeo.attributes.uv as THREE.BufferAttribute
    for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) - 11.2) / 7.6, p.getY(i) / 6.8)
  }
  finGeo.rotateY(-Math.PI / 2) // shape X (length) -> +Z
  finGeo.translate(0.15, 0, 0)
  const finMesh = new THREE.Mesh(finGeo, finMat)
  finMesh.position.set(0, CY + 1.25, 0)
  body.add(finMesh)

  // landing gear
  const gear = new THREE.Group()
  const tyre = new THREE.MeshStandardMaterial({ color: 0x0c0d0e, roughness: 0.9 })
  const wheel = new THREE.CylinderGeometry(0.58, 0.58, 0.38, 20)
  wheel.rotateZ(Math.PI / 2)
  for (const side of [1, -1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 2.4, 10), metal)
    leg.position.set(side * 3.8, 1.75, 1.4)
    gear.add(leg)
    for (const dz of [-0.75, 0.75]) for (const dx of [-0.25, 0.25]) {
      const w = new THREE.Mesh(wheel, tyre)
      w.position.set(side * 3.8 + dx * 2.2, 0.58, 1.4 + dz)
      gear.add(w)
    }
  }
  const nleg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.1, 10), metal)
  nleg.position.set(0, 1.55, -13.4)
  gear.add(nleg)
  for (const dx of [-0.22, 0.22]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.26, 18).rotateZ(Math.PI / 2), tyre)
    w.position.set(dx, 0.4, -13.4)
    gear.add(w)
  }
  body.add(gear)

  // the external lights
  const tipY = CY - 1.15 + 15.4 * Math.tan(0.085) + 0.2
  const lights: LightSpec[] = [
    { p: [-17.25, tipY, 3.2], c: [6, 0.35, 0.2], size: 0.55 }, // port nav, red
    { p: [17.25, tipY, 3.2], c: [0.35, 6, 1.9], size: 0.55 }, // starboard nav, green
    { p: [0, CY + 1.62, 18.85], c: [5, 5, 5], size: 0.5 }, // tail nav, white
    { p: [-17.2, tipY, 3.8], c: C.strobe, size: 2.2, mode: LightMode.strobe, phase: 0 },
    { p: [17.2, tipY, 3.8], c: C.strobe, size: 2.2, mode: LightMode.strobe, phase: 0 },
    { p: [0, CY + 1.62, 18.95], c: C.strobe, size: 1.8, mode: LightMode.strobe, phase: 0.02 },
    { p: [0, CY + R + 0.12, -1.2], c: [7, 0.4, 0.2], size: 1.3, mode: LightMode.beacon, phase: 0 },
    { p: [0, CY - R - 0.12, 2.5], c: [7, 0.4, 0.2], size: 1.3, mode: LightMode.beacon, phase: 0.5 },
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
    { p: [-3.4, CY - 1.3, -3.6], c: [9, 8.6, 7.8], size: 1.4 },
    { p: [3.4, CY - 1.3, -3.6], c: [9, 8.6, 7.8], size: 1.4 },
  ]
  const glarePts = makeLights(glare, { extinction: 0 })
  glarePts.frustumCulled = false
  body.add(glarePts)
  const taxi = makeLights([{ p: [0, 1.6, -13.7], c: [8, 7.6, 7], size: 1.2 }], { extinction: 0 })
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
