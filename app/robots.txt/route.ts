import { NextResponse } from 'next/server';

export const runtime = 'edge';

export function GET() {
  const body = `User-agent: *
Allow: /
Sitemap: ${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/sitemap.xml`;
  return new NextResponse(body, { headers: { 'Content-Type': 'text/plain' } });
}

