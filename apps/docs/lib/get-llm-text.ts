import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import type { InferPageType } from 'fumadocs-core/source';
import type { source } from './source';

type DocsPage = InferPageType<typeof source>;

const processor = remark().use(remarkMdx).use(remarkGfm);

// interface PageFileMeta { absolutePath?: string }
// kept for future extension
// interface PageDataWithFile { _file?: PageFileMeta; content: string }

async function readRawContent(page: DocsPage) {
  try {
    return await page.data.getText('raw');
  } catch {
    const exported = (page.data._exports as { content?: unknown } | undefined)?.content;
    return typeof exported === 'string' ? exported : '';
  }
}

export async function getLLMText(page: DocsPage) {
  const raw = await readRawContent(page);
  try {
    const processed = await processor.process({
      path: (page as { path?: string }).path ?? page.url,
      value: raw,
    });

    return `# ${page.data.title}
URL: ${page.url}

${processed.value}`;
  } catch {
    // Fallback: return raw content if processing fails
    return `# ${page.data.title}
URL: ${page.url}

${raw}`;
  }
}
