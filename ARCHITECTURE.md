# Architecture: Multi‑Zone Next.js with BasePath

## System Overview
Two Next.js apps live in this repo and are deployed separately, then proxied by a simple landing layer via rewrites. Each app uses basePath so all HTML, assets, and data are namespaced under the section path.

- apps/docs (basePath `/docs`) — Community + AID
- apps/blog (basePath `/blog`) — Blog

Why basePath: it ensures client assets (`/_next/static`), data (`/_next/data`), and routes live under `/docs` or `/blog`, so a single rewrite forwards everything reliably. This avoids fragile proxy rules for top‑level assets.

## File Structure
```
apps/
  docs/
    app/
      [[...slug]]/page.tsx
      aid/[[...slug]]/page.tsx
      layout.tsx (✅ favicon, SEO, OG images)
    api/
      search/route.ts
      mdx/
        docs/[...slug]/route.ts
        aid/[...slug]/route.ts
      og/route.ts (OG image generation)
    lib/
      source.ts
    mdx-components.tsx
    next.config.mjs
    icon.svg
  blog/
    app/
      [[...slug]]/page.tsx
      layout.tsx (✅ favicon, SEO, OG images)
    api/
      mdx/
        blog/[...slug]/route.ts
      og/route.ts (OG image generation)
    lib/
      source.ts
    next.config.mjs
    icon.svg
content/
  docs/
  blog/
```

## Routing & Sources
- Docs app switches between two local sources by slug prefix:
  - `source` → baseUrl `/`
  - `aidSource` → baseUrl `/aid`
- Blog app uses a single local source with baseUrl `/`.

## Layout & Tabs (Docs)
- `apps/docs/app/components/navigation/nav-items.tsx` defines shared section items (title, url, icon).
- `ClientLayoutWrapper` renders `DocsLayout` with:
  - `sidebar.tabs` built from the shared items (dropdown switcher)
  - `links: []` spread into layout to avoid sidebar mirroring header links
  - `nav.component` = custom TopNavbar which renders the same items as pill buttons
- Tree is chosen per request based on slug first segment.

## API Routes
- Docs:
  - `/docs/api/search` — merged search (Docs + AID)
  - `/docs/api/mdx/docs/*`, `/docs/api/mdx/aid/*` — raw Markdown for copy/open
- Blog:
  - `/blog/api/mdx/blog/*` — raw Markdown for copy/open

## Landing Project Rewrites
- `/docs/:path* → {docs-deployment}/docs/:path*`
- `/blog/:path* → {blog-deployment}/blog/:path*`

This captures HTML, assets under `/_next/static`, and data under `/_next/data` via a single rule per section.

## Canonical & Domains
- Canonical: path-first (`agentcommunity.org/docs`, `agentcommunity.org/blog`)
- Subdomains: permanent redirects to canonical paths.

## Notes
- No middleware required for source switching.
- No complex asset proxying; basePath provides the namespace.
- Each app builds independently and can be developed on separate ports. 