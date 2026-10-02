<template>
  <article class="doc">
    <header class="doc__head">
      <p class="doc__kicker">Arrivals</p>
      <h1 class="doc__title">Contact</h1>
      <p class="doc__lede">
        Open to frontend roles and freelance work in Vue, Nuxt and travel technology.
        Email is the fastest way to reach me.
      </p>
    </header>

    <div class="contact">
      <section aria-labelledby="h-direct">
        <h2 id="h-direct" class="doc__h2">Direct</h2>
        <dl class="lines">
          <div>
            <dt>Email</dt>
            <dd><a class="link" :href="`mailto:${site.email}`">{{ site.email }}</a></dd>
          </div>
          <div>
            <dt>LinkedIn</dt>
            <dd><a class="link" :href="site.linkedin" target="_blank" rel="noopener noreferrer">{{ site.linkedin.replace('https://www.', '').replace(/\/$/, '') }}</a></dd>
          </div>
          <div v-if="isSet(site.github)">
            <dt>GitHub</dt>
            <dd><a class="link" :href="site.github" target="_blank" rel="noopener noreferrer">{{ site.github.replace('https://', '') }}</a></dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd><a class="link" :href="`tel:${site.phone.replace(/\s/g, '')}`">{{ site.phone }}</a></dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd>{{ site.location }}</dd>
          </div>
          <div>
            <dt>CV</dt>
            <dd><a class="link" :href="site.resume" download>Download the PDF</a></dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="h-write">
        <h2 id="h-write" class="doc__h2">Write a message</h2>
        <form class="form" action="#" method="post" @submit.prevent="compose">
          <label class="field">
            <span>Your name</span>
            <input v-model.trim="form.name" type="text" name="name" autocomplete="name" required />
          </label>
          <label class="field">
            <span>What it's about</span>
            <input v-model.trim="form.subject" type="text" name="subject" required />
          </label>
          <label class="field">
            <span>Message</span>
            <textarea v-model.trim="form.message" name="message" rows="6" required></textarea>
          </label>
          <div class="form__foot">
            <button class="btn" type="submit">Email Rutik</button>
            <p class="form__note">Opens your email app with this message filled in. Nothing is sent from this page.</p>
          </div>
        </form>
      </section>
    </div>
  </article>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { site, isSet } from '@/config/site'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo({
  title: 'Contact',
  description: `Get in touch with ${site.name} about frontend roles and freelance work in Vue, Nuxt and travel technology.`,
  path: '/contact',
})

const form = reactive({ name: '', subject: '', message: '' })

// Honest by construction: there is no backend, so the form hands the message
// to the visitor's own mail client instead of pretending to send it.
function compose() {
  const body = `${form.message}\n\n${form.name}`
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`
}
</script>

<style scoped>
.contact { display: grid; grid-template-columns: 1fr 1.1fr; gap: clamp(3rem, 7vw, 7rem); }
.lines { margin: 0; display: grid; }
.lines > div { display: grid; grid-template-columns: 7.5rem 1fr; gap: var(--sc-4); padding: var(--sc-4) 0; border-top: 1px solid var(--sc-hairline); }
.lines > div:last-child { border-bottom: 1px solid var(--sc-hairline); }
.lines dt { font-size: var(--sc-t-xs); letter-spacing: 0.14em; text-transform: uppercase; color: var(--sc-ink-soft); padding-top: 0.3em; }
.lines dd { margin: 0; overflow-wrap: anywhere; }

.form { display: grid; gap: var(--sc-5); }
.field { display: grid; gap: var(--sc-2); }
.field span { font-size: var(--sc-t-sm); color: var(--sc-ink-soft); }
.field input, .field textarea {
  width: 100%;
  padding: 0.8rem 0.95rem;
  background: var(--sc-surface);
  border: 1px solid var(--sc-hairline-strong);
  border-radius: var(--sc-r-sm);
  color: var(--sc-ink);
  font-size: var(--sc-t-base);
  transition: border-color 140ms var(--sc-ease-out);
}
.field textarea { resize: vertical; min-height: 9rem; }
.field input:focus-visible, .field textarea:focus-visible { border-color: var(--sc-accent); outline-offset: 1px; }
.form__foot { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sc-3) var(--sc-5); }
.form__note { margin: 0; font-size: var(--sc-t-xs); color: var(--sc-ink-soft); max-width: 30ch; }

@media (max-width: 860px) {
  .contact { grid-template-columns: 1fr; }
  .lines > div { grid-template-columns: 6rem 1fr; }
}
</style>
