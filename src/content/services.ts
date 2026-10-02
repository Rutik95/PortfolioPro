// Services shown on the home page.
// Fill in `price` (starting price) and `timeline` for each service.
// Until a price is set, production shows "Quote after a short call" instead.

export interface Service {
  id: string
  name: string
  summary: string
  includes: string[]
  price: string
  timeline: string
}

export const services: Service[] = [
  {
    id: 'landing-page',
    name: 'Landing page',
    summary:
      'One focused page that turns visitors into enquiries. Good for a launch, an ad campaign or a single service.',
    includes: [
      'Custom design, no templates',
      'Fast on mobile, the way most customers will see it',
      'WhatsApp, call or enquiry form, wherever it helps',
      'SEO basics and proper link previews',
    ],
    price: '[₹ STARTING PRICE]',
    timeline: '[DELIVERY TIME]',
  },
  {
    id: 'business-website',
    name: 'Business website',
    summary:
      'A complete multi-page site for your business, built to be found on Google and easy for customers to act on.',
    includes: [
      'Home, services, about and contact pages',
      'Google Maps, click-to-call and WhatsApp',
      'Sitemap, page titles and Search Console setup',
      'Help connecting your domain and hosting',
    ],
    price: '[₹ STARTING PRICE]',
    timeline: '[DELIVERY TIME]',
  },
  {
    id: 'redesign',
    name: 'Website redesign',
    summary:
      'Your site looks dated or loads slowly. I rebuild it on a modern stack, keep what works and fix what does not.',
    includes: [
      'Review of speed, mobile layout and SEO',
      'New design using your existing content',
      'Redirects so you keep your Google rankings',
      'The care I use migrating legacy screens on a live booking platform',
    ],
    price: '[₹ STARTING PRICE]',
    timeline: '[DELIVERY TIME]',
  },
]
