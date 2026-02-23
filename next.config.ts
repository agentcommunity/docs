import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
