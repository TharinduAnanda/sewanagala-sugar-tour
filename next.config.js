/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable webpack cache for production builds
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
  // Optimize build for production
  swcMinify: true,
}

module.exports = nextConfig
