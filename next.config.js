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
  // Disable static error pages generation
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Skip error page generation during export
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    // Return only the paths we want, exclude _error
    const pathMap = {};
    for (const path in defaultPathMap) {
      if (!path.includes('/_error') && !path.includes('/404') && !path.includes('/500')) {
        pathMap[path] = defaultPathMap[path];
      }
    }
    return pathMap;
  },
}

module.exports = nextConfig
