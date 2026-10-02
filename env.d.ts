/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/vendor/scrollcraft/scrollcraft.js'

interface ScrollCraftInstance {
  destroy(): void
  layout(): void
  read(): void
}

interface Window {
  ScrollCraft?: { mount(root: Element | Document, opts?: unknown): ScrollCraftInstance; reduce: boolean }
}
