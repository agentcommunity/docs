import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
function normalizeAssetPrefix(input) {
  if (!input) return undefined;
  // Ensure trailing slash so Next.js assembles URLs correctly
  return input.endsWith('/') ? input : input + '/';
}

const config = {
  reactStrictMode: true,
  // Load assets (JS/CSS/images) from the stable docs host when embedded via rewrites
  assetPrefix: normalizeAssetPrefix(process.env.NEXT_PUBLIC_ASSET_PREFIX),
};

export default withMDX(config);
