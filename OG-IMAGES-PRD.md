# PRD: Open Graph (OG) Images for Docs and Blog (Fumadocs)

## Summary
- Add robust, consistent Open Graph images for both the docs and blog surfaces using Fumadocs’ recommended meta and OG helpers.
- Docs already implement dynamic OG images via `fumadocs-ui/og`; blog needs a parallel implementation.

## Goals
- Docs: Confirm and standardize OG image generation and meta tags across all docs routes (community and AID subsections).
- Blog: Implement OG image generation and wire up meta tags for posts and the blog index.
- Twitter cards: Use `summary_large_image` consistently with the same image URL as Open Graph.
- Ensure output works with `metadataBase` so Next.js generates absolute URLs.

## Non‑Goals
- Custom Satori templates or brand-heavy bespoke designs beyond the default Fumadocs OG helper.
- Multi-tenant theming, localized images, or per-tag image templates.

## Current State (as of repo scan)
- Docs page meta: `app/docs/[[...slug]]/page.tsx`
  - Uses `generateMetadata` and sets `openGraph.images` to `/docs-og/.../image.png` and `twitter.card = summary_large_image` with matching images.
  - Uses `metadataBase` in `app/layout.tsx` so OG image URLs will resolve to absolute URLs.
- Docs OG route: `app/docs-og/[...slug]/route.tsx`
  - Uses `generateOGImage` from `fumadocs-ui/og` with title/description and site label.
  - Supports both community docs and AID docs (via `source` and `aidSource`).
- Blog page meta: `app/blog/[[...slug]]/page.tsx`
  - Has `generateMetadata` but does NOT set `openGraph.images` or `twitter.images` for posts or the index.
  - No blog OG route exists.

Conclusion: Docs are already aligned with Fumadocs’ OG image helper; blog needs parity.

## Requirements
- Docs
  - Keep dynamic OG image generation at `/docs-og/[...slug]/image.png`.
  - Keep `openGraph.images` and `twitter.card = summary_large_image` with same image URL.
  - Work for root docs index, nested pages, and AID subsection.
- Blog
  - Add dynamic OG image generation at `/blog-og/[...slug]/image.png` that pulls `title` and `description` from blog frontmatter.
  - Update blog `generateMetadata` to include `openGraph.images` and `twitter.card = summary_large_image` with the same image.
  - Handle both the blog root (index listing) and individual posts.
- General
  - Use `metadataBase` from `app/layout.tsx` to ensure absolute URLs in meta tags without hardcoding.
  - Fail gracefully if `description` is missing (omit or provide a short default).

## Design
- Use Fumadocs’ OG helper: `import { generateOGImage } from 'fumadocs-ui/og'`.
- Route structure mirrors docs:
  - Blog OG: `app/blog-og/[...slug]/route.tsx` with `GET` handler parsing `slug` and returning `generateOGImage({ title, description, site: 'Agent Community Blog' })`.
  - Pre-generate static params (optional) using `blogSource.generateParams()` and append `image.png`, same as docs.
- Metadata wiring in `generateMetadata`:
  - Compute `const image = ['/blog-og', ...slug, 'image.png'].join('/')` for posts.
  - For blog root, either use `['/blog-og', 'image.png'].join('/')` or a static fallback in `public/og/blog-home.png`.
  - Set both `openGraph.images` and `twitter: { card: 'summary_large_image', images: image }`.

## File‑Level Changes
- Keep (no changes):
  - `app/docs/[[...slug]]/page.tsx` (already sets OG images correctly).
  - `app/docs-og/[...slug]/route.tsx` (already generates images).
- Add:
  - `app/blog-og/[...slug]/route.tsx`
    - Same pattern as docs with `blogSource`.
    - For `slug` that ends in `image.png`, resolve page using `blogSource.getPage(pageSlug)`.
    - Return `generateOGImage({ title, description, site: 'Agent Community Blog' })`.
- Update:
  - `app/blog/[[...slug]]/page.tsx`
    - In `generateMetadata`, set image URL matching the route: `const image = ['/blog-og', ...slug, 'image.png'].join('/')`.
    - For root index, use `const image = '/blog-og/image.png'` or static fallback.
    - Add `twitter` section with `card: 'summary_large_image'` and `images: image`.

## Edge Cases & Defaults
- Missing description: OK to pass `undefined` to `generateOGImage`; template will render title-only.
- Root index OG image: Either implement `blogSource.getPage([])` to supply title/description for index, or use static fallback.
- Slugless requests: With `['/blog-og', ...slug, 'image.png']`, empty slug becomes `/blog-og/image.png`, which the route should map to index content or fallback.

## Validation
- Manual checks:
  - Open a docs page and inspect `<meta property="og:image">` and `<meta name="twitter:image">` for absolute URLs (thanks to `metadataBase`).
  - `curl` or open `/docs-og/.../image.png` and `/blog-og/.../image.png` to verify image responses.
  - Inspect a blog post head for `twitter:card = summary_large_image` and `og:image`.
- Social preview:
  - Use a sharing debugger (e.g., Twitter/X or LinkedIn) to confirm image renders. (Requires deployed URL.)

## Rollout
- Ship blog OG route and metadata changes behind no flags.
- Deploy to preview, validate previews render, then promote to production.

## Risks
- Incorrect `metadataBase` may yield relative URLs; ensure `NEXT_PUBLIC_APP_URL` is set in all environments.
- Posts without `title` would break visual quality; enforce `title` in blog frontmatter.

## Acceptance Criteria
- Docs: OG and Twitter images render for index, nested, and AID pages via `/docs-og/.../image.png`.
- Blog: OG and Twitter images render for index and posts via `/blog-og/.../image.png`.
- Both surfaces use `summary_large_image` and valid absolute URLs.

## Implementation Notes (code sketch)

1) Blog OG route (new): `app/blog-og/[...slug]/route.tsx`

```ts
import { generateOGImage } from 'fumadocs-ui/og';
import { blogSource } from '@/lib/source';
import { notFound } from 'next/navigation';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (slug[slug.length - 1] !== 'image.png') notFound();
  const pageSlug = slug.slice(0, -1);
  const page = blogSource.getPage(pageSlug);
  if (!page) notFound();
  return generateOGImage({
    title: (page.data as any).title,
    description: (page.data as any).description,
    site: 'Agent Community Blog',
  });
}

export async function generateStaticParams() {
  return blogSource.generateParams().map((p) => ({ slug: [...p.slug, 'image.png'] }));
}
```

2) Blog metadata (update): `app/blog/[[...slug]]/page.tsx`

```ts
export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const slug = params.slug ?? [];
  const isRoot = slug.length === 0 || (slug.length === 1 && slug[0] === 'index');

  if (isRoot) {
    const image = '/blog-og/image.png';
    return {
      title: '.agent Community Blog',
      description: 'Latest posts from the .agent community',
      alternates: { canonical: `${base}/blog` },
      openGraph: { type: 'website', title: '.agent Community Blog', description: 'Latest posts...', url: `${base}/blog`, images: image },
      twitter: { card: 'summary_large_image', images: image },
    } as const;
  }

  const page = blogSource.getPage(slug);
  if (!page) notFound();
  const image = ['/blog-og', ...slug, 'image.png'].join('/');
  return {
    title: (page.data as any).title,
    description: (page.data as any).description,
    alternates: { canonical: `${base}/blog/${slug.join('/')}` },
    openGraph: { type: 'article', title: (page.data as any).title, description: (page.data as any).description, url: `${base}/blog/${slug.join('/')}`, images: image },
    twitter: { card: 'summary_large_image', images: image },
  } as const;
}
```

