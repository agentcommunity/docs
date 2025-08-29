import { source, aidSource } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
export const runtime = 'nodejs';

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

    const title = page.data.title ?? 'Agent Community Docs';
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
            backgroundColor: '#0B0B0C',
            padding: '64px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              fontSize: 64,
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: -0.5,
            }}>
              {title}
            </div>
            {description ? (
              <div style={{
                fontSize: 28,
                color: '#9CA3AF',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                lineHeight: 1.3,
                maxWidth: 980,
              }}>
                {description}
              </div>
            ) : null}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div style={{ fontSize: 20, color: '#9CA3AF', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
              Agent Community Docs
            </div>
            <div style={{ fontSize: 24, color: '#FFFFFF' }}>agentcommunity.org</div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
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
