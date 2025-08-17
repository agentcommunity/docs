import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({
  mdxOptions: { remarkPlugins: [], rehypePlugins: [] },
});

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Serve the docs app under /docs so assets, data, and routes are namespaced
  basePath: '/docs',
  env: {
    // Expose base path to client for constructing absolute URLs to API routes
    NEXT_PUBLIC_BASE_PATH: '/docs',
  },
  experimental: {
    externalDir: true,
  },
};

export default withMDX(config);