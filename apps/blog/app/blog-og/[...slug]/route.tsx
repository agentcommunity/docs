import { ImageResponse } from 'next/og';
import { blogSource } from '@/lib/source';
import { notFound } from 'next/navigation';

export const runtime = 'nodejs';

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
      <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#0B0B0C', padding: '64px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1, letterSpacing: -0.5 }}>{title}</div>
          {description ? (
            <div style={{ fontSize: 28, color: '#9CA3AF', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', lineHeight: 1.3, maxWidth: 980 }}>{description}</div>
          ) : null}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ fontSize: 20, color: '#9CA3AF', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
            .agent Community Blog
          </div>
          <div style={{ fontSize: 24, color: '#FFFFFF' }}>agentcommunity.org</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

// No generateStaticParams on Edge runtime to avoid Next.js constraint conflicts

