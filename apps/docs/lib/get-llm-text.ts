import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { remarkInclude } from 'fumadocs-mdx/config';
import type { InferPageType } from 'fumadocs-core/source';
import type { source, aidSource } from './source';

type DocsPage = InferPageType<typeof source>;
type AIDPage = InferPageType<typeof aidSource>;

const processor = remark()
  .use(remarkMdx)
  .use(remarkInclude)
  .use(remarkGfm);

export async function getLLMText(page: DocsPage | AIDPage) {
  const processed = await processor.process({
    // avoid absolute FS paths for portability
    path: page.path ?? page.url,
    value: page.data.content,
  });

  return `# ${page.data.title}
URL: ${page.url}

${processed.value}`;
}