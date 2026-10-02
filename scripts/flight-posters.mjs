// Renders each leg's fallback poster from the live WebGL scene.
// Posters are what reduced-motion and no-WebGL visitors see, so they are
// frames of the real world, not separate art.
//
//   npm run dev            (in another terminal)
//   node scripts/flight-posters.mjs [http://localhost:5173]
//
// Writes public/flight/posters/<leg>.webp (1600x900) and <leg>-m.webp (720x1560).
import { chromium } from 'playwright-core'
import fs from 'node:fs'

const base = process.argv[2] || 'http://localhost:5173'
const out = new URL('../public/flight/posters/', import.meta.url)
fs.mkdirSync(out, { recursive: true })

const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const browser = await chromium.launch({ executablePath: chrome, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] })

for (const [suffix, width, height] of [['', 1600, 900], ['-m', 360, 780]]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: suffix ? 2 : 1 })
  await page.goto(`${base}/?poster`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__flight, null, { timeout: 30000 })
  await page.waitForTimeout(1500)
  const legs = await page.evaluate(() => window.__flight.legs)
  for (const leg of legs) {
    // render a few frames first so time-based lights settle, then capture
    const data = await page.evaluate(async (t) => {
      for (let i = 0; i < 6; i++) { window.__flight.capture(t); await new Promise((r) => requestAnimationFrame(r)) }
      return window.__flight.capture(t)
    }, leg.t)
    const buf = Buffer.from(data.split(',')[1], 'base64')
    fs.writeFileSync(new URL(`${leg.id}${suffix}.webp`, out), buf)
    console.log(`${leg.id}${suffix}.webp`, (buf.length / 1024).toFixed(0) + ' KB')
  }
  await page.close()
}
await browser.close()
