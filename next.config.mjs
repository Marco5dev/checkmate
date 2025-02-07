/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['checkmate.marco5dev.me'],
  },
  experimental: {
    serverActions: true,
  },
  siteMap: {
    hostname: 'https://checkmate.marco5dev.me',
    gzip: true,
    generateRobotsTxt: true,
    exclude: ['/api/*'],
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/*']
        }
      ],
      additionalSitemaps: [
        'https://checkmate.marco5dev.me/sitemap.xml'
      ]
    }
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
