# How to Implement Sidebar Tabs with Local Sources in Fumadocs

## Overview
Two local sources (Community and AID) are rendered inside the docs app. Tabs switch sources by URL prefix under basePath `/docs`.

## Solution
- Apps:
  - `apps/docs` (basePath `/docs`) — Community + AID
  - `apps/blog` (basePath `/blog`) — Blog
- Source selection uses slug prefix (`slug[0] === 'aid'`) to switch between `source` and `aidSource`.

## Implementation

### Dual local content sources
```ts
// apps/docs/lib/source.ts
import { docs, aid } from '../../../.source';
import { loader } from 'fumadocs-core/source';

export const source = loader({ baseUrl: '/', source: docs.toFumadocsSource() });
export const aidSource = loader({ baseUrl: '/aid', source: aid.toFumadocsSource() });
```

### Layout and Tabs
```tsx
// apps/docs/app/layout.tsx
<DocsLayout
  tree={isAID ? aidSource.pageTree : source.pageTree}
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

### Catch-all Page
```tsx
// apps/docs/app/[[...slug]]/page.tsx
const isAID = slug[0] === 'aid';
const page = isAID ? aidSource.getPage(slug.slice(1)) : source.getPage(slug);
```

### Static params
```ts
export async function generateStaticParams() {
  const communityParams = source.generateParams();
  const aidParams = aidSource.generateParams().map((p) => ({ slug: ['aid', ...p.slug] }));
  return [...communityParams, ...aidParams];
}
```

## Deployment
- Each app has its own basePath ensuring assets/data live under `/docs/_next/*` and `/blog/_next/*` for reliable rewrites on the landing project.

## Notes
- Keep content local in `content/docs`, `content/docs/aid`, `content/blog`.
- The AID tab includes a small version badge in the label. 