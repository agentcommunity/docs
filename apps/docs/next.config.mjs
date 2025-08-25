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
      // Pretty .mdx export for docs and aid
      {
        source: '/:section(docs|aid)/:path*.mdx',
        destination: '/api/mdx/:section/:path*',
      },
    ];
  },
};

export default withMDX(config);