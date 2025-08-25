import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import type { InferPageType } from 'fumadocs-core/source';
import type { source, aidSource } from './source';

type DocsPage = InferPageType<typeof source>;
type AIDPage = InferPageType<typeof aidSource>;

const processor = remark().use(remarkMdx).use(remarkGfm);

// interface PageFileMeta { absolutePath?: string }
// kept for future extension
// interface PageDataWithFile { _file?: PageFileMeta; content: string }

export async function getLLMText(page: DocsPage | AIDPage) {
  try {
    const processed = await processor.process({
      path: (page as { path?: string }).path ?? page.url,
      value: page.data.content,
    });

    return `# ${page.data.title}
URL: ${page.url}

${processed.value}`;
  } catch {
    // Fallback: return raw content if processing fails
    return `# ${page.data.title}
URL: ${page.url}

${page.data.content}`;
  }
}