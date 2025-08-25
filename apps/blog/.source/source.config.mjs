// ../../source.config.ts
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema
} from "fumadocs-mdx/config";
import { z } from "zod";

// ../../lib/remark/mermaid-to-component.js
function remarkMermaidToComponent() {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      if (!parent || index == null) return;
      if (node.lang !== "mermaid") return;
      const mdxJsxNode = {
        type: "mdxJsxFlowElement",
        name: "Mermaid",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "chart",
            value: node.value
          }
        ],
        children: []
      };
      parent.children.splice(index, 1, mdxJsxNode);
    });
  };
}
function visit(node, type, callback, index = null, parent = null) {
  if (!node) return;
  const isType = node.type === type;
  if (isType) callback(node, index, parent);
  const children = node.children || [];
  for (let i = 0; i < children.length; i++) {
    visit(children[i], type, callback, i, node);
  }
}

// ../../source.config.ts
var blogSchema = frontmatterSchema.extend({
  author: z.string().optional(),
  date: z.string().datetime().or(z.date()).optional(),
  tags: z.array(z.string()).optional()
});
var docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema
  },
  meta: {
    // allow optional Lucide icon name in meta.json
    schema: metaSchema.extend({ icon: z.string().optional() })
  }
});
var aidFrontmatterSchema = frontmatterSchema.extend({
  icon: z.string().optional(),
  extra_css_class: z.string().optional(),
  tags: z.array(z.string()).optional()
});
var aid = defineDocs({
  dir: "content/docs/aid",
  docs: {
    schema: aidFrontmatterSchema
  },
  meta: {
    // allow optional Lucide icon name in meta.json
    schema: metaSchema.extend({ icon: z.string().optional() })
  }
});
var blog = defineDocs({
  dir: "content/blog",
  docs: {
    schema: blogSchema
  },
  meta: {
    schema: metaSchema
  }
});
var source_config_default = defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMermaidToComponent],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark"
      }
    }
  }
});
export {
  aid,
  blog,
  docs
};
