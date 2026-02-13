# Implementation Guide: Sidebar Tabs with External Links

## Overview

This guide shows how to implement sidebar tabs in Fumadocs. The Community documentation is served locally, while AID documentation has moved to [aid.agentcommunity.org/docs](https://aid.agentcommunity.org/docs) and is linked externally.

## Core Implementation

### 1. Source Configuration

Create a source loader for Community documentation:

```ts
// apps/docs/lib/source.ts
import { docs } from '../.source/server';
import { loader } from 'fumadocs-core/source';
import { createIconHandler } from './icon-handler';

const icon = createIconHandler();

export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  icon
});
```

> AID documentation is hosted externally at [aid.agentcommunity.org/docs](https://aid.agentcommunity.org/docs). Old `/aid/*` routes redirect there via 301.

### 2. Navigation Items

Navigation includes a link to the external AID documentation:

```tsx
// apps/docs/app/layout.config.tsx  (links array)
{
  text: 'AID Docs',
  url: 'https://aid.agentcommunity.org/docs',
  active: 'none',
  secondary: true,
}
```

### 3. Layout with Sidebar Tabs

The sidebar includes a tab linking to the external AID docs:

```tsx
// app/docs/layout.tsx
<DocsLayout
  tree={treeWithIcons}
  {...baseOptions}
  sidebar={{
    defaultOpenLevel: 0,
    tabs: [
      {
        title: '.agent Community',
        description: 'The home for open source agent collaboration',
        url: '/docs',
        icon: <Lucide.Book className="size-4" />,
      },
      {
        title: 'AID Docs',
        description: 'AID specification and reference (hosted externally)',
        url: 'https://aid.agentcommunity.org/docs',
        icon: <Lucide.ExternalLink className="size-4" />,
      },
    ],
  }}
>
  {children}
</DocsLayout>
```

### 4. Page Loading

Pages are loaded from the community source:

```tsx
// apps/docs/app/[[...slug]]/page.tsx
export default function Page({ params }: { params: { slug?: string[] } }) {
  const { slug = [] } = params;
  const page = source.getPage(slug);

  if (!page) notFound();

  return <PageContent page={page} />;
}
```

### 5. Static Generation

Generate params from the community source:

```tsx
// apps/docs/app/[[...slug]]/page.tsx
export async function generateStaticParams() {
  return source.generateParams();
}
```

## Advanced Patterns

### Error Boundaries

Handle page loading errors gracefully:

```tsx
// apps/docs/app/[[...slug]]/page.tsx
export default function Page({ params }: { params: { slug?: string[] } }) {
  try {
    const { slug = [] } = params;
    const page = source.getPage(slug);

    if (!page) notFound();

    return <PageContent page={page} />;
  } catch (error) {
    console.error('Page loading error:', error);
    return <ErrorPage />;
  }
}
```

## Best Practices

### 1. Source Organization
- Keep community content in `content/docs/`
- Use consistent file naming conventions
- Maintain meta.json files for navigation ordering

### 2. Navigation Consistency
- Single source of truth for navigation items
- Consistent icons and labels across all UI components
- Clear visual distinction between sections

### 3. Performance Optimization
- Generate static params from community source
- Implement proper caching strategies
- Use dynamic imports for heavy components

### 4. SEO Considerations
- Proper canonical URLs for each section
- Section-specific meta tags
- Structured data for each content type
- Dynamic OG images for Docs and Blog
- BreadcrumbList JSON-LD on docs pages
- Blog JSON-LD on index and Article JSON-LD on posts
- Blog `sitemap.xml` and `rss.xml` routes

## Blog Authoring & Images

- Blog posts live in `content/blog`.
- Prefer date-prefixed filenames: `YYYY-MM-DD-title.mdx` for consistent ordering.
- Frontmatter: `title`, `description`, `date` (YYYY-MM-DD), `tags`, optional `image`.
- Blog images live in `apps/blog/public/blog/` and are referenced as `/blog/<filename>`.

## Local Dev Tips

- Use Node 22 (`.nvmrc`): `nvm use 22`.
- If blog content/frontmatter changes don’t show up, clear caches:
  - `pnpm clean:blog && pnpm dev:blog`

## Troubleshooting

### Common Issues

**Missing pages**: Ensure source is properly configured in `source.ts`

**Build errors**: Verify static params generation

**Navigation mismatch**: Confirm nav items are consistently used across components

### Debug Checklist

- [ ] Source properly imported and configured
- [ ] Navigation items correctly defined
- [ ] Static params generated
- [ ] Layout components receiving correct props
- [ ] Error boundaries in place
- [ ] `/aid/*` redirects working (301 to aid.agentcommunity.org/docs)

## Adding New Content Sections

1. **Add new source configuration** in `source.config.ts` and `lib/source.ts`
2. **Create content directory structure** under `content/`
3. **Update navigation items**
4. **Add static params generation**
5. **Update layout components**
6. **Test all routes and functionality**
