/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    // Only disable cache in development on Windows
    if (dev && process.platform === 'win32') {
      config.cache = false;
    }
    return config;
  },
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
  // Skip static generation of error pages
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Disable static optimization for all pages
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
