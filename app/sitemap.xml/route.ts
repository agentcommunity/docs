import { NextResponse } from 'next/server';
import { source, aidSource, blogSource } from '@/lib/source';

// Uses local filesystem via fumadocs sources; must run on Node.js runtime
export const runtime = 'nodejs';

export function GET() {
  const pages = [
    ...source.getPages(),
    ...aidSource.getPages().map((p) => ({ ...p, url: p.url.replace('/docs', '/docs/aid') })),
    ...blogSource.getPages(),
  ];

  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const urls = pages
    .map((p) => {
      const loc = new URL(p.url, base).toString();
      return `<url><loc>${loc}</loc></url>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}

