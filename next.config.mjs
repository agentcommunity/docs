import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Load assets (JS/CSS/images) from the stable docs host when embedded via rewrites
  // on agentcommunity.org. This avoids broken UI due to asset requests hitting the
  // landing project instead of this app.
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || undefined,
};

export default withMDX(config);
