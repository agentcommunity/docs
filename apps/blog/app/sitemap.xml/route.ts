import { NextResponse } from 'next/server';
import { blogSource } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const origin = `${base}/blog`;
  const pages = blogSource.getPages();
  const urls = [
    `<url><loc>${origin}</loc></url>`,
    ...pages.map((p) => `<url><loc>${origin}/${p.slugs.join('/')}</loc></url>`),
  ].join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

