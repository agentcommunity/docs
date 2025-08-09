# How to Implement Sidebar Tabs with Local Sources in Fumadocs

## 📖 **Overview**

This guide explains how to implement sidebar tabs with local sources in Fumadocs. We keep all content local and switch sources per tab.

- **Fast iteration** with local content
- **Clean separation** between community docs and AID
- **Fumadocs compatibility** using standard patterns and APIs

## 🏗️ **Solution: Local-Only Architecture**

We implement a route-aware approach that switches between two local sources:

### **Development & Production**
```
📁 /docs/community-page     → Local `content/docs/` files  
📁 /docs/aid/specification  → Local `content/docs/aid/` files
```

---

## 🔧 **Technical Implementation**

### **Step 1: Dual Local Content Sources**

```typescript
// source.config.ts
import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';

// Community docs (local)
export const docs = defineDocs({
  dir: 'content/docs',
  docs: { schema: frontmatterSchema },
  meta: { schema: metaSchema.extend({ icon: z.string().optional() }) },
});

// AID docs (local)
export const aid = defineDocs({
  dir: 'content/docs/aid',
  docs: { schema: frontmatterSchema },
  meta: { schema: metaSchema.extend({ icon: z.string().optional() }) },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
```

```typescript
// lib/source.ts
import { docs, aid } from '@/.source';
import { loader } from 'fumadocs-core/source';

export const source = loader({ baseUrl: '/docs', source: docs.toFumadocsSource() });
export const aidSource = loader({ baseUrl: '/docs/aid', source: aid.toFumadocsSource() });
```

### **Step 2: Layout (Local Source Switching)**
```typescript
// app/docs/layout.tsx
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source, aidSource } from '@/lib/source';
import { headers } from 'next/headers';

export default async function Layout({ children }: { children: ReactNode }) {
  const h = await headers();
  const pathname = h.get('x-pathname') || '';
  const isAIDRoute = pathname.startsWith('/docs/aid');
  const currentTree = isAIDRoute ? aidSource.pageTree : source.pageTree;

  return (
    <DocsLayout tree={currentTree} sidebar={{ tabs: [ /* Community, AID */ ] }}>
      {children}
    </DocsLayout>
  );
}
```

### **Step 3: Page Component (Local Source Selection)**
```typescript
// app/docs/[[...slug]]/page.tsx
import { source, aidSource } from '@/lib/source';
import { headers } from 'next/headers';

export default async function Page({ params }) {
  const p = await params;
  const slug = p.slug || [];
  const pathname = (await headers()).get('x-pathname') || '';
  const isAIDRoute = pathname.startsWith('/docs/aid');

  const page = isAIDRoute
    ? aidSource.getPage(slug.slice(1))
    : source.getPage(slug);
  if (!page) notFound();
  // render MDX as usual
}

export async function generateStaticParams() {
  const communityParams = source.generateParams();
  const aidParams = aidSource.generateParams().map((p) => ({ slug: ['aid', ...p.slug] }));
  return [...communityParams, ...aidParams];
}
```

---

## 🌊 **Content Flow**
```
1. User visits /docs/aid/specification  
2. Middleware detects AID route
3. Layout uses aidSource.pageTree
4. Page component uses aidSource.getPage()
5. Local content rendered
```

---

## 🔧 **Configuration & Customization**

### **AID Content Path**
Copy from `/Users/user/dev/side-projects/AgentCommunity/agent-interface-discovery/packages/docs` to `content/docs/aid/`.

### **Adding New Content Sources**
1. Add to `source.config.ts`
2. Create loader in `lib/source.ts`  
3. Update layout route detection
4. Update page component logic
5. (Optional) Create raw MDX endpoints for copy/open actions

---

## 🚀 **Results**
- ✅ Fast local development
- ✅ Proper tab isolation per source
- ✅ Simple, reliable deployment (no remote runtime fetch) 