import { type NextRequest, NextResponse } from 'next/server';
import { getLLMText } from '@/lib/get-llm-text';
import { aidSource } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  // Handle the case where slug is ['index'] by converting to empty
  const pageSlug = slug.length === 1 && slug[0] === 'index' ? undefined : slug;
  const page = aidSource.getPage(pageSlug);
  if (!page) notFound();

  return new NextResponse(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 