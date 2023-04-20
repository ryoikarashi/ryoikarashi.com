const { withPlaiceholder } = require('@plaiceholder/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  eslint: {
    dirs: [
      'app',
      'clientApis',
      'components',
      'hooks',
      'packages',
      'stores',
      'libs',
    ],
  },
};

module.exports = withPlaiceholder(nextConfig);
