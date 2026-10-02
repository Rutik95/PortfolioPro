import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { writeFileSync } from 'fs'
import { site } from './src/config/site'

// Filled in by includedRoutes, used by onFinished to write the sitemap
let pagePaths: string[] = []

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  ssgOptions: {
    // about.html, projects.html … served at /about, /projects by Vercel's cleanUrls
    dirStyle: 'flat',
    formatting: 'minify',
    // Inline critical CSS, but don't preload every font subset (App.vue preloads the Latin one)
    beastiesOptions: { preloadFonts: false },
    // Pre-render every static route, plus /404 (rendered by the catch-all route).
    // Vercel serves dist/404.html for unknown URLs.
    includedRoutes(paths) {
      pagePaths = paths.filter((p) => !p.includes(':'))
      return [...pagePaths, '/404']
    },
    onFinished() {
      const outDir = resolve(__dirname, 'dist')
      const today = new Date().toISOString().slice(0, 10)
      const urls = pagePaths
        .map((p) => `  <url><loc>${new URL(p, site.url)}</loc><lastmod>${today}</lastmod></url>`)
        .join('\n')
      writeFileSync(
        resolve(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
      )
      writeFileSync(
        resolve(outDir, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site.url)}\n`
      )
    },
  },
})
