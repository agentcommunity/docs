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
  async redirects() {
    return [
      {
        source: '/aid',
        destination: 'https://aid.agentcommunity.org/docs',
        permanent: true,
      },
      {
        source: '/aid/:path*',
        destination: 'https://aid.agentcommunity.org/docs/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Community at root
      { source: '/index.mdx', destination: '/api/mdx/docs/index' },
      { source: '/:slug*.mdx', destination: '/api/mdx/docs/:slug*' },
      // Optional .md aliases
      { source: '/:slug*.md', destination: '/api/mdx/docs/:slug*' },
    ];
  },
};

export default withMDX(config);
