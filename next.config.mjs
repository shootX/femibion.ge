/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  // Next's default stale window is a year. A CDN can keep an old "/" HTML
  // (previous header) long after other routes have been regenerated.
  expireTime: 60,
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    localPatterns: [
      {
        pathname: '/images/**',
      },
    ],
  },
  compress: true,
  async redirects() {
    return [
      {
        source: '/blog/sheshupeba-orsulobaze',
        destination: '/blog/shesheupeba-orsulobaze',
        permanent: true,
      },
      {
        source: '/blog/dzilis-problemebi-orsulobisas',
        destination: '/blog/dzili-orsulobaze',
        permanent: true,
      },
    ]
  },
  async headers() {
    const htmlCache = [
      { key: 'CDN-Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=60' },
    ]
    const pages = ['/', '/femibion-1', '/femibion-2', '/blog', '/blog/:path*', '/faq', '/privacy', '/terms']
    return [
      ...pages.map((source) => ({ source, headers: htmlCache })),
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, must-revalidate' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },
}

export default nextConfig
