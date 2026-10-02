import { chromium } from 'playwright-core'
const base = process.argv[2]
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--use-angle=d3d11'] })
const p = await b.newPage({ viewport: { width: 1280, height: 800 } })
const errs = []; p.on('pageerror', (e) => errs.push(e.message))
await p.goto(base + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500)
// rail: click the Landing waypoint
await p.click('button.rail__leg >> text=Landing'); await p.waitForTimeout(2500)
const t1 = await p.evaluate(() => scrollY / innerHeight)
// keyboard: focus the finale's email link from the top
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500)
await p.focus('.finale a.btn'); await p.waitForTimeout(800)
const fin = await p.evaluate(() => ({ t: scrollY / innerHeight, op: getComputedStyle(document.querySelector('.finale')).opacity, href: document.querySelector('.finale a.btn').getAttribute('href') }))
// no-WebGL / fallback path
await p.goto(base + '/?fallback', { waitUntil: 'networkidle' }); await p.waitForTimeout(800)
const fb = await p.evaluate(() => ({ posters: document.querySelector('.flight__stage').classList.contains('is-posters'), src: document.querySelector('.sc-world__poster').currentSrc, loaded: document.querySelector('.sc-world__poster').naturalWidth }))
// reduced motion
const rm = await b.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })
await rm.goto(base + '/', { waitUntil: 'networkidle' }); await rm.waitForTimeout(800)
const red = await rm.evaluate(() => ({ posters: document.querySelector('.flight__stage').classList.contains('is-posters'), hero: getComputedStyle(document.querySelector('.hero')).opacity }))
// prerendered routes carry their content in the HTML
const routes = {}
for (const r of ['about', 'projects', 'contact']) {
  const res = await fetch(`${base}/${r}.html`); const html = await res.text()
  routes[r] = { status: res.status, hasH1: /<h1[^>]*>/.test(html), title: (html.match(/<title>([^<]*)/) || [])[1] }
}
const home = await (await fetch(base + '/')).text()
console.log(JSON.stringify({ railLandingT: t1.toFixed(2), finale: fin, fallback: fb, reduced: red, routes, homeHasCopy: home.includes('The route so far') && home.includes('Approach checklist'), errs }, null, 1))
await b.close()
