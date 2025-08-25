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
      // Community at root
      { source: '/index.mdx', destination: '/api/mdx/docs' },
      { source: '/:slug*.mdx', destination: '/api/mdx/docs/:slug*' },
      // Optional .md aliases
      { source: '/:slug*.md', destination: '/api/mdx/docs/:slug*' },
      // AID under /aid
      { source: '/aid.mdx', destination: '/api/mdx/aid' },
      { source: '/aid/:slug*.mdx', destination: '/api/mdx/aid/:slug*' },
      { source: '/aid/:slug*.md', destination: '/api/mdx/aid/:slug*' },
    ];
  },
};

export default withMDX(config);