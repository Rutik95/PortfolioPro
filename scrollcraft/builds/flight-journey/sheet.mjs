// Compose every PNG in a folder into one contact sheet: node sheet.mjs <dir> <cols> <thumbWidth>
import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'
const [dir, cols = '5', tw = '300'] = process.argv.slice(2)
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png') && f !== 'sheet.png').sort((a, b) => parseFloat(a.slice(2)) - parseFloat(b.slice(2)))
const imgs = files.map((f) => `<figure><img src="data:image/png;base64,${fs.readFileSync(path.join(dir, f)).toString('base64')}"><figcaption>${f}</figcaption></figure>`).join('')
const html = `<html><body style="margin:0;background:#111;color:#ccc;font:12px sans-serif;display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:6px;padding:6px">${imgs}<style>figure{margin:0}img{width:100%;display:block}</style></body></html>`
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const p = await b.newPage({ viewport: { width: +cols * (+tw + 6) + 6, height: 400 } })
await p.setContent(html)
await p.screenshot({ path: path.join(dir, 'sheet.png'), fullPage: true })
await b.close()
console.log('sheet', files.length)
