/**
 * Remark plugin: transform fenced code blocks with language `mermaid`
 * into an MDX JSX element: <Mermaid chart="..." />
 */
export default function remarkMermaidToComponent() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!parent || index == null) return;
      if (node.lang !== 'mermaid') return;

      /** @type {any} */
      const mdxJsxNode = {
        type: 'mdxJsxFlowElement',
        name: 'Mermaid',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'chart',
            value: node.value,
          },
        ],
        children: [],
      };

      parent.children.splice(index, 1, mdxJsxNode);
    });
  };
}

// Minimal visitor to avoid adding unified dependencies
function visit(node, type, callback, index = null, parent = null) {
  if (!node) return;
  const isType = node.type === type;
  if (isType) callback(node, index, parent);
  const children = node.children || [];
  for (let i = 0; i < children.length; i++) {
    visit(children[i], type, callback, i, node);
  }
}


