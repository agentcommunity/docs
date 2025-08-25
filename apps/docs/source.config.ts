import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';
import remarkMermaidToComponent from '../../lib/remark/mermaid-to-component.js';

// Schema for blog posts
const blogSchema = frontmatterSchema.extend({
  author: z.string().optional(),
  date: z.string().datetime().or(z.date()).optional(),
  tags: z.array(z.string()).optional(),
});

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    // allow optional Lucide icon name in meta.json
    schema: metaSchema.extend({ icon: z.string().optional() }),
  },
});

// AID docs (local-only, separate source for proper tab isolation)
// Allow extra fields commonly present in upstream AID docs
const aidFrontmatterSchema = frontmatterSchema.extend({
  icon: z.string().optional(),
  edit_url: z.string().url().optional(),
  extra_css_class: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const aid = defineDocs({
  dir: 'content/docs/aid',
  docs: {
    schema: aidFrontmatterSchema,
  },
  meta: {
    // allow optional Lucide icon name in meta.json
    schema: metaSchema.extend({ icon: z.string().optional() }),
  },
});

export const blog = defineDocs({
  dir: 'content/blog',
  docs: {
    schema: blogSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

// NOTE: We intentionally keep AID as a separate local source to enable
// sidebar tab isolation in Fumadocs.

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMermaidToComponent],
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
