import { useHead, useSeoMeta } from '@unhead/vue'
import { site, absoluteUrl } from '@/config/site'

interface PageSeo {
  title?: string
  description?: string
  path: string
  /** For pages that shouldn't appear in search results (e.g. 404) */
  noindex?: boolean
}

const imageAlt = `${site.name}, ${site.role.toLowerCase()} for travel platforms`

/** Per-page title, description, canonical URL, Open Graph and Twitter card tags. */
export function usePageSeo({ title, description = site.description, path, noindex = false }: PageSeo) {
  const fullTitle = title ? `${title} | ${site.name}` : site.title
  const url = absoluteUrl(path)
  const image = absoluteUrl(site.ogImage)

  useHead({
    link: noindex ? [] : [{ rel: 'canonical', href: url }],
    meta: noindex ? [{ name: 'robots', content: 'noindex' }] : [],
  })

  useSeoMeta({
    title: fullTitle,
    description,
    ogType: 'website',
    ogSiteName: site.name,
    ogLocale: site.locale,
    ogTitle: fullTitle,
    ogDescription: description,
    ogUrl: url,
    ogImage: image,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/png',
    ogImageAlt: imageAlt,
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: image,
    twitterImageAlt: imageAlt,
    ...(site.twitterHandle ? { twitterSite: site.twitterHandle, twitterCreator: site.twitterHandle } : {}),
  })
}
