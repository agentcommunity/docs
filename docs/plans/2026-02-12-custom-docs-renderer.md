# Custom Docs Renderer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace Fumadocs with a custom-built docs + blog renderer in a single Next.js app, keeping all existing MDX content.

**Architecture:** Single Next.js App Router app. Pure-logic content engine in `src/lib/` reads MDX from `content/`. Server-side MDX rendering via `next-mdx-remote/rsc`. Custom React components for layout, sidebar, TOC, blog. The `src/lib/` layer has zero React dependencies making it extractable as a reusable package later.

**Tech Stack:** Next.js 16 (App Router), next-mdx-remote v5, gray-matter, remark-gfm, rehype-slug, rehype-autolink-headings, mermaid, next-themes, lucide-react, Tailwind CSS v4

---

## Content We're Keeping

**Docs (3 files):**
- `content/docs/index.mdx` — Community landing page
- `content/docs/work-items/index.mdx` — Work items overview
- `content/docs/test.mdx` — Component test page (can drop later)
- `content/docs/meta.json` — Navigation ordering

**Blog (11 files):**
- `content/blog/*.mdx` — All 11 posts with frontmatter: title, description, author, date, tags, image

**Assets:**
- `public/assets/logo_docs_lm.svg`, `logo_docs_dm.svg`, `logo-black.svg`, `logo-white.svg`, `logo_word.svg`
- `public/favicon.ico`
- `public/blog/editorial-illustration-*.png`

**Content Notes:**
- Docs MDX files import `{ Card, Cards } from 'fumadocs-ui/components/card'` — we must provide these as custom MDX components
- Blog posts use standard markdown (no Fumadocs imports)
- `meta.json` format: `{ "title": "...", "icon": "...", "pages": ["slug1", "slug2"] }` with optional `groups` array for nested sections

---

## Redirects to Preserve

- `/aid` → `https://aid.agentcommunity.org` (permanent)
- `/aid/:path*` → `https://aid.agentcommunity.org/:path*` (permanent)

---

## Target File Structure

```
AgentCommunity_DOCS/
├── content/                           # KEPT AS-IS
│   ├── docs/
│   │   ├── meta.json
│   │   ├── index.mdx
│   │   ├── test.mdx
│   │   └── work-items/
│   │       └── index.mdx
│   └── blog/
│       └── *.mdx (11 posts)
│
├── public/                            # KEPT AS-IS
│   ├── assets/ (logos)
│   ├── blog/ (images)
│   └── favicon.ico
│
├── src/
│   ├── lib/                           # Pure logic, zero React — reusable
│   │   ├── docs.ts                    # Docs content loader: readDoc, getAllDocSlugs, getDocNavigation
│   │   ├── blog.ts                    # Blog content loader: readPost, getAllPosts, getAllTags
│   │   ├── mdx-plugins.ts            # Custom remark/rehype plugins (admonitions, link rewriting)
│   │   └── search.ts                  # Build-time search index generator
│   │
│   ├── components/
│   │   ├── theme-provider.tsx         # next-themes wrapper
│   │   ├── theme-toggle.tsx           # Dark/light switch
│   │   ├── navbar.tsx                 # Top navigation bar
│   │   ├── footer.tsx                 # Site footer
│   │   ├── docs-sidebar.tsx           # Collapsible docs sidebar
│   │   ├── toc.tsx                    # Scroll-spy table of contents (desktop)
│   │   ├── toc-mobile.tsx             # Mobile TOC dropdown
│   │   ├── heading-link.tsx           # Copy-link on headings
│   │   ├── mdx-components.tsx         # All MDX overrides (h1-h6, pre, code, table, Card, Cards, callouts)
│   │   ├── mermaid-diagram.tsx        # Client-side mermaid renderer
│   │   ├── blog-post-card.tsx         # Blog listing card
│   │   ├── tag-filter.tsx             # Blog tag pills
│   │   ├── copy-button.tsx            # Copy code / copy markdown
│   │   ├── search-dialog.tsx          # Cmd+K search modal
│   │   └── toolbar.tsx                # LLM export toolbar (copy MD, open in ChatGPT/Claude)
│   │
│   └── app/
│       ├── layout.tsx                 # Root: fonts, theme, navbar, footer, structured data
│       ├── page.tsx                   # Redirect to /docs or landing page
│       ├── globals.css                # Tailwind imports + CSS custom properties
│       │
│       ├── docs/
│       │   ├── layout.tsx             # Docs shell: sidebar + content + TOC
│       │   └── [[...slug]]/
│       │       └── page.tsx           # Docs page: load MDX, render, generate metadata
│       │
│       ├── blog/
│       │   ├── page.tsx               # Blog index: list posts, tag filter
│       │   └── [slug]/
│       │       └── page.tsx           # Blog post: load MDX, render, metadata
│       │
│       ├── api/
│       │   └── mdx/
│       │       └── [...slug]/
│       │           └── route.ts       # Raw MDX export endpoint
│       │
│       ├── sitemap.ts                 # Auto-generated sitemap
│       ├── robots.ts                  # robots.txt
│       └── rss.xml/
│           └── route.ts               # RSS feed
│
├── package.json                       # Single app, no workspaces
├── next.config.ts                     # Redirects, image config
├── tsconfig.json
├── postcss.config.mjs
└── .gitignore
```

---

## Task 1: Bootstrap — Fresh Next.js App

**Files:**
- Create: `package.json` (overwrite root)
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Delete: `apps/` directory, `pnpm-workspace.yaml`, `source.config.ts`, monorepo configs

**Step 1: Create a fresh branch**

```bash
git checkout -b feat/custom-docs-renderer
```

**Step 2: Back up content and assets, nuke everything else**

```bash
# Preserve what we need
cp -r content /tmp/agentcommunity-content
cp -r public /tmp/agentcommunity-public

# Remove all app code (keep .git, content, public, docs/plans)
rm -rf apps/ lib/ components/ node_modules/ .source/
rm -f source.config.ts pnpm-workspace.yaml pnpm-lock.yaml FUMADOCS_SETUP_PACKAGE.md
```

**Step 3: Initialize fresh Next.js project**

Run: `pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --skip-install`

Accept overwrite prompts for package.json, tsconfig.json, etc.

**Step 4: Install all dependencies**

```bash
pnpm add next-mdx-remote gray-matter remark-gfm rehype-slug rehype-autolink-headings next-themes lucide-react mermaid
pnpm add -D @tailwindcss/postcss @types/node @types/react @types/react-dom typescript tailwindcss postcss
```

**Step 5: Restore content and assets**

```bash
cp -r /tmp/agentcommunity-content ./content
cp -r /tmp/agentcommunity-public/* ./public/
```

**Step 6: Configure next.config.ts with redirects**

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: '/aid',
      destination: 'https://aid.agentcommunity.org',
      permanent: true,
    },
    {
      source: '/aid/:path*',
      destination: 'https://aid.agentcommunity.org/:path*',
      permanent: true,
    },
  ],
};

export default nextConfig;
```

**Step 7: Create minimal root layout with Inter font + theme**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: '.agent Community', template: '%s — .agent Community' },
  description: 'The home for open source agent collaboration.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**Step 8: Create minimal home page that redirects to /docs**

```tsx
// src/app/page.tsx
import { redirect } from 'next/navigation';
export default function Home() { redirect('/docs'); }
```

**Step 9: Verify it runs**

Run: `pnpm dev`
Expected: App starts on localhost:3000, redirects to /docs (404 is fine — we haven't built that yet)

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: bootstrap fresh Next.js app, remove Fumadocs monorepo"
```

---

## Task 2: Content Engine — Docs Loader

**Files:**
- Create: `src/lib/docs.ts`
- Create: `src/lib/types.ts`

**Step 1: Write test expectations**

Manually verify by adding a temporary test route later. The functions we need:

- `getDoc(slug: string[])` → `{ title, description, content, rawContent, headings, slug }`
- `getAllDocSlugs()` → `string[][]` (for generateStaticParams)
- `getDocNavigation()` → `NavItem[]` (parsed from meta.json)

**Step 2: Create shared types**

```typescript
// src/lib/types.ts
export interface DocPage {
  title: string;
  description: string;
  content: string;      // preprocessed MDX source
  rawContent: string;   // original markdown for export
  headings: Heading[];
  slug: string[];
}

export interface Heading {
  depth: number;  // 2-6
  text: string;
  id: string;
}

export interface NavItem {
  title: string;
  slug: string;
  href: string;
  children?: NavItem[];
}

export interface BlogPost {
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  image?: string;
  content: string;
  rawContent: string;
  slug: string;
  headings: Heading[];
}
```

**Step 3: Implement docs.ts**

```typescript
// src/lib/docs.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { DocPage, Heading, NavItem } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'docs');

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      depth: match[1].length,
      text: match[2].replace(/\*\*/g, '').replace(/`/g, ''),
      id: slugify(match[2].replace(/\*\*/g, '').replace(/`/g, '')),
    });
  }
  return headings;
}

export function getDoc(slug: string[]): DocPage | null {
  // Try exact path, then index.mdx inside directory
  const candidates = [
    path.join(CONTENT_DIR, ...slug) + '.mdx',
    path.join(CONTENT_DIR, ...slug, 'index.mdx'),
    path.join(CONTENT_DIR, ...slug) + '.md',
    path.join(CONTENT_DIR, ...slug, 'index.md'),
  ];

  let filePath: string | null = null;
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      filePath = candidate;
      break;
    }
  }
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    title: data.title || slug[slug.length - 1] || 'Untitled',
    description: data.description || '',
    content,
    rawContent: raw,
    headings: extractHeadings(content),
    slug,
  };
}

export function getAllDocSlugs(): string[][] {
  const slugs: string[][] = [];

  function walk(dir: string, prefix: string[]) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), [...prefix, entry.name]);
      } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
        if (entry.name === 'index.mdx' || entry.name === 'index.md') {
          slugs.push(prefix.length > 0 ? prefix : []);
        } else {
          const name = entry.name.replace(/\.mdx?$/, '');
          slugs.push([...prefix, name]);
        }
      }
    }
  }

  walk(CONTENT_DIR, []);
  return slugs;
}

export function getDocNavigation(): NavItem[] {
  const metaPath = path.join(CONTENT_DIR, 'meta.json');
  if (!fs.existsSync(metaPath)) return [];

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  const items: NavItem[] = [];

  // Process top-level pages
  for (const pageSlug of meta.pages || []) {
    const doc = getDoc(pageSlug === 'index' ? [] : [pageSlug]);
    if (doc) {
      items.push({
        title: doc.title,
        slug: pageSlug,
        href: pageSlug === 'index' ? '/docs' : `/docs/${pageSlug}`,
      });
    }
  }

  // Process groups (nested sections)
  for (const group of meta.groups || []) {
    const groupMetaPath = path.join(CONTENT_DIR, group.slug, 'meta.json');
    const children: NavItem[] = [];

    if (fs.existsSync(groupMetaPath)) {
      const groupMeta = JSON.parse(fs.readFileSync(groupMetaPath, 'utf-8'));
      for (const pageSlug of groupMeta.pages || []) {
        const fullSlug = pageSlug === 'index' ? [group.slug] : [group.slug, pageSlug];
        const doc = getDoc(fullSlug);
        if (doc) {
          children.push({
            title: doc.title,
            slug: pageSlug,
            href: `/docs/${fullSlug.join('/')}`,
          });
        }
      }
    }

    items.push({
      title: group.title,
      slug: group.slug,
      href: `/docs/${group.slug}`,
      children,
    });
  }

  return items;
}
```

**Step 4: Verify by running dev and checking console**

Add temporary `console.log(getDocNavigation())` in a page and verify output.

**Step 5: Commit**

```bash
git add src/lib/docs.ts src/lib/types.ts
git commit -m "feat: add docs content engine — filesystem loader, nav builder"
```

---

## Task 3: Content Engine — Blog Loader

**Files:**
- Create: `src/lib/blog.ts`

**Step 1: Implement blog.ts**

```typescript
// src/lib/blog.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { BlogPost, Heading } from './types';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      depth: match[1].length,
      text: match[2].replace(/\*\*/g, '').replace(/`/g, ''),
      id: slugify(match[2].replace(/\*\*/g, '').replace(/`/g, '')),
    });
  }
  return headings;
}

function fileNameToSlug(fileName: string): string {
  // Strip date prefix: 2026-02-05-why-aid-now-supports-ucp.mdx → why-aid-now-supports-ucp
  return fileName.replace(/\.mdx?$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

function extractDateFromFileName(fileName: string): string | null {
  const match = fileName.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

export function getPost(slug: string): BlogPost | null {
  // Find file matching this slug (could have any date prefix)
  const files = fs.readdirSync(BLOG_DIR);
  const file = files.find(f => (f.endsWith('.mdx') || f.endsWith('.md')) && fileNameToSlug(f) === slug);
  if (!file) return null;

  const filePath = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    title: data.title || slug,
    description: data.description || '',
    author: data.author || '.agent Community',
    date: data.date ? new Date(data.date).toISOString().split('T')[0] : extractDateFromFileName(file) || '',
    tags: data.tags || [],
    image: data.image || undefined,
    content,
    rawContent: raw,
    slug,
    headings: extractHeadings(content),
  };
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

  return files
    .map(file => {
      const slug = fileNameToSlug(file);
      return getPost(slug);
    })
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) tagSet.add(tag);
  }
  return Array.from(tagSet).sort();
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map(p => p.slug);
}
```

**Step 2: Commit**

```bash
git add src/lib/blog.ts
git commit -m "feat: add blog content engine — date-sorted posts, tag extraction"
```

---

## Task 4: MDX Rendering Pipeline + Component Overrides

**Files:**
- Create: `src/components/mdx-components.tsx`
- Create: `src/components/heading-link.tsx`
- Create: `src/components/copy-button.tsx`
- Create: `src/components/callout.tsx`

**Step 1: Create heading-link component**

```tsx
// src/components/heading-link.tsx
'use client';
import { useState } from 'react';
import { Link as LinkIcon, Check } from 'lucide-react';

export function HeadingLink({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="ml-2 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity" aria-label="Copy link">
      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <LinkIcon className="w-4 h-4" />}
    </button>
  );
}
```

**Step 2: Create copy-button component**

```tsx
// src/components/copy-button.tsx
'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-muted/80 hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
      aria-label="Copy code"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
    </button>
  );
}
```

**Step 3: Create callout component**

```tsx
// src/components/callout.tsx
import { Lightbulb, Info, AlertTriangle, StickyNote } from 'lucide-react';

const calloutConfig = {
  tip:     { icon: Lightbulb,     border: 'border-emerald-500', bg: 'bg-emerald-500/5' },
  info:    { icon: Info,          border: 'border-blue-500',    bg: 'bg-blue-500/5' },
  warning: { icon: AlertTriangle, border: 'border-amber-500',   bg: 'bg-amber-500/5' },
  note:    { icon: StickyNote,    border: 'border-slate-400',   bg: 'bg-slate-500/5' },
} as const;

export function Callout({ type = 'note', title, children }: { type?: keyof typeof calloutConfig; title?: string; children: React.ReactNode }) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div className={`my-4 rounded-lg border-l-4 ${config.border} ${config.bg} p-4`}>
      <div className="flex items-center gap-2 font-semibold mb-1">
        <Icon className="w-4 h-4" />
        {title || type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
```

**Step 4: Create MDX components (the big one — all HTML overrides)**

This replaces Fumadocs UI components. The `Card` and `Cards` components replace `fumadocs-ui/components/card`.

```tsx
// src/components/mdx-components.tsx
import { HeadingLink } from './heading-link';
import { CopyButton } from './copy-button';
import { Callout } from './callout';
import type { MDXComponents } from 'mdx/types';

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = `h${level}` as const;
  const sizes: Record<number, string> = {
    1: 'text-3xl font-bold mt-8 mb-4',
    2: 'text-2xl font-semibold mt-8 mb-3 pb-2 border-b',
    3: 'text-xl font-semibold mt-6 mb-2',
    4: 'text-lg font-semibold mt-4 mb-2',
    5: 'text-base font-semibold mt-4 mb-1',
    6: 'text-sm font-semibold mt-4 mb-1',
  };

  return function Heading({ children, id, ...props }: React.ComponentPropsWithoutRef<'h1'>) {
    return (
      <Tag id={id} className={`${sizes[level]} group scroll-mt-20`} {...props}>
        {children}
        {id && <HeadingLink id={id} />}
      </Tag>
    );
  };
}

// Card components to replace fumadocs-ui/components/card
function Cards({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 my-4">{children}</div>;
}

function Card({ title, description, href, icon }: { title: string; description?: string; href: string; icon?: React.ReactNode }) {
  const isExternal = href.startsWith('http');
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group block rounded-lg border p-4 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 text-muted-foreground">{icon}</div>}
        <div>
          <div className="font-semibold group-hover:text-primary transition-colors">{title}</div>
          {description && <div className="text-sm text-muted-foreground mt-1">{description}</div>}
        </div>
      </div>
    </a>
  );
}

export const mdxComponents: MDXComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  p: (props) => <p className="leading-7 mb-4" {...props} />,
  a: (props) => <a className="text-primary underline underline-offset-4 hover:text-primary/80" {...props} />,
  ul: (props) => <ul className="my-4 ml-6 list-disc space-y-2" {...props} />,
  ol: (props) => <ol className="my-4 ml-6 list-decimal space-y-2" {...props} />,
  li: (props) => <li className="leading-7" {...props} />,
  hr: () => <hr className="my-8 border-border" />,
  table: (props) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  thead: (props) => <thead className="border-b" {...props} />,
  th: (props) => <th className="px-4 py-2 text-left font-semibold" {...props} />,
  td: (props) => <td className="px-4 py-2 border-t" {...props} />,
  blockquote: (props) => <blockquote className="my-4 border-l-4 border-border pl-4 italic text-muted-foreground" {...props} />,
  code: (props) => {
    // Inline code (not inside pre)
    return <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono" {...props} />;
  },
  pre: ({ children, ...props }: React.ComponentPropsWithoutRef<'pre'>) => {
    // Extract text content for copy button
    // Check for mermaid — handled by MermaidDiagram component (added in Task 9)
    return (
      <div className="group relative my-4">
        <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-4 text-sm" {...props}>
          {children}
        </pre>
      </div>
    );
  },
  img: (props) => <img className="rounded-lg my-4 max-w-full" {...props} />,
  // Custom components available in MDX
  Card,
  Cards,
  Callout,
};
```

**Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add MDX component overrides — headings, code, cards, callouts"
```

---

## Task 5: Docs Pages — Layout + Dynamic Route

**Files:**
- Create: `src/app/docs/layout.tsx`
- Create: `src/app/docs/[[...slug]]/page.tsx`
- Create: `src/components/docs-sidebar.tsx`
- Create: `src/components/toc.tsx`

**Step 1: Create docs sidebar**

```tsx
// src/components/docs-sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { NavItem } from '@/lib/types';

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
        isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      }`}
    >
      {item.title}
    </Link>
  );
}

function NavGroup({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isChildActive = item.children?.some(c => pathname === c.href) ?? false;
  const [open, setOpen] = useState(isChildActive || pathname === item.href);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-1.5 text-sm font-medium hover:text-foreground transition-colors"
      >
        {item.title}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="ml-2 mt-1 space-y-0.5 border-l pl-2">
          {item.children?.map(child => <NavLink key={child.slug} item={child} />)}
        </div>
      )}
    </div>
  );
}

export function DocsSidebar({ navigation, className }: { navigation: NavItem[]; className?: string }) {
  return (
    <nav className={className}>
      <div className="space-y-1">
        {navigation.map(item =>
          item.children ? (
            <NavGroup key={item.slug} item={item} />
          ) : (
            <NavLink key={item.slug} item={item} />
          )
        )}
      </div>
    </nav>
  );
}
```

**Step 2: Create scroll-spy TOC**

```tsx
// src/components/toc.tsx
'use client';
import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/types';

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -40% 0px' }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-1 text-sm">
      <p className="font-medium mb-2">On this page</p>
      {headings.map(heading => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', `#${heading.id}`);
          }}
          className={`block transition-colors ${
            activeId === heading.id
              ? 'text-primary font-medium'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          style={{ paddingLeft: `${(heading.depth - 2) * 12 + 4}px` }}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
```

**Step 3: Create docs layout (sidebar + content + TOC)**

```tsx
// src/app/docs/layout.tsx
import { getDocNavigation } from '@/lib/docs';
import { DocsSidebar } from '@/components/docs-sidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const navigation = getDocNavigation();

  return (
    <div className="mx-auto max-w-7xl flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <DocsSidebar navigation={navigation} />
      </aside>

      {/* Content + TOC */}
      {children}
    </div>
  );
}
```

**Step 4: Create docs page with MDX rendering**

```tsx
// src/app/docs/[[...slug]]/page.tsx
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getDoc, getAllDocSlugs } from '@/lib/docs';
import { mdxComponents } from '@/components/mdx-components';
import { TableOfContents } from '@/components/toc';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return [
    { slug: undefined },  // /docs (index)
    ...slugs.filter(s => s.length > 0).map(s => ({ slug: s })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug || []);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
  };
}

export default async function DocsPage({ params }: Props) {
  const { slug } = await params;
  const doc = getDoc(slug || []);
  if (!doc) notFound();

  return (
    <>
      {/* Main content */}
      <main className="flex-1 min-w-0 px-6 py-8 lg:px-12">
        <article className="max-w-3xl">
          <MDXRemote
            source={doc.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
              },
            }}
            components={mdxComponents}
          />
        </article>
      </main>

      {/* Table of Contents */}
      <aside className="hidden xl:block w-56 shrink-0 p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <TableOfContents headings={doc.headings} />
      </aside>
    </>
  );
}
```

**Step 5: Verify docs rendering works**

Run: `pnpm dev`
Navigate to: `http://localhost:3000/docs`
Expected: See the "Welcome to .agent Community" page with cards, tables, and proper heading styles.

**Step 6: Commit**

```bash
git add src/
git commit -m "feat: add docs pages — sidebar, TOC, MDX rendering"
```

---

## Task 6: Blog Pages — Index + Post + Tags

**Files:**
- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/[slug]/page.tsx`
- Create: `src/components/blog-post-card.tsx`
- Create: `src/components/tag-filter.tsx`

**Step 1: Create blog post card**

```tsx
// src/components/blog-post-card.tsx
import Link from 'next/link';
import type { BlogPost } from '@/lib/types';

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group rounded-lg border p-4 hover:bg-muted/30 transition-colors">
      <div className="flex gap-4">
        {post.image && (
          <img src={post.image} alt="" className="w-24 h-24 rounded-md object-cover shrink-0" />
        )}
        <div className="min-w-0">
          <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">{post.title}</h2>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            <div className="flex gap-1">
              {post.tags.slice(0, 3).map(tag => (
                <span key={tag} className="rounded-full bg-muted px-2 py-0.5">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

**Step 2: Create tag filter**

```tsx
// src/components/tag-filter.tsx
'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export function TagFilter({ tags, activeTag }: { tags: string[]; activeTag?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setTag = (tag: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) params.set('tag', tag);
    else params.delete('tag');
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => setTag(null)}
        className={`rounded-full px-3 py-1 text-sm transition-colors ${!activeTag ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
      >
        All
      </button>
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => setTag(tag)}
          className={`rounded-full px-3 py-1 text-sm transition-colors ${activeTag === tag ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
```

**Step 3: Create blog index page**

```tsx
// src/app/blog/page.tsx
import { getAllPosts, getAllTags } from '@/lib/blog';
import { BlogPostCard } from '@/components/blog-post-card';
import { TagFilter } from '@/components/tag-filter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, updates, and thoughts from the .agent community.',
};

interface Props {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogIndex({ searchParams }: Props) {
  const { tag } = await searchParams;
  const allPosts = getAllPosts();
  const allTags = getAllTags();
  const posts = tag ? allPosts.filter(p => p.tags.includes(tag)) : allPosts;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">.agent Community Blog</h1>
      <p className="text-muted-foreground mb-6">Insights, updates, and thoughts from the community.</p>
      <TagFilter tags={allTags} activeTag={tag} />
      <div className="space-y-4">
        {posts.map(post => <BlogPostCard key={post.slug} post={post} />)}
      </div>
    </div>
  );
}
```

**Step 4: Create blog post page**

```tsx
// src/app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getPost, getAllPostSlugs } from '@/lib/blog';
import { mdxComponents } from '@/components/mdx-components';
import { TableOfContents } from '@/components/toc';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-7xl flex">
      <main className="flex-1 min-w-0 px-6 py-8 lg:px-12">
        <article className="max-w-3xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <span>·</span>
              <span>{post.author}</span>
            </div>
            <div className="flex gap-1 mt-2">
              {post.tags.map(tag => (
                <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs">#{tag}</span>
              ))}
            </div>
          </header>
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
              },
            }}
            components={mdxComponents}
          />
        </article>
      </main>
      <aside className="hidden xl:block w-56 shrink-0 p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <TableOfContents headings={post.headings} />
      </aside>
    </div>
  );
}
```

**Step 5: Verify blog works**

Run: `pnpm dev`
Navigate to: `http://localhost:3000/blog`
Expected: See all 11 posts listed with tags, click through to individual posts.

**Step 6: Commit**

```bash
git add src/
git commit -m "feat: add blog pages — index with tag filter, post pages with TOC"
```

---

## Task 7: Theme + Navbar + Footer

**Files:**
- Create: `src/components/theme-provider.tsx`
- Create: `src/components/theme-toggle.tsx`
- Create: `src/components/navbar.tsx`
- Create: `src/components/footer.tsx`
- Modify: `src/app/layout.tsx`
- Create: `src/app/globals.css`

**Step 1: Create theme provider**

```tsx
// src/components/theme-provider.tsx
'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

**Step 2: Create theme toggle**

```tsx
// src/components/theme-toggle.tsx
'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="w-4 h-4 hidden dark:block" />
      <Moon className="w-4 h-4 dark:hidden" />
    </button>
  );
}
```

**Step 3: Create navbar**

```tsx
// src/components/navbar.tsx
import Link from 'next/link';
import { Github } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-14 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-7xl flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img src="/assets/logo_docs_lm.svg" alt=".agent" className="h-5 w-5 dark:hidden" />
            <img src="/assets/logo_docs_dm.svg" alt=".agent" className="hidden h-5 w-5 dark:block" />
            <span>.agent Community</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1 text-sm">
            <Link href="/docs" className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors">Docs</Link>
            <Link href="/blog" className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors">Blog</Link>
            <a href="https://aid.agentcommunity.org" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors">AID Spec</a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://github.com/agentcommunity" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-muted transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
```

**Step 4: Create footer**

```tsx
// src/components/footer.tsx
export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <p>&copy; {new Date().getFullYear()} .agent Community. Open source under MIT.</p>
      </div>
    </footer>
  );
}
```

**Step 5: Create globals.css with Tailwind + dark mode**

```css
/* src/app/globals.css */
@import 'tailwindcss';

@custom-variant dark (&:is(.dark *));

:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --border: 0 0% 89.8%;
  --primary: 262 83% 58%;
  --primary-foreground: 0 0% 98%;
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --muted: 0 0% 14.9%;
  --muted-foreground: 0 0% 63.9%;
  --border: 0 0% 14.9%;
  --primary: 262 83% 68%;
  --primary-foreground: 0 0% 3.9%;
}

body {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
}
```

**Step 6: Wire it all together in root layout**

Update `src/app/layout.tsx` to include ThemeProvider, Navbar, Footer.

**Step 7: Verify theme toggle and navigation**

Run: `pnpm dev`
Expected: Navbar shows, dark/light toggle works, navigation between docs and blog works.

**Step 8: Commit**

```bash
git add src/
git commit -m "feat: add theme, navbar, footer — dark/light mode with branding"
```

---

## Task 8: Mobile Sidebar + Mobile TOC

**Files:**
- Create: `src/components/mobile-sidebar.tsx`
- Create: `src/components/toc-mobile.tsx`
- Modify: `src/app/docs/layout.tsx` (add mobile sidebar trigger)

**Step 1: Create mobile sidebar with sheet/overlay**

Client component with state toggle, slide-in from left, backdrop overlay. Reuses DocsSidebar internally.

**Step 2: Create mobile TOC dropdown**

Collapsible "On this page" section that appears above content on small screens.

**Step 3: Integrate into docs layout**

- Mobile: FAB button bottom-right opens sidebar overlay
- Below lg: TOC appears as collapsible dropdown above content
- At xl+: TOC appears in right sidebar

**Step 4: Commit**

```bash
git commit -m "feat: add mobile sidebar and mobile TOC"
```

---

## Task 9: Mermaid Diagrams

**Files:**
- Create: `src/components/mermaid-diagram.tsx`
- Modify: `src/components/mdx-components.tsx` (detect mermaid code blocks)

**Step 1: Create mermaid diagram component**

Client component. Dynamic import of mermaid. Reads CSS custom properties for theme colors. Unique IDs via `useId()`. Error fallback shows source code.

**Step 2: Update mdx-components pre handler**

In the `pre` override, check if the child `code` has `className="language-mermaid"`. If so, extract text and render `<MermaidDiagram>` instead.

**Step 3: Verify with test.mdx**

Add a mermaid block to `content/docs/test.mdx` and verify it renders.

**Step 4: Commit**

```bash
git commit -m "feat: add mermaid diagram rendering with theme integration"
```

---

## Task 10: Search

**Files:**
- Create: `src/lib/search.ts`
- Create: `src/components/search-dialog.tsx`
- Modify: `src/components/navbar.tsx` (add search trigger)

**Step 1: Build search index at import time**

`search.ts` builds an in-memory index of all docs + blog pages: `{ title, description, slug, href, type, content }`. Simple substring matching is sufficient for ~15 pages.

**Step 2: Create search dialog component**

Cmd+K triggered modal. Client component. Fetches search results from the in-memory index. Shows grouped results (Docs / Blog).

**Step 3: Add search button to navbar**

Search icon + "Cmd+K" hint badge.

**Step 4: Commit**

```bash
git commit -m "feat: add search — Cmd+K dialog with docs + blog results"
```

---

## Task 11: Static OG Images

**Files:**
- Create: `scripts/generate-og-images.ts`
- Modify: `package.json` (add prebuild script)

**Approach:** Generate OG images at build time using `@vercel/og` or `satori` + `sharp`. Output to `public/og/` so they're served as static files. No runtime function calls.

**Step 1: Create OG generation script**

Reads all docs and blog pages, generates 1200x630 PNG for each. Dark background, title in large text, description below, ".agent Community" branding.

**Step 2: Add to build pipeline**

```json
{
  "scripts": {
    "generate:og": "tsx scripts/generate-og-images.ts",
    "prebuild": "pnpm run generate:og",
    "build": "next build"
  }
}
```

**Step 3: Reference OG images in metadata**

In `generateMetadata` for docs and blog pages, point to `/og/{slug}.png`.

**Step 4: Commit**

```bash
git commit -m "feat: add static OG image generation at build time"
```

---

## Task 12: SEO — Metadata, Structured Data, Sitemap, RSS

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/app/rss.xml/route.ts`
- Modify: `src/app/layout.tsx` (structured data)
- Modify: `src/app/docs/[[...slug]]/page.tsx` (enhanced metadata)
- Modify: `src/app/blog/[slug]/page.tsx` (enhanced metadata)

**Step 1: Create sitemap.ts**

Next.js built-in sitemap generation. Lists all docs + blog pages with lastModified dates.

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getAllDocSlugs } from '@/lib/docs';
import { getAllPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://docs.agentcommunity.org';

  const docPages = getAllDocSlugs().map(slug => ({
    url: `${base}/docs/${slug.join('/')}`,
    lastModified: new Date(),
  }));

  const blogPages = getAllPosts().map(post => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
    ...docPages,
    ...blogPages,
  ];
}
```

**Step 2: Create robots.ts**

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://docs.agentcommunity.org/sitemap.xml',
  };
}
```

**Step 3: Create RSS feed route**

Generates RSS XML from all blog posts.

**Step 4: Add structured data to root layout**

Organization + WebSite schemas in JSON-LD `<script>` tag.

**Step 5: Enhance metadata in docs and blog pages**

Add canonical URLs, OpenGraph images (pointing to static `/og/` files), Twitter cards, Article/BlogPosting structured data.

**Step 6: Commit**

```bash
git commit -m "feat: add SEO — sitemap, robots, RSS, structured data, enhanced metadata"
```

---

## Task 13: LLM Export — Copy Markdown + Raw API

**Files:**
- Create: `src/components/toolbar.tsx`
- Create: `src/app/api/mdx/[...slug]/route.ts`
- Modify: docs and blog pages to include toolbar

**Step 1: Create toolbar component**

Floating toolbar below article header with buttons:
- Copy Markdown (copies raw MDX content to clipboard)
- Open in ChatGPT / Claude (URL-encoded content)
- View Source (link to GitHub)

**Step 2: Create raw MDX API endpoint**

`GET /api/mdx/docs/slug` → raw markdown (`text/markdown`)
`GET /api/mdx/blog/slug` → raw markdown
Supports `?format=json` for structured output.
1-hour cache header.

**Step 3: Add toolbar to docs and blog pages**

**Step 4: Commit**

```bash
git commit -m "feat: add LLM export — copy markdown toolbar + raw MDX API"
```

---

## Task 14: Clean Up Content — Remove Fumadocs Imports

**Files:**
- Modify: `content/docs/index.mdx` (replace `fumadocs-ui/components/card` imports)
- Modify: `content/docs/work-items/index.mdx` (same)
- Modify: `content/docs/test.mdx` (same)

**Step 1: Update MDX files to use our Card/Cards components**

Remove `import { Card, Cards } from 'fumadocs-ui/components/card';` lines.
Our `mdxComponents` already provides `Card` and `Cards` globally — no imports needed in MDX files. But since MDX files use JSX directly, we need to ensure the components are available.

Actually: `next-mdx-remote` passes components via the `components` prop, so `<Card>` and `<Cards>` used in MDX will automatically resolve to our custom components. We just need to remove the explicit import statements.

**Step 2: Verify all pages render without fumadocs imports**

Run: `pnpm dev` and click through every page.

**Step 3: Commit**

```bash
git commit -m "fix: remove fumadocs imports from content files"
```

---

## Task 15: Deployment — Vercel Config

**Files:**
- Modify: `vercel.json` (simplify for single app)
- Modify: `package.json` (clean up scripts)
- Delete: old monorepo files that weren't already removed

**Step 1: Simplify vercel.json**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install --frozen-lockfile"
}
```

**Step 2: Clean up package.json scripts**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "generate:og": "tsx scripts/generate-og-images.ts",
    "prebuild": "pnpm run generate:og"
  }
}
```

**Step 3: Delete leftover files**

Remove any remaining monorepo artifacts: `GUIDE.md`, `ARCHITECTURE.md`, `SETUP.md`, `FUMADOCS_SETUP_PACKAGE.md` (these describe the old Fumadocs setup).

**Step 4: Update README.md**

Brief description of the new setup, how to run locally, how to add content.

**Step 5: Verify production build**

Run: `pnpm build`
Expected: Build completes with all static pages generated.

**Step 6: Commit**

```bash
git commit -m "chore: simplify deployment config, clean up old monorepo artifacts"
```

---

## Task 16: Final Verification

**Step 1: Run production build and start**

```bash
pnpm build && pnpm start
```

**Step 2: Verify every route**

- [ ] `/` redirects to `/docs`
- [ ] `/docs` renders community landing page
- [ ] `/docs/work-items` renders work items
- [ ] `/blog` lists all 11 posts with tag filtering
- [ ] `/blog/[any-slug]` renders blog post
- [ ] `/aid` redirects to external AID site
- [ ] `/sitemap.xml` lists all pages
- [ ] `/rss.xml` generates valid RSS
- [ ] `/api/mdx/docs/index` returns raw MDX
- [ ] Dark/light theme toggle works
- [ ] Cmd+K search works
- [ ] Mobile sidebar works
- [ ] Scroll-spy TOC works
- [ ] OG images exist at `/og/*.png`

**Step 3: Commit final state**

```bash
git commit -m "chore: final verification — all routes and features working"
```

---

## Summary

| Task | What | Est. Complexity |
|------|------|----------------|
| 1 | Bootstrap Next.js, nuke Fumadocs | Low |
| 2 | Docs content engine | Low |
| 3 | Blog content engine | Low |
| 4 | MDX components | Medium |
| 5 | Docs pages + layout | Medium |
| 6 | Blog pages | Medium |
| 7 | Theme + navbar + footer | Low |
| 8 | Mobile sidebar + TOC | Medium |
| 9 | Mermaid diagrams | Medium |
| 10 | Search | Medium |
| 11 | Static OG images | Medium |
| 12 | SEO | Low |
| 13 | LLM export | Low |
| 14 | Clean up content | Low |
| 15 | Deployment config | Low |
| 16 | Final verification | Low |

**Reusability note:** The `src/lib/` directory (docs.ts, blog.ts, search.ts, types.ts) has zero React dependencies. It can be extracted into an npm package or copied to another repo as-is. The meta.json format and content structure are generic.
