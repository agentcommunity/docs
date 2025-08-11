# How to Implement Sidebar Tabs with Local Sources in Fumadocs

## Overview
Two local sources (Community and AID) are rendered inside the docs app. Tabs switch sources by URL prefix under basePath `/docs`.

## Solution
- Apps:
  - `apps/docs` (basePath `/docs`) — Community + AID
  - `apps/blog` (basePath `/blog`) — Blog
- Source selection is handled by route-group layouts rather than slug parsing.

## Implementation

### Dual local content sources
```ts
// apps/docs/lib/source.ts
import { docs, aid } from '../../../.source';
import { loader } from 'fumadocs-core/source';

export const source = loader({ baseUrl: '/', source: docs.toFumadocsSource() });
export const aidSource = loader({ baseUrl: '/aid', source: aid.toFumadocsSource() });
```

### Layout and Tabs (route groups)
```tsx
// apps/docs/app/(community)/layout.tsx
<DocsLayout
  tree={source.pageTree}
  sidebar={{
    defaultOpenLevel: 0,
    tabs: [
      { title: '.agent Community', url: '/docs' },
      { title: 'Agent Interface Discovery (AID) v1.0.0', url: '/docs/aid' },
    ],
  }}
>
  {children}
</DocsLayout>

// apps/docs/app/(aid)/layout.tsx
<DocsLayout
  tree={aidSource.pageTree}
  sidebar={{
    defaultOpenLevel: 0,
    tabs: [
      { title: '.agent Community', url: '/docs' },
      { title: 'Agent Interface Discovery (AID) v1.0.0', url: '/docs/aid' },
    ],
  }}
>
  {children}
</DocsLayout>
```

### Catch-all Pages
```tsx
// apps/docs/app/(community)/[[...slug]]/page.tsx
const page = source.getPage(slug);

// apps/docs/app/(aid)/aid/[[...slug]]/page.tsx
const page = aidSource.getPage(slug);
```

### Static params
```ts
export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateStaticParams() {
  return aidSource.generateParams();
}
```

## Deployment
- Each app has its own basePath ensuring assets/data live under `/docs/_next/*` and `/blog/_next/*` for reliable rewrites on the landing project.

## Tips
- Keep the root `apps/docs/app/layout.tsx` free of `DocsLayout`; use it only for providers so group layouts can fully control the sidebar and tree.

## Notes
- Keep content local in `content/docs`, `content/docs/aid`, `content/blog`.
- The AID tab includes a small version badge in the label. 