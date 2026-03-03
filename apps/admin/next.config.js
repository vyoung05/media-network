/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@media-network/shared', '@media-network/ui'],
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@media-network/shared', '@media-network/ui'],
    // Skip prerender errors for dynamic dashboard pages
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;
