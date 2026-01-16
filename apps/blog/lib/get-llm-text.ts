import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import type { InferPageType } from 'fumadocs-core/source';
import type { blogSource } from './source';

type BlogPage = InferPageType<typeof blogSource>;

const processor = remark().use(remarkMdx).use(remarkGfm);

async function readRawContent(page: BlogPage) {
  try {
    return await page.data.getText('raw');
  } catch {
    const exported = (page.data._exports as { content?: unknown } | undefined)?.content;
    return typeof exported === 'string' ? exported : '';
  }
}

export async function getLLMText(page: BlogPage) {
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
    return `# ${page.data.title}
URL: ${page.url}

${raw}`;
  }
}
