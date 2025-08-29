import { generateOGImage } from 'fumadocs-ui/og';
import { blogSource } from '@/lib/source';
import { notFound } from 'next/navigation';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const lastSegment = slug[slug.length - 1];

  if (lastSegment !== 'image.png') notFound();

  const pageSlug = slug.slice(0, -1);
  // Root index image: no slug before image.png
  if (pageSlug.length === 0) {
    return generateOGImage({
      title: 'Agent Community Blog',
      description: 'Latest posts from the .agent community',
      site: 'Agent Community Blog',
    });
  }

  const page = blogSource.getPage(pageSlug);
  if (!page) notFound();

  const data = page.data as { title?: string; description?: string };

  return generateOGImage({
    title: data.title ?? 'Agent Community Blog',
    description: data.description,
    site: 'Agent Community Blog',
  });
}

export async function generateStaticParams() {
  return [
    { slug: ['image.png'] }, // root index OG image
    ...blogSource.generateParams().map((p) => ({
      slug: [...p.slug, 'image.png'],
    })),
  ];
}
