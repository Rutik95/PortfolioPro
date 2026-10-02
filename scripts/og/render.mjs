// Renders the social preview card: node scripts/og/render.mjs
// (run scripts/flight-posters.mjs first; the card uses the landing poster)
import { chromium } from 'playwright-core'
import { fileURLToPath, pathToFileURL } from 'node:url'
const html = pathToFileURL(fileURLToPath(new URL('./og-flight.html', import.meta.url))).href
const out = fileURLToPath(new URL('../../public/og-image.png', import.meta.url))
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--allow-file-access-from-files'] })
const p = await b.newPage({ viewport: { width: 1200, height: 630 } })
await p.goto(html)
await p.waitForTimeout(800)
await p.screenshot({ path: out })
await b.close()
console.log('wrote', out)
