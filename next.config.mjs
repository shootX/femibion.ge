/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  experimental: {
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
    ]
  },
}

export default nextConfig
