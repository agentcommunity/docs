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
  const includePath = (page as any)?.data?._file?.absolutePath || page.path || page.url;
  const processed = await processor.process({
    path: includePath,
    value: page.data.content,
  });

  return `# ${page.data.title}
URL: ${page.url}

${processed.value}`;
}