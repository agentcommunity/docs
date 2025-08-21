import type { InferPageType } from 'fumadocs-core/source';
import type { source, aidSource } from './source';

type DocsPage = InferPageType<typeof source>;
type AIDPage = InferPageType<typeof aidSource>;

export async function getLLMText(page: DocsPage | AIDPage) {
  // Use the already processed content from the page data instead of trying to read from filesystem
  return `# ${page.data.title}\nURL: ${page.url}\n\n${page.data.description || ''}\n\n${page.data.content}`;
}