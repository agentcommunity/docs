import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { remarkInclude } from 'fumadocs-mdx/config';

interface PageWithContent {
  url: string;
  data: { title: string; description?: string; content: string; _file: { absolutePath: string } };
}

const processor = remark().use(remarkMdx).use(remarkInclude).use(remarkGfm);

export async function getLLMText(page: PageWithContent) {
  const processed = await processor.process({ path: page.data._file.absolutePath, value: page.data.content });
  return `# ${page.data.title}\nURL: ${page.url}\n\n${page.data.description || ''}\n\n${processed.value}`;
}