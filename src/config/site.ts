// Single source of truth for URLs, contact details and SEO defaults.
// Values wrapped in [BRACKETS] are placeholders. Fill them in before launch.
// Links whose value is still a placeholder are hidden automatically (see isSet).

export const site = {
  // Change this if you move to a custom domain. Canonical URLs, og:image, sitemap and robots.txt all follow it.
  url: 'https://portfolio-pro-gules-sigma.vercel.app',
  name: 'Rutik Tarerkar',
  shortName: 'Rutik.dev',
  title: 'Rutik Tarerkar | Web Developer for Small Businesses & Startups',
  description:
    'Freelance web developer building fast, modern websites and web apps for small businesses and startups. Close to 4 years shipping production Vue.js on the Thomas Cook / SOTC travel platform.',
  ogImage: '/og-image.png',
  locale: 'en_IN',
  twitterHandle: '', // e.g. '@yourhandle'. Leave empty if you don't use X/Twitter

  email: 'rutiktarekar95@gmail.com',
  location: 'Panvel, Navi Mumbai, India',
  linkedin: 'https://www.linkedin.com/in/rutik-tarekar-r95/',
  github: '[GITHUB_URL]',
  whatsappNumber: '[YOUR_WHATSAPP_NUMBER]', // digits only with country code, e.g. 919800000000
  bookingUrl: '[BOOKING_LINK]', // e.g. your Calendly or Cal.com link
} as const

/** True once a placeholder has been replaced with a real value. */
export const isSet = (value: string) => value.length > 0 && !value.startsWith('[')

export const whatsappLink = (message = "Hi Rutik, I'd like to talk about a website.") =>
  isSet(site.whatsappNumber)
    ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`
    : ''

export const absoluteUrl = (path: string) => new URL(path, site.url).toString()
