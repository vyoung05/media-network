/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@media-network/shared', '@media-network/ui'],
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      // Add Supabase storage domain when configured
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@media-network/shared', '@media-network/ui'],
  },
};

module.exports = nextConfig;
