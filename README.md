# .agent Community Docs

Documentation and blog for the [.agent Community](https://agentcommunity.org) — the home for open source agent collaboration.

## Stack

- **Next.js 16** (App Router) — single app with `/docs` and `/blog` routes
- **next-mdx-remote** — server-side MDX rendering
- **Tailwind CSS v4** — styling with dark/light mode
- **Custom content engine** — filesystem-based MDX loader in `src/lib/`

## Quick Start

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Content

- `content/docs/*.mdx` — Documentation pages
- `content/blog/*.mdx` — Blog posts (date-prefixed filenames)
- `content/docs/meta.json` — Sidebar navigation ordering

### Adding a docs page

1. Create `content/docs/my-page.mdx` with frontmatter:
   ```yaml
   ---
   title: My Page
   description: A description for SEO
   ---
   ```
2. Add `"my-page"` to `content/docs/meta.json` under `pages`
3. It's live at `/docs/my-page`

### Adding a blog post

1. Create `content/blog/YYYY-MM-DD-my-post.mdx` with frontmatter:
   ```yaml
   ---
   title: "My Post Title"
   description: "A description"
   author: Agent Community
   date: YYYY-MM-DD
   tags: [tag1, tag2]
   ---
   ```
2. It's live at `/blog/my-post`

## Features

- Dark/light theme
- Mermaid diagram rendering
- Cmd+K search across all content
- Scroll-spy table of contents
- Tag-based blog filtering
- Static OG image generation
- RSS feed at `/rss.xml`
- Sitemap at `/sitemap.xml`
- Raw MDX export at `/api/mdx/docs/{slug}` and `/api/mdx/blog/{slug}`
- Copy Markdown toolbar on every page

## Build & Deploy

```bash
pnpm generate:og  # Generate OG images (runs automatically in Vercel build)
pnpm build        # Production build
```

Deploys to Vercel as a single project. See `vercel.json` for config.

## Reusability

The content engine (`src/lib/`) has zero React dependencies. It can be copied to another Next.js project or extracted as a package. The `meta.json` format and content structure are generic.

## Further Reading

- [ARCHITECTURE.md](ARCHITECTURE.md) — System design: layers, routes, rendering pipeline, deployment
- [BUILDING_BLOCKS.md](BUILDING_BLOCKS.md) — Reference for every module, component, and API route
