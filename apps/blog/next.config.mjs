import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({ mdxOptions: { remarkPlugins: [], rehypePlugins: [] } });

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  basePath: '/blog',
  env: { NEXT_PUBLIC_BASE_PATH: '/blog' },
  async rewrites() {
    return [
      // Blog under /blog path
      { source: '/blog/index.mdx', destination: '/blog/api/mdx/blog' },
      { source: '/blog/:slug*.mdx', destination: '/blog/api/mdx/blog/:slug*' },
      // Optional .md aliases
      { source: '/blog/:slug*.md', destination: '/blog/api/mdx/blog/:slug*' },
    ];
  },
};

export default withMDX(config);