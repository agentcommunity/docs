import { source, aidSource } from '@/lib/source';

function xmlEscape(input: string) {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET() {
  const appBase = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/docs';

  const communityParams = source.generateParams();
  const aidParams = aidSource.generateParams();

  const urls: string[] = [];

  // Community docs under /docs
  for (const p of communityParams) {
    const slugPath = Array.isArray(p.slug) && p.slug.length > 0 ? p.slug.join('/') : '';
    urls.push(`${appBase}${basePath}/${slugPath}`);
  }

  // AID docs under /docs/aid
  for (const p of aidParams) {
    const slugPath = Array.isArray(p.slug) && p.slug.length > 0 ? p.slug.join('/') : '';
    urls.push(`${appBase}${basePath}/aid/${slugPath}`);
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls
      .map((loc) => `<url><loc>${xmlEscape(loc)}</loc></url>`)
      .join('') +
    `</urlset>`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}


