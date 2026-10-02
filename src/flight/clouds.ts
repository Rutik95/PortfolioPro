import * as THREE from 'three'
import { CLOUD_BASE, CLOUD_TOP } from './path'

// The cloud deck is a real volume: one box spanning the layer around the
// camera, whose back faces march a ray through the slab and integrate density
// with Beer-Lambert absorption. Stacked slices were cheaper and terraced into
// contour lines at every oblique angle, which is most of the angles a flight
// has. Tops are lit by the moon, bases by the cities underneath, and the deck
// is also the seam that hides every change of scene.

const vert = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`

const frag = /* glsl */ `
  uniform sampler2D uNoise;
  uniform float uTime;
  uniform vec3 uMoonDir;
  uniform vec4 uGaps[3];     // x, z, radius, softness
  uniform vec4 uGlow[2];     // x, z, radius, strength: city light on the base
  uniform vec3 uSky;
  uniform float uBelow;
  uniform float uSteps;
  varying vec3 vWorld;

  const float BASE = ${CLOUD_BASE.toFixed(1)};
  const float TOP = ${CLOUD_TOP.toFixed(1)};

  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }

  float coverage(vec2 p) {
    vec2 wind = vec2(uTime * 2.2, uTime * 0.9);
    float big = texture2D(uNoise, (p + wind * 0.3) / 52000.0).g;
    float a = texture2D(uNoise, (p + wind) / 9000.0).r;
    float b = texture2D(uNoise, (p + wind * 1.6) / 2600.0 + 0.37).r;
    float m = a * 0.62 + b * 0.38 + (big - 0.5) * 0.6;
    for (int i = 0; i < 3; i++) {
      float r = distance(p, uGaps[i].xy);
      m -= (1.0 - smoothstep(uGaps[i].z, uGaps[i].z + uGaps[i].w, r)) * 0.6;
    }
    return m;
  }

  float density(vec3 p, float cov) {
    float h = clamp((p.y - BASE) / (TOP - BASE), 0.0, 1.0);
    // flat-ish bases, rounded tops
    float thr = 0.43 + 0.24 * pow(h, 1.6) + 0.1 * pow(1.0 - h, 8.0);
    float detail = texture2D(uNoise, p.xz / 640.0 + vec2(h * 0.21, h * 0.13) + uTime * 0.004).g;
    return smoothstep(thr, thr + 0.09, cov + (detail - 0.5) * 0.12);
  }

  void main() {
    vec3 ro = cameraPosition;
    vec3 rd = normalize(vWorld - ro);
    float tBack = length(vWorld - ro);
    float t0, t1;
    if (abs(rd.y) < 1e-4) {
      if (ro.y < BASE || ro.y > TOP) discard;
      t0 = 0.0; t1 = tBack;
    } else {
      float ta = (BASE - ro.y) / rd.y;
      float tb = (TOP - ro.y) / rd.y;
      t0 = max(min(ta, tb), 0.0);
      t1 = min(max(ta, tb), tBack);
    }
    if (t1 <= t0) discard;
    t1 = min(t1, t0 + 7000.0);

    float n = uSteps;
    float dt = (t1 - t0) / n;
    float t = t0 + dt * hash(gl_FragCoord.xy + fract(uTime) * 61.0);
    float T = 1.0;
    vec3 C = vec3(0.0);
    vec3 moonCol = vec3(0.21, 0.245, 0.31);
    vec3 baseCol = vec3(0.012, 0.015, 0.022);
    for (int i = 0; i < 48; i++) {
      if (float(i) >= n || T < 0.02) break;
      vec3 p = ro + rd * t;
      float cov = coverage(p.xz);
      float d = cov > 0.33 ? density(p, cov) : 0.0;
      if (d > 0.001) {
        float h = clamp((p.y - BASE) / (TOP - BASE), 0.0, 1.0);
        float glow = 0.0;
        for (int k = 0; k < 2; k++) {
          float r = distance(p.xz, uGlow[k].xy) / uGlow[k].z;
          glow += uGlow[k].w * exp(-r * r * 2.2);
        }
        // light: the moon on the upper part of each puff, the city glow on the
        // underside; density darkens the core so puffs read as rounded
        float lit = pow(h, 1.25) * (0.4 + 0.6 * smoothstep(0.38, 0.72, cov));
        vec3 L = baseCol + moonCol * lit * (1.0 - 0.45 * d)
               + vec3(0.25, 0.13, 0.06) * glow * pow(1.0 - h, 2.0) * (1.0 - 0.6 * uBelow);
        float sigma = d * 0.0105;
        float a = 1.0 - exp(-sigma * dt);
        C += T * a * L;
        T *= 1.0 - a;
      }
      t += dt;
    }
    float A = 1.0 - T;
    if (A < 0.003) discard;
    // atmospheric perspective by distance to where the cloud starts
    float fog = 1.0 - exp(-t0 * t0 * 3.2e-10);
    C = mix(C, uSky * A, fog);
    A *= 1.0 - fog * 0.55;
    C *= mix(1.0, 0.16, uBelow);
    A *= mix(1.0, 0.32, uBelow);
    gl_FragColor = vec4(C, A); // premultiplied
  }
`

export function buildClouds(noise: THREE.Texture, steps: number) {
  const uniforms = {
    uNoise: { value: noise },
    uTime: { value: 0 },
    uMoonDir: { value: new THREE.Vector3(0.6, 0.35, -0.5).normalize() },
    uGaps: { value: [new THREE.Vector4(0, 1e9, 1, 1), new THREE.Vector4(0, 1e9, 1, 1), new THREE.Vector4(0, 1e9, 1, 1)] },
    uGlow: { value: [new THREE.Vector4(0, 0, 1, 0), new THREE.Vector4(0, 0, 1, 0)] },
    uSky: { value: new THREE.Color(0.03, 0.04, 0.06) },
    uBelow: { value: 0 },
    uSteps: { value: steps },
  }
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
  })
  const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat)
  box.scale.set(90000, CLOUD_TOP - CLOUD_BASE, 90000)
  box.position.y = (CLOUD_BASE + CLOUD_TOP) / 2
  box.frustumCulled = false
  box.renderOrder = 10
  const group = new THREE.Group()
  group.add(box)

  // Inside the cloud, the camera sees grey on every side. One full-screen
  // layer carries that texture and motion.
  const veil = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms: { uIn: { value: 0 }, uTime: uniforms.uTime, uNoise: uniforms.uNoise, uTint: { value: new THREE.Color(0.15, 0.16, 0.19) } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: /* glsl */ `
        uniform float uIn; uniform float uTime; uniform sampler2D uNoise; uniform vec3 uTint;
        varying vec2 vUv;
        void main(){
          float n = texture2D(uNoise, vUv * 0.7 + vec2(uTime * 0.02, uTime * 0.05)).r;
          float m = texture2D(uNoise, vUv * 1.9 - vec2(uTime * 0.05, uTime * 0.11)).g;
          float a = uIn * (0.7 + 0.3 * (n * 0.6 + m * 0.4));
          gl_FragColor = vec4(uTint * (0.75 + 0.5 * n), clamp(a, 0.0, 0.95));
        }`,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    }),
  )
  veil.frustumCulled = false
  veil.renderOrder = 100

  return {
    group, uniforms, veil,
    update(cam: THREE.Vector3) {
      box.position.x = Math.round(cam.x / 500) * 500
      box.position.z = Math.round(cam.z / 500) * 500
      const y = cam.y
      uniforms.uBelow.value = 1 - THREE.MathUtils.smoothstep(y, CLOUD_BASE - 500, CLOUD_BASE - 40)
      const inside = THREE.MathUtils.smoothstep(y, CLOUD_BASE - 30, CLOUD_BASE + 90) * (1 - THREE.MathUtils.smoothstep(y, CLOUD_TOP - 110, CLOUD_TOP + 20))
      ;(veil.material as THREE.ShaderMaterial).uniforms.uIn.value = inside
      return inside
    },
  }
}
