import { NextResponse } from 'next/server';
import { blogSource } from '@/lib/source';

export const revalidate = false;

function parseDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value;
  if (typeof value === 'string') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

export async function GET() {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const origin = `${base}${basePath}`;
  const pages = blogSource.getPages();
  const enriched = pages.map((p) => {
    const data = p.data as { title?: string; description?: string; date?: unknown };
    const date = parseDate(data?.date) ?? (typeof p.slugs?.[0] === 'string' ? parseDate(p.slugs[0]) : undefined);
    return { p, data, date };
  }).sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));

  const items = enriched.map(({ p, data, date }) => {
    const title = data?.title ?? p.slugs.join('/');
    const description = data?.description ?? '';
    const link = `${origin}/${p.slugs.join('/')}`;
    const pubDate = date ? date.toUTCString() : new Date().toUTCString();
    return `\n  <item>\n    <title><![CDATA[${title}]]></title>\n    <link>${link}</link>\n    <guid isPermaLink="true">${link}</guid>\n    <pubDate>${pubDate}</pubDate>\n    <description><![CDATA[${description}]]></description>\n  </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>.agent Community Blog</title>\n    <link>${origin}</link>\n    <description>Insights, updates, and thoughts from the .agent community</description>\n    ${items}\n  </channel>\n</rss>`;

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
