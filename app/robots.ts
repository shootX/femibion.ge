import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/adminpc/', '/api/'],
      },
    ],
    sitemap: 'https://femibion.ge/sitemap.xml',
  }
}
