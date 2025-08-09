# Agent Community Docs

A Next.js + Fumadocs site for community docs, the AID specification, and the blog.

## Getting started

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Content layout

- Community docs: `content/docs/`
- AID docs: `content/docs/aid/`
- Blog: `content/blog/`

Copy AID content from the sibling repo:

`/Users/user/dev/side-projects/AgentCommunity/agent-interface-discovery/packages/docs`

## Key features

- Dual local sources with proper tab isolation (Community | AID)
- Unified search endpoint `/api/search` (Docs + AID + Blog)
- Copy Markdown + “Open in” actions (GitHub, ChatGPT, Claude, T3)
- Mermaid diagrams supported (fenced ```mermaid blocks auto-render)
- SEO: canonical URLs, sitemap, robots, JSON‑LD (Organization, WebSite, Article)

## Canonical and domains

- Canonical strategy: path-first (`agentcommunity.org/docs`, `agentcommunity.org/blog`)
- Subdomains as aliases (permanent redirects):
  - `docs.agentcommunity.org` → `https://agentcommunity.org/docs/:path*`
  - `blog.agentcommunity.org` → `https://agentcommunity.org/blog/:path*`
- Set `NEXT_PUBLIC_APP_URL` to your canonical root (e.g. `https://agentcommunity.org`).

## API surface

- `GET /api/search` — unified search
- `GET /api/mdx/docs/*`, `/api/mdx/aid/*`, `/api/mdx/blog/*` — raw Markdown for Copy/Open

## Notes

- `meta.json` can include an `icon` (Lucide name or alias like `spec`, `quickstart`)
- Breadcrumb JSON‑LD is emitted on docs/AID pages

## Learn more

- Fumadocs: `https://fumadocs.dev`
- Next.js: `https://nextjs.org/docs`
