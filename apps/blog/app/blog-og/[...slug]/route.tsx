import { ImageResponse } from 'next/og';
import { blogSource } from '@/lib/source';
import { notFound } from 'next/navigation';

export const runtime = 'edge';
export const revalidate = 300;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug = [] } = await params;
  const pageSlug = slug.slice(0, -1); // drop 'image.png'
  const page = blogSource.getPage(pageSlug.length === 0 ? undefined : pageSlug);
  if (!page) notFound();

  const title = page.data.title ?? '.agent Blog';
  const description = page.data.description ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#000',
          color: '#fff',
          padding: '64px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
          {description ? (
            <div style={{ fontSize: 28, color: '#9CA3AF', lineHeight: 1.3 }}>{description}</div>
          ) : null}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <div style={{ fontSize: 24, color: '#fff' }}>agentcommunity.org</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

export function generateStaticParams() {
  return blogSource.generateParams().map((page) => ({ slug: [...page.slug, 'image.png'] }));
}


