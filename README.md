# Agent Community

Monorepo for community docs and blog using Next.js + Fumadocs.

## Apps

- apps/docs (basePath `/docs`)
- apps/blog (basePath `/blog`)

## Getting started

```bash
npm install
npm run dev
# docs → http://localhost:3000/docs
# blog → http://localhost:3001/blog
```

## Content
- Community docs: `content/docs/`
- AID docs: `content/docs/aid/`
- Blog: `content/blog/`

## Features
- Separate Next.js apps with basePath for robust subpath hosting
- Sidebar tabs (Community | AID) with AID badge v1.0.0
- Scoped search under docs app (`/docs/api/search`)
- Copy Markdown and “Open in” actions
- Mermaid diagrams; SEO (canonical, robots, JSON‑LD)

## Deploy (Vercel)
- Create two projects pointing to this repo:
  - agentcommunity-docs → Root Dir: `apps/docs`
  - agentcommunity-blog → Root Dir: `apps/blog`
- Set env: `NEXT_PUBLIC_APP_URL=https://agentcommunity.org`
- Landing rewrites:
  - `/docs/:path*` → docs deployment `/docs/:path*`
  - `/blog/:path*` → blog deployment `/blog/:path*`

## Canonical and domains
- Canonical: `agentcommunity.org/docs` and `/blog`
- Subdomains redirect:
  - `docs.agentcommunity.org` → `https://agentcommunity.org/docs/:path*`
  - `blog.agentcommunity.org` → `https://agentcommunity.org/blog/:path*`
