import { source, aidSource } from '@/lib/source';
import { getLLMText } from '@/lib/get-llm-text';

// cached forever
export const revalidate = false;
export const runtime = 'nodejs';

export async function GET() {
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
}
