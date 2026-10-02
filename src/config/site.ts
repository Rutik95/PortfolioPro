// Single source of truth for URLs, contact details and SEO defaults.
// Values wrapped in [BRACKETS] are placeholders. Fill them in before launch.
// While a value is still a placeholder it shows as a highlighted marker in `npm run dev`
// and is hidden (or falls back to email) in the production build. See isSet().

export const site = {
  // Change this if you move to a custom domain. Canonical URLs, og:image, sitemap and robots.txt all follow it.
  url: 'https://portfolio-pro-gules-sigma.vercel.app',
  name: 'Rutik Tarerkar',
  firstName: 'Rutik',
  title: 'Rutik Tarerkar | Web Developer for Small Businesses & Startups',
  description:
    'Freelance web developer building fast, modern websites and web apps for small businesses and startups. 4 years building production web apps, currently on the Thomas Cook / SOTC travel platform.',
  ogImage: '/og-image.jpg',
  locale: 'en_IN',
  twitterHandle: '', // e.g. '@yourhandle'. Leave empty if you don't use X/Twitter

  email: 'rutiktarekar95@gmail.com',
  location: 'Panvel, Navi Mumbai, India',
  linkedin: 'https://www.linkedin.com/in/rutik-tarekar-r95/',
  github: '[GITHUB_URL]', // e.g. https://github.com/Rutik95
  whatsappNumber: '[YOUR_WHATSAPP_NUMBER]', // digits only with country code, e.g. 919800000000
  bookingUrl: '[BOOKING_LINK]', // your Calendly or Cal.com link
  photo: '[ADD_PHOTO]', // e.g. '/rutik.jpg' after adding a square photo (at least 800x800) to public/
  responseTime: '[RESPONSE_TIME]', // e.g. 'within 24 hours'
  // Optional looping hero video, e.g. '/hero-loop.mp4' in public/. Use footage you have the rights to,
  // keep it under ~4MB (720p, no audio). Leave empty to use the CSS ember backdrop.
  heroVideo: '',
} as const

/** True once a placeholder has been replaced with a real value. */
export const isSet = (value: string | undefined | null): value is string =>
  !!value && value.length > 0 && !value.startsWith('[')

/** Placeholders are made visible while developing so you can see what still needs filling in. */
// (optional chaining because vite.config.ts also imports this file, where import.meta.env is not defined)
export const showPlaceholders = !!import.meta.env?.DEV

export const whatsappHref = (message = "Hi Rutik, I'd like to talk about a website for my business.") =>
  isSet(site.whatsappNumber)
    ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`
    : ''

/** Booking link, falling back to an email with a ready-made subject until a booking link is added. */
export const bookingHref = () =>
  isSet(site.bookingUrl)
    ? site.bookingUrl
    : `mailto:${site.email}?subject=${encodeURIComponent('Book a call: website project')}`

export const absoluteUrl = (path: string) => new URL(path, site.url).toString()
