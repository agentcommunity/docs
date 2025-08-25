import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import remarkMermaidToComponent from '../../lib/remark/mermaid-to-component.js';

// Basic schemas without Zod for simpler frontmatter
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

// AID docs (local-only, separate source for proper tab isolation)
// Using basic frontmatter schema without extra fields
export const aid = defineDocs({
  dir: 'content/docs/aid',
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export const blog = defineDocs({
  dir: 'content/blog',
  docs: {
    schema: frontmatterSchema,
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
