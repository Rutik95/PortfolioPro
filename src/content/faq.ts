// Common questions from small-business clients. Edit freely so the answers match how you work.
// Answers containing a [PLACEHOLDER] are hidden in production until filled in.

export interface Faq {
  q: string
  a: string
}

export const faqs: Faq[] = [
  {
    q: 'How much does a website cost?',
    a: 'It depends on the number of pages and features. After a short call you get a fixed quote, before any work starts.',
  },
  {
    q: 'How long does it take?',
    a: '[HOW LONG A TYPICAL PROJECT TAKES, e.g. "Most landing pages take about a week once the content is ready."]',
  },
  {
    q: 'Will my website show up on Google?',
    a: 'Every site ships with the SEO basics: fast loading, proper page titles and descriptions, a sitemap and Google Search Console. Rankings take time and depend on your competition, so I will not promise page one.',
  },
  {
    q: 'What do I need to get started?',
    a: 'A short call about your business and your customers. If you have a logo, photos or an existing site, share them. If not, we will work out what you need together.',
  },
]
