// Full-page screenshots of the document routes: node pages.mjs <base> <outdir> <w> <h>
import { chromium } from 'playwright-core'
import fs from 'node:fs'
const [base, out, w, h] = process.argv.slice(2)
fs.mkdirSync(out, { recursive: true })
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const p = await b.newPage({ viewport: { width: +w, height: +h } })
p.on('pageerror', (e) => console.log('[pageerror]', e.message))
p.on('console', (m) => { if (m.type() === 'error') console.log('[console]', m.text().slice(0, 200)) })
for (const r of ['about', 'projects', 'contact', 'nowhere']) {
  await p.goto(`${base}/${r}`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(600)
  await p.screenshot({ path: `${out}/${r}.png`, fullPage: true })
  console.log('page', r)
}
await b.close()
