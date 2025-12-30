/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable webpack cache to avoid permission issues on Windows
  webpack: (config, { isServer }) => {
    config.cache = false;
    
    // Exclude emails directory from being processed
    config.module.rules.push({
      test: /src\/emails\/.*/,
      use: 'ignore-loader',
    });
    
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
  // Explicitly exclude emails directory from page routing
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].map(ext => {
    return ext;
  }),
}

module.exports = nextConfig
