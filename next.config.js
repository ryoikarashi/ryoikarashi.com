const { withPlaiceholder } = require('@plaiceholder/next');

/** @type {import('next').NextConfig} */
const nextConfig = withPlaiceholder({
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  eslint: {
    dirs: ['app', 'clientApis', 'components', 'hooks', 'packages', 'stores'],
  },
});

module.exports = nextConfig;
