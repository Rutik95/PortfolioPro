// Shoot the flight at given track positions (in viewport-heights).
// node frames.mjs <url> <outdir> <w> <h> t1 t2 ...
import { chromium } from 'playwright-core'
import fs from 'node:fs'
const [url, out, w, h, ...ts] = process.argv.slice(2)
fs.mkdirSync(out, { recursive: true })
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 })
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[console]', m.type(), m.text().slice(0, 200)) })
page.on('pageerror', (e) => console.log('[pageerror]', e.message))
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
for (const t of ts) {
  await page.evaluate((t) => window.scrollTo(0, t * innerHeight), +t)
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `${out}/t-${(+t).toFixed(2)}.png` })
  console.log('shot', t)
}
await browser.close()
