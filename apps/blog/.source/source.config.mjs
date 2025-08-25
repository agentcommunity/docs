// source.config.ts
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema
} from "fumadocs-mdx/config";

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

// source.config.ts
var blog = defineDocs({
  dir: "../../content/blog",
  docs: {
    schema: frontmatterSchema
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
  blog,
  source_config_default as default
};
