import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import App from './App.vue'
import { routes, scrollBehavior } from './router'
import '@fontsource-variable/geist'
import '@fontsource-variable/archivo/wdth.css'
import './vendor/scrollcraft/scrollcraft.css'
import './assets/main.css'

// vite-ssg pre-renders every route to static HTML at build time,
// then hydrates it in the browser like a normal Vue SPA.
export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior, base: import.meta.env.BASE_URL },
  ({ app }) => {
    app.use(createPinia())
  }
)
