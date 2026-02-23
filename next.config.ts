import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  redirects: async () => [
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
