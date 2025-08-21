import { source, aidSource } from '@/lib/source';
import { getLLMText } from '@/lib/get-llm-text';

// Don't prerender this route during build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Get all pages from both sources
    const docsPages = source.getPages();
    const aidPages = aidSource.getPages();

    // Process all pages with getLLMText
    const docsScan = docsPages.map(getLLMText);
    const aidScan = aidPages.map(getLLMText);

    // Wait for all processing to complete
    const [docsScanned, aidScanned] = await Promise.all([
      Promise.all(docsScan),
      Promise.all(aidScan)
    ]);

    // Combine all content with clear separation
    const allContent = [
      '# Documentation Pages\n',
      ...docsScanned,
      '\n# AID Pages\n',
      ...aidScanned
    ];

    return new Response(allContent.join('\n\n'), {
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (error) {
    console.error('Error generating LLM text:', error);
    // Return a minimal response instead of failing the build
    return new Response('# Error generating content\n\nUnable to load documentation content.', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
