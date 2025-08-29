# Architecture: Multi-Zone Next.js with BasePath

## System Overview

A monorepo containing two independent Next.js applications deployed as separate Vercel projects, unified through a landing page with URL rewrites.

### Core Design Principles

- **BasePath Isolation**: Each app uses basePath (`/docs`, `/blog`) for complete namespace isolation
- **Independent Deployment**: Apps deploy separately to avoid coupling and enable different scaling strategies
- **Unified Access**: Single domain with path-based routing via Vercel rewrites
- **Shared Infrastructure**: Common content structure and build tooling

## Application Structure

### Documentation App (`apps/docs`)
- **Purpose**: Community documentation with AID integration
- **Public Paths**: Community at `/` on docs subdomain; under `/docs` in traditional setup
- **Sources**: Dual-source system (Community baseUrl `/`, AID baseUrl `/aid`)
- **Features**: Tabbed navigation, scoped search, multi-source content

### Blog App (`apps/blog`)
- **Purpose**: Blog content and articles
- **BasePath**: `/blog`
- **Sources**: Single-source system
- **Features**: Article listing, individual post pages

## Content Architecture

```
content/
├── docs/           # Community documentation
│   ├── aid/        # AID-specific content
│   └── [pages]     # Community pages
└── blog/           # Blog posts
```

## Routing Architecture

### Source Switching (Docs App)
- **Community Source**: `baseUrl = "/"` (docs subdomain) or appears under `/docs` via rewrites in traditional setup
- **AID Source**: `baseUrl = "/aid"`
- **Switching Logic**: URL prefix-based (`/aid/*` routes to AID source)

### API Architecture
- **Search**: Merged results from both docs sources
- **Content**: Raw MDX access for copy/open functionality
- **OG Images**: Dynamic image generation for social sharing

#### MDX Export (Docs & Blog)
- Pretty URLs rewrite to API export routes
- GET/HEAD supported, ETag/Cache-Control headers, optional download via `?download=1`
- 404 JSON on misses, no 500s for lookups

#### OG Images (Blog)
- Per-page OG images via `/blog-og/[...slug]/image.png`
- Black background, white title, gray subtitle, `agentcommunity.org` watermark

## Deployment Architecture

### Vercel Projects
- **agentcommunity-docs**: `apps/docs/` root directory
- **agentcommunity-blog**: `apps/blog/` root directory

### Rewrite Rules (Landing Project)
```json
{
  "rewrites": [
    { "source": "/docs/:path*", "destination": "https://agentcommunitydocs.vercel.app/docs/:path*" },
    { "source": "/blog/:path*", "destination": "https://agentcommunityblog.vercel.app/blog/:path*" }
  ]
}
```

### Asset Management
- **Static Assets**: Namespaced under respective basePaths (`/_next/static/docs/*`)
- **Data Routes**: Namespaced under respective basePaths (`/_next/data/docs/*`)
- **Build Independence**: Each app builds separately with no shared state

## Navigation Architecture

### Shared Navigation System
- **Source of Truth**: `nav-items.tsx` defines section items
- **Dual Rendering**: Same items rendered in sidebar tabs and top navbar pills
- **Consistent UX**: Unified appearance across different navigation contexts

### Layout Strategy
- **Dynamic Tree Loading**: Page tree selected based on URL prefix
- **Conditional Rendering**: Different layouts for different content sources
- **SEO Optimization**: Proper meta tags and structured data per section

## SEO & Social

- OG images: Both apps generate dynamic OG images with Next’s ImageResponse.
  - Docs: `app/docs-og/[...slug]/route.tsx` (dark background, white title, gray monospace subtitle).
  - Blog: `apps/blog/app/blog-og/[...slug]/route.tsx` (same style).
- Metadata: Both apps set `metadataBase` and per-page Open Graph/Twitter images (`summary_large_image`).
- Docs breadcrumbs: BreadcrumbList JSON-LD via `<Script type="application/ld+json">` inside `app/docs/[[...slug]]/page.tsx`.
- Blog structured data:
  - Blog index: Blog JSON-LD with recent posts.
  - Post pages: Article JSON-LD.
- Sitemaps & feeds (blog): `apps/blog/app/sitemap.xml/route.ts` and `apps/blog/app/rss.xml/route.ts`.

## Blog Content Conventions

- Date-prefixed filenames: `YYYY-MM-DD-title.mdx` for reliable ordering.
- Frontmatter: `title`, `description`, `date`, `tags`, optional `image` (thumbnail on index).
- Inline images: Place under `apps/blog/public/blog/` and reference as `/blog/<filename>`.

## Dev Notes

- Node 22: `.nvmrc` committed; use `nvm use 22`.
- Fumadocs cache: when changing content/frontmatter, clear blog caches: `pnpm clean:blog && pnpm dev:blog`.

## Technical Benefits

- **Scalability**: Independent scaling of docs vs blog
- **Maintainability**: Separate codebases reduce complexity
- **Performance**: Optimized builds for specific content types
- **Flexibility**: Different update cadences and feature sets
- **Reliability**: Isolation prevents cascading failures 
