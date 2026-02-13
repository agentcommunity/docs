# Building Blocks

Reference for every module in this project. Use this when you need to modify, extend, or understand a specific piece.

## Content Engine — src/lib/

### types.ts

Shared TypeScript interfaces. No runtime code.

| Type | Fields | Used by |
|------|--------|---------|
| `DocPage` | title, description, content, rawContent, headings, slug | docs.ts, docs pages |
| `BlogPost` | title, description, author, date, tags, image, content, rawContent, slug, headings | blog.ts, blog pages |
| `Heading` | depth (2-6), text, id | TOC components |
| `NavItem` | title, slug, href, children? | Sidebar components |

### docs.ts

Reads from `content/docs/`. Key functions:

- **`getDoc(slug: string[])`** — Resolves slug to file path (tries `.mdx`, `/index.mdx`, `.md`, `/index.md`). Parses frontmatter, extracts headings. Returns `DocPage | null`.
- **`getAllDocSlugs()`** — Recursive directory walk. Returns `string[][]` for `generateStaticParams`.
- **`getDocNavigation()`** — Parses `meta.json` files to build `NavItem[]` tree. Supports nested groups with their own `meta.json`.

### blog.ts

Reads from `content/blog/`. Key functions:

- **`getPost(slug: string)`** — Finds file by matching slug against date-stripped filenames. Returns `BlogPost | null`.
- **`getAllPosts()`** — All posts sorted by date descending. Prefers frontmatter `date` over filename date.
- **`getAllTags()`** — Unique tags across all posts, sorted alphabetically.
- **`getAllPostSlugs()`** — All slugs for `generateStaticParams`.

### search.ts

In-memory full-text search. Builds an index of all docs + blog pages on first call (cached).

- **`getSearchIndex()`** — Returns `SearchEntry[]` with title, description, href, type, content.
- **`search(query)`** — Substring match across title, description, and content. Returns results without content field.

## Components — src/components/

### Layout

| Component | File | Client? | Purpose |
|-----------|------|---------|---------|
| `Navbar` | navbar.tsx | No | Sticky top bar: logo, nav links (Docs, Blog, AID Spec), search, GitHub, theme toggle |
| `Footer` | footer.tsx | No | Copyright line |
| `ThemeProvider` | theme-provider.tsx | Yes | Wraps `next-themes` ThemeProvider with class strategy |
| `ThemeToggle` | theme-toggle.tsx | Yes | Sun/Moon toggle button |

### Docs Navigation

| Component | File | Client? | Purpose |
|-----------|------|---------|---------|
| `DocsSidebar` | docs-sidebar.tsx | Yes | Left sidebar with nav links and collapsible groups. Highlights active page. |
| `MobileSidebar` | mobile-sidebar.tsx | Yes | FAB button (bottom-right) + slide-in overlay sidebar for mobile. Wraps `DocsSidebar`. |
| `TableOfContents` | toc.tsx | Yes | Desktop right sidebar. IntersectionObserver scroll-spy. Smooth scroll on click. |
| `MobileTableOfContents` | toc-mobile.tsx | Yes | Collapsible dropdown TOC for screens below xl. |

### MDX Rendering

| Component | File | Client? | Purpose |
|-----------|------|---------|---------|
| `mdxComponents` | mdx-components.tsx | No | Exported object mapping HTML elements to styled components. Also provides `Card`, `Cards`, `Callout`. Detects `language-mermaid` code blocks. |
| `HeadingLink` | heading-link.tsx | Yes | Hover icon on headings. Copies `#anchor` URL to clipboard. |
| `CopyButton` | copy-button.tsx | Yes | Copy code block content. Appears on hover over `<pre>`. |
| `Callout` | callout.tsx | No | Admonition box. Types: tip (emerald), info (blue), warning (amber), note (slate). |
| `MermaidDiagram` | mermaid-diagram.tsx | Yes | Dynamic import of mermaid. Reads dark/light from DOM. Error fallback shows source. |

### Blog

| Component | File | Client? | Purpose |
|-----------|------|---------|---------|
| `BlogPostCard` | blog-post-card.tsx | No | Card for blog index. Shows title, description, date, tags, optional image. |
| `TagFilter` | tag-filter.tsx | Yes | Pill-style tag buttons. Uses `?tag=` query parameter via router. |

### Features

| Component | File | Client? | Purpose |
|-----------|------|---------|---------|
| `SearchDialog` | search-dialog.tsx | Yes | Cmd+K modal. Debounced fetch to `/api/search`. Arrow key navigation. Grouped results. |
| `Toolbar` | toolbar.tsx | Yes | Copy Markdown + View Source buttons. Appears above article content. |

## App Routes — src/app/

### Root

| File | Purpose |
|------|---------|
| `layout.tsx` | Root layout: Inter font, ThemeProvider, Navbar, Footer, JSON-LD, RSS link |
| `page.tsx` | Redirects `/` to `/docs` |
| `globals.css` | Tailwind v4 import, `@theme` color definitions (light + dark), `@custom-variant dark` |
| `sitemap.ts` | Next.js metadata sitemap from all docs + blog slugs |
| `robots.ts` | Standard allow-all robots with sitemap reference |

### Docs — src/app/docs/

| File | Purpose |
|------|---------|
| `layout.tsx` | Three-column layout: sidebar (lg+) + content + TOC. Loads nav once. |
| `[[...slug]]/page.tsx` | Catch-all docs page. `generateStaticParams` from `getAllDocSlugs`. MDXRemote rendering. Metadata with OG images. |

### Blog — src/app/blog/

| File | Purpose |
|------|---------|
| `page.tsx` | Blog index. Tag filter via `searchParams.tag`. Lists all posts as cards. |
| `[slug]/page.tsx` | Blog post page. Header with title/date/author/tags. MDXRemote rendering. Article structured data. |

### API Routes

| Route | File | Purpose |
|-------|------|---------|
| `/api/search?q=` | `api/search/route.ts` | Returns JSON array of search results |
| `/api/mdx/{section}/{slug}` | `api/mdx/[...slug]/route.ts` | Raw MDX export. `text/markdown` default, `?format=json` for structured. 1h cache. |
| `/rss.xml` | `rss.xml/route.ts` | RSS 2.0 feed of all blog posts |

## Scripts

### scripts/generate-og-images.ts

Generates static OG images (1200x630 PNG) for every page. Uses `satori` for SVG rendering and `@resvg/resvg-js` for PNG conversion. Fetches Inter font from Google Fonts at build time.

Output: `public/og/{type}-{slug}.png` (gitignored)

Run: `pnpm generate:og`

Design: Dark background (#0B0B0C), white title, gray description, purple type label, ".agent Community" footer.

## Configuration

| File | Purpose |
|------|---------|
| `next.config.ts` | `/aid/*` redirects to aid.agentcommunity.org |
| `tsconfig.json` | `@/*` path alias to `./src/*`, excludes `scripts/` |
| `postcss.config.mjs` | `@tailwindcss/postcss` plugin |
| `vercel.json` | Build command: `pnpm generate:og && pnpm build` |

## Styling

Tailwind CSS v4 with custom theme colors defined in `globals.css` via `@theme`:

| Token | Light | Dark |
|-------|-------|------|
| `background` | white | near-black |
| `foreground` | near-black | near-white |
| `muted` | light gray | dark gray |
| `muted-foreground` | medium gray | lighter gray |
| `border` | light gray | dark gray |
| `primary` | purple (hsl 262 83% 58%) | lighter purple (68%) |

Dark mode uses `@custom-variant dark (&:is(.dark *))` with class strategy via next-themes.

## Adding New Features

### New docs section

1. Create `content/docs/my-section/` with `index.mdx` and optional `meta.json`
2. Add to `content/docs/meta.json`:
   - As a page: `"pages": [..., "my-section"]`
   - As a group: `"groups": [{ "slug": "my-section", "title": "My Section" }]`

### New MDX component

1. Create the component in `src/components/`
2. Add it to the `mdxComponents` object in `src/components/mdx-components.tsx`
3. Use it in MDX files without imports: `<MyComponent prop="value" />`

### New API route

Create `src/app/api/my-route/route.ts` with GET/POST handlers.

### New remark/rehype plugin

Add to the `mdxOptions` in both `src/app/docs/[[...slug]]/page.tsx` and `src/app/blog/[slug]/page.tsx`. Both files configure the MDX pipeline independently.
