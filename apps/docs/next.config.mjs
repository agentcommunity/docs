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
      // Docs (root and nested)
      { source: '/docs.mdx', destination: '/api/mdx/docs' },
      { source: '/:slug*.mdx', destination: '/api/mdx/docs/:slug*' },
      { source: '/docs/:slug*.mdx', destination: '/api/mdx/docs/:slug*' },
      // AID (root and nested)
      { source: '/aid.mdx', destination: '/api/mdx/aid' },
      { source: '/aid/:slug*.mdx', destination: '/api/mdx/aid/:slug*' },
    ];
  },
};

export default withMDX(config);