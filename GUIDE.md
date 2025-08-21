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

### Layout and Tabs (shared items for sidebar + navbar)
We keep a single source of truth for section items and use it in both the sidebar dropdown and the top navbar pills.

```tsx
// apps/docs/app/components/navigation/nav-items.tsx
export const navSectionItems = [
  { title: '.agent Community', url: '/docs', icon: <Book /> },
  { title: 'Agent Interface Discovery (AID) v1.0.0', url: '/docs/aid', icon: <Globe /> },
];
```

```tsx
// apps/docs/app/components/navigation/ClientLayoutWrapper.tsx
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/app/layout.config';
import { getNavSectionItems } from '@/app/components/navigation/nav-items';
// ...
const layoutBase = { ...baseOptions, links: [] }; // prevent sidebar mirroring navbar links

<DocsLayout
  {...layoutBase}
  tree={isAID ? aidSource.pageTree : source.pageTree}
  sidebar={{
    defaultOpenLevel: 0,
    tabs: getNavSectionItems().map(i => ({ title: i.title, url: i.url, icon: i.icon })),
  }}
  nav={{ enabled: true, component: <TopNavbar /> }}
>
  {children}
</DocsLayout>
```

Top navbar renders matching pill buttons using the same items, so users see identical labels/icons for the section switcher.

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

## SEO & Social Media Features

### Favicon & Icons
Both apps now have complete favicon and icon configuration:
- **Favicon**: `/icon.svg` properly configured in metadata
- **Apple Icons**: Apple touch icon support via SVG format
- **Icon formats**: SVG format for consistent display across all devices
- **Next.js optimized**: Uses Next.js built-in icon handling

### Open Graph & Twitter Cards
- **Dynamic OG Images**: `/api/og` endpoint generates dynamic Open Graph images
- **Twitter Cards**: Large image cards for rich social media previews
- **Social Sharing**: Optimized for Facebook, LinkedIn, Twitter, and other platforms
- **Image Optimization**: 1200x630px images for optimal display

### Meta Tags & SEO
- **Keywords**: Relevant keywords for better search engine ranking
- **Author/Publisher**: Proper attribution and publisher information
- **Format Detection**: Optimized for mobile and desktop
- **Structured Data**: JSON-LD schema markup for search engines

### Implementation Details
```tsx
// apps/docs/app/layout.tsx & apps/blog/app/layout.tsx
export const metadata: Metadata = {
  // ✅ Favicon configuration
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },

  // ✅ SEO meta tags
  keywords: ['relevant', 'keywords', 'here'],
  authors: [{ name: 'Agent Community' }],
  creator: 'Agent Community',
  publisher: 'Agent Community',

  // ✅ Open Graph images
  openGraph: {
    images: [{
      url: '/api/og',
      width: 1200,
      height: 630,
      alt: 'Site description',
    }],
  },

  // ✅ Twitter Cards
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og'],
  },
}
```

## Notes
- Keep content local in `content/docs`, `content/docs/aid`, `content/blog`.
- The AID tab includes a small version badge in the label.
- Both apps now have comprehensive SEO optimization out of the box. 