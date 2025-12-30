/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable webpack cache to avoid permission issues on Windows
  webpack: (config, { isServer }) => {
    config.cache = false;
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
}

module.exports = nextConfig
