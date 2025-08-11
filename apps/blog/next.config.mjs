import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({ mdxOptions: { remarkPlugins: [], rehypePlugins: [] } });

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  basePath: '/blog',
};

export default withMDX(config);