import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import type { InferPageType } from 'fumadocs-core/source';
import type { blogSource } from './source';

type BlogPage = InferPageType<typeof blogSource>;

const processor = remark().use(remarkMdx).use(remarkGfm);

export async function getLLMText(page: BlogPage) {
  try {
    const processed = await processor.process({
      path: (page as { path?: string }).path ?? page.url,
      value: page.data.content,
    });
    return `# ${page.data.title}
URL: ${page.url}

${processed.value}`;
  } catch {
    return `# ${page.data.title}
URL: ${page.url}

${page.data.content}`;
  }
}