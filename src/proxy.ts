import { NextRequest, NextResponse } from 'next/server';

const BLOG_HOST = 'blog.agentcommunity.org';

function redirectWithSourceQuery(request: NextRequest, destination: URL) {
  const search = request.nextUrl.search;
  if (search && !destination.search) {
    destination.search = search;
  }
  return NextResponse.redirect(destination, 308);
}

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  const isBlogHost = hostname === BLOG_HOST || hostname.startsWith('blog.');

  // --- Blog subdomain: rewrite clean URLs to /blog routes ---
  if (isBlogHost) {
    if (pathname === '/$') {
      return redirectWithSourceQuery(request, new URL('/', request.url));
    }

    if (pathname === '/quickstart/index') {
      return redirectWithSourceQuery(request, new URL('https://docs.agentcommunity.org/aid/quickstart'));
    }

    if (pathname === '/docs.agentcommunity.org' || pathname === '/.docs.agentcommunity.org') {
      return redirectWithSourceQuery(request, new URL('https://docs.agentcommunity.org'));
    }
    if (pathname.startsWith('/docs.agentcommunity.org/') || pathname.startsWith('/.docs.agentcommunity.org/')) {
      const docsPath = pathname.startsWith('/.')
        ? pathname.slice('/.docs.agentcommunity.org'.length)
        : pathname.slice('/docs.agentcommunity.org'.length);
      return redirectWithSourceQuery(request, new URL(`https://docs.agentcommunity.org${docsPath || '/'}`));
    }

    // Redirect /blog or /blog/slug → / or /slug (keep URLs clean)
    if (pathname === '/blog' || pathname === '/blog/') {
      return redirectWithSourceQuery(request, new URL('/', request.url));
    }
    if (pathname.startsWith('/blog/')) {
      return redirectWithSourceQuery(request, new URL(pathname.slice('/blog'.length), request.url));
    }

    // Rewrite / → /blog (index page)
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/blog';
      return NextResponse.rewrite(url);
    }

    // Rewrite /slug → /blog/slug
    const url = request.nextUrl.clone();
    url.pathname = `/blog${pathname}`;
    return NextResponse.rewrite(url);
  }

  // --- Docs host: redirect /blog/* to blog subdomain ---
  if (!isBlogHost && (pathname === '/docs/index' || (pathname.startsWith('/docs/') && pathname.endsWith('/index')))) {
    const normalized = pathname.replace(/\/index$/, '') || '/docs';
    return redirectWithSourceQuery(request, new URL(normalized, request.url));
  }

  if (!isLocal) {
    if (pathname === '/blog' || pathname === '/blog/') {
      return redirectWithSourceQuery(request, new URL(`https://${BLOG_HOST}`));
    }
    if (pathname.startsWith('/blog/')) {
      const rest = pathname.slice('/blog'.length);
      return redirectWithSourceQuery(request, new URL(`https://${BLOG_HOST}${rest}`));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files and assets:
     * - _next/static, _next/image
     * - favicon.ico, sitemap.xml, robots.txt, rss.xml
     * - files with common asset extensions
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|rss\\.xml|og/|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
