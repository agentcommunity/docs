import { source } from '@/lib/source';
import { getLLMText } from '@/lib/get-llm-text';

// Don't prerender this route during build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const docsPages = source.getPages();
    const docsScanned = await Promise.all(docsPages.map(getLLMText));

    const allContent = [
      '# Documentation Pages\n',
      ...docsScanned,
    ];

    return new Response(allContent.join('\n\n'), {
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (error) {
    console.error('Error generating LLM text:', error);
    return new Response('# Error generating content\n\nUnable to load documentation content.', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
