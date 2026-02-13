import { source } from '@/lib/source';

function xmlEscape(input: string) {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET() {
  const appBase = process.env.NEXT_PUBLIC_CANONICAL_BASE || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const isDocsSubdomain = appBase.includes('docs.agentcommunity.org');

  const communityParams = source.generateParams();
  const urls: string[] = [];

  for (const p of communityParams) {
    const slugPath = Array.isArray(p.slug) && p.slug.length > 0 ? p.slug.join('/') : '';
    if (isDocsSubdomain) {
      urls.push(`${appBase}/${slugPath}`);
    } else {
      urls.push(`${appBase}/docs/${slugPath}`);
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls
      .map((loc) => `<url><loc>${xmlEscape(loc)}</loc></url>`)
      .join('') +
    `</urlset>`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
