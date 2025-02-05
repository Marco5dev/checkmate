/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'easymde': 'easymde/dist/easymde.min.js',
    };
    return config;
  },
};

export default nextConfig;
