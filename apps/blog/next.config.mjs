import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({ mdxOptions: { remarkPlugins: [], rehypePlugins: [] } });

/** @type {import('next').NextConfig} */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
const config = {
  reactStrictMode: true,
  basePath: BASE,
  env: { NEXT_PUBLIC_BASE_PATH: BASE },
  async rewrites() {
    if (BASE === '/blog') {
      return [
        { source: '/blog/index.mdx', destination: '/blog/api/mdx/blog' },
        { source: '/blog/:slug*.mdx', destination: '/blog/api/mdx/blog/:slug*' },
        { source: '/blog/:slug*.md', destination: '/blog/api/mdx/blog/:slug*' },
      ];
    }
    // No basePath (e.g., blog.example.org)
    return [
      { source: '/index.mdx', destination: '/api/mdx/blog' },
      { source: '/:slug*.mdx', destination: '/api/mdx/blog/:slug*' },
      { source: '/:slug*.md', destination: '/api/mdx/blog/:slug*' },
    ];
  },
};

export default withMDX(config);
