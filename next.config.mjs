import withPlaiceholder from '@plaiceholder/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // ref: https://github.com/vercel/next.js/issues/40183#issuecomment-1572600785
  transpilePackages: [
    "query-string",
    "decode-uri-component",
    "filter-obj",
    "split-on-first",
  ],
  experimental: {
    esmExternals: true,
  },
  webpack(config, { isServer }) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
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
  // enable CORS [ref: https://vercel.com/guides/how-to-enable-cors]
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

export default withPlaiceholder(nextConfig);
