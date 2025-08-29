# Implementation Guide: Sidebar Tabs with Local Sources

## Overview

This guide shows how to implement sidebar tabs that switch between multiple local content sources in Fumadocs. The example implements Community and AID documentation sections that switch based on URL prefix.

## Core Implementation

### 1. Dual Source Configuration

Create separate source loaders for each content section:

```ts
// apps/docs/lib/source.ts
import { docs, aid } from '../../../.source';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource()
});

export const aidSource = loader({
  baseUrl: '/aid',
  source: aid.toFumadocsSource()
});
```

### 2. Shared Navigation Items

Define navigation items once, use everywhere:

```tsx
// apps/docs/app/components/navigation/nav-items.tsx
export const navSectionItems = [
  { title: '.agent Community', url: '/docs', icon: <Book /> },
  { title: 'Agent Interface Discovery (AID) v1.0.0', url: '/docs/aid', icon: <Globe /> },
];
```

### 3. Layout with Dynamic Tabs

Use shared items for both sidebar tabs and navbar:

```tsx
// apps/docs/app/components/navigation/ClientLayoutWrapper.tsx
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { getNavSectionItems } from '@/app/components/navigation/nav-items';

const isAID = slug[0] === 'aid';

<DocsLayout
  {...baseOptions}
  tree={isAID ? aidSource.pageTree : source.pageTree}
  sidebar={{
    defaultOpenLevel: 0,
    tabs: getNavSectionItems().map(item => ({
      title: item.title,
      url: item.url,
      icon: item.icon
    })),
  }}
  nav={{ enabled: true, component: <TopNavbar /> }}
>
  {children}
</DocsLayout>
```

### 4. Dynamic Page Loading

Switch sources based on URL prefix:

```tsx
// apps/docs/app/[[...slug]]/page.tsx
export default function Page({ params }: { params: { slug?: string[] } }) {
  const { slug = [] } = params;
  const isAID = slug[0] === 'aid';

  const page = isAID
    ? aidSource.getPage(slug.slice(1))
    : source.getPage(slug);

  if (!page) notFound();

  return <PageContent page={page} />;
}
```

### 5. Static Generation

Generate params for both sources:

```tsx
// apps/docs/app/[[...slug]]/page.tsx
export async function generateStaticParams() {
  const communityParams = source.generateParams();
  const aidParams = aidSource.generateParams().map((p) => ({
    slug: ['aid', ...p.slug]
  }));

  return [...communityParams, ...aidParams];
}
```

## Advanced Patterns

### Custom Top Navbar

Create a navbar that matches sidebar tabs:

```tsx
// apps/docs/app/components/navigation/TopNavbar.tsx
import { getNavSectionItems } from './nav-items';

export function TopNavbar() {
  const items = getNavSectionItems();

  return (
    <div className="flex gap-2">
      {items.map((item) => (
        <Link
          key={item.url}
          href={item.url}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted"
        >
          {item.icon}
          <span>{item.title}</span>
        </Link>
      ))}
    </div>
  );
}
```

### Error Boundaries

Handle source switching errors gracefully:

```tsx
// apps/docs/app/[[...slug]]/page.tsx
export default function Page({ params }: { params: { slug?: string[] } }) {
  try {
    const { slug = [] } = params;
    const isAID = slug[0] === 'aid';

    const page = isAID
      ? aidSource.getPage(slug.slice(1))
      : source.getPage(slug);

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
- Keep content in separate directories (`content/docs/`, `content/docs/aid/`)
- Use consistent file naming conventions
- Maintain separate meta.json files for each source

### 2. Navigation Consistency
- Single source of truth for navigation items
- Consistent icons and labels across all UI components
- Clear visual distinction between sections

### 3. Performance Optimization
- Generate static params for all sources
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

**Tabs not switching**: Check URL prefix logic in `isAID` calculation

**Missing pages**: Ensure both sources are properly configured in `source.ts`

**Build errors**: Verify static params generation for all sources

**Navigation mismatch**: Confirm nav items are consistently used across components

### Debug Checklist

- [ ] Sources properly imported and configured
- [ ] Navigation items correctly defined
- [ ] URL prefix logic working as expected
- [ ] Static params generated for all sources
- [ ] Layout components receiving correct props
- [ ] Error boundaries in place

## Migration Guide

### From Single Source to Multi-Source

1. **Create additional source configuration**
2. **Update navigation items**
3. **Modify page component for source switching**
4. **Add static params generation**
5. **Update layout components**
6. **Test all routes and functionality**

### Adding New Content Sections

1. **Add new source configuration**
2. **Create content directory structure**
3. **Update navigation items**
4. **Modify source switching logic**
5. **Regenerate static params**
6. **Test new section functionality**
