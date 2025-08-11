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
      (community)/
        [[...slug]]/page.tsx
        layout.tsx
      (aid)/
        aid/[[...slug]]/page.tsx
        layout.tsx
      layout.tsx  // providers only (no DocsLayout here)
    api/
      search/route.ts
      mdx/
        docs/[...slug]/route.ts
        aid/[...slug]/route.ts
    lib/
      source.ts
    mdx-components.tsx
    next.config.mjs
  blog/
    app/
      [[...slug]]/page.tsx
      layout.tsx
    api/
      mdx/
        blog/[...slug]/route.ts
    lib/
      source.ts
    next.config.mjs
content/
  docs/
  blog/
```

## Routing & Sources
- Docs app renders two local sources using route groups:
  - Community routes under `(community)` use `source` (baseUrl `/`)
  - AID routes under `(aid)` use `aidSource` (baseUrl `/aid`)
- Blog app uses a single local source with baseUrl `/`.

## Layout & Tabs (Docs)
- Route-group layouts render `DocsLayout` and manage the sidebar and tree:
  - `apps/docs/app/(community)/layout.tsx` → uses `source.pageTree`
  - `apps/docs/app/(aid)/layout.tsx` → uses `aidSource.pageTree`
- The root `apps/docs/app/layout.tsx` only provides providers (theme/root) so the correct group layout always drives the sidebar.

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
- Ensure each app declares its own TypeScript and ESLint devDependencies so Vercel can run type-checking and linting in isolation.