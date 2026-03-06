import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'interest-cohort=(), camera=(), microphone=(), geolocation=()' },
      ],
    },
  ],
  redirects: async () => [
    {
      source: '/docs/index',
      destination: '/docs',
      permanent: true,
    },
    {
      source: '/docs/:path*/index',
      destination: '/docs/:path*',
      permanent: true,
    },
    {
      source: '/aid',
      destination: 'https://aid.agentcommunity.org',
      permanent: true,
    },
    {
      source: '/aid/:path*',
      destination: 'https://aid.agentcommunity.org/docs/:path*',
      permanent: true,
    },
  ],
};

export default nextConfig;
