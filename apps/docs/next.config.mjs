import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({
  mdxOptions: { remarkPlugins: [], rehypePlugins: [] },
});

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  async rewrites() {
    return [
      // Pretty .mdx export for AID at /aid/*
      {
        source: '/aid/:path*.mdx',
        destination: '/api/mdx/aid/:path*',
      },
      // Pretty .mdx export for Community docs under /docs (traditional setup)
      {
        source: '/docs/:path*.mdx',
        destination: '/api/mdx/docs/:path*',
      },
      // Pretty .mdx export for Community docs at root (docs.agentcommunity.org)
      {
        source: '/:path*.mdx',
        destination: '/api/mdx/docs/:path*',
      },
    ];
  },
};

export default withMDX(config);