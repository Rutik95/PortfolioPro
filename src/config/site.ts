// Single source of truth for URLs, contact details and SEO defaults.
// Values wrapped in [BRACKETS] are placeholders. Fill them in before launch.
// Links whose value is still a placeholder are hidden automatically (see isSet).

export const site = {
  // Change this if you move to a custom domain. Canonical URLs, og:image, sitemap and robots.txt all follow it.
  url: 'https://portfolio-pro-gules-sigma.vercel.app',
  // The CV spells the surname "Tarerkar"; the email, LinkedIn handle and git user spell it "Tarekar".
  // Confirm which is correct and change it here: every page, title and meta tag follows.
  name: 'Rutik Tarekar',
  shortName: 'Rutik Tarekar',
  role: 'Frontend Engineer',
  title: 'Rutik Tarekar | Frontend Engineer for travel platforms',
  description:
    'Frontend engineer building travel and aviation platforms since 2022. Currently owning the Flights frontend on the Thomas Cook travel platform. Vue 2 & 3, Nuxt, REST APIs, AI-assisted development.',
  ogImage: '/og-image.png',
  locale: 'en_IN',
  twitterHandle: '', // e.g. '@yourhandle'. Leave empty if you don't use X/Twitter

  email: 'rutiktarekar95@gmail.com',
  phone: '+91 9892637250',
  location: 'Panvel, Navi Mumbai, India',
  linkedin: 'https://www.linkedin.com/in/rutik-tarekar-r95/',
  github: '[GITHUB_URL]',
  resume: '/Rutik-Tarekar-CV.pdf',
  whatsappNumber: '[YOUR_WHATSAPP_NUMBER]', // digits only with country code, e.g. 919800000000
  bookingUrl: '[BOOKING_LINK]', // e.g. your Calendly or Cal.com link
} as const

/** True once a placeholder has been replaced with a real value. */
export const isSet = (value: string) => value.length > 0 && !value.startsWith('[')

export const whatsappLink = (message = "Hi Rutik, I'd like to talk about a frontend role.") =>
  isSet(site.whatsappNumber)
    ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`
    : ''

export const absoluteUrl = (path: string) => new URL(path, site.url).toString()
