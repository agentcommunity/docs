import { generateOGImage } from 'fumadocs-ui/og';
import { source, aidSource } from '@/lib/source';
import { notFound } from 'next/navigation';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const lastSegment = slug[slug.length - 1];

  // Handle image.png requests
  if (lastSegment === 'image.png') {
    const pageSlug = slug.slice(0, -1);
    const isAID = pageSlug[0] === 'aid';

    let page;
    if (isAID) {
      const aidSlug = pageSlug.slice(1);
      page = aidSource.getPage(aidSlug);
    } else {
      page = source.getPage(pageSlug);
    }

    if (!page) notFound();

    return generateOGImage({
      title: page.data.title,
      description: page.data.description,
      site: 'Agent Community Docs',
    });
  }

  notFound();
}

export async function generateStaticParams() {
  const communityParams = source.generateParams().map((page) => ({
    ...page,
    slug: [...page.slug, 'image.png'],
  }));

  const aidParams = aidSource.generateParams().map((page) => ({
    slug: ['aid', ...page.slug, 'image.png'],
  }));

  return [...communityParams, ...aidParams];
}
