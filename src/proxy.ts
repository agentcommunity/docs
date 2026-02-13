import { NextRequest, NextResponse } from 'next/server';

const BLOG_HOST = 'blog.agentcommunity.org';

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  const isBlogHost = hostname === BLOG_HOST || hostname.startsWith('blog.');

  // --- Blog subdomain: rewrite clean URLs to /blog routes ---
  if (isBlogHost) {
    // Redirect /blog or /blog/slug → / or /slug (keep URLs clean)
    if (pathname === '/blog' || pathname === '/blog/') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname.startsWith('/blog/')) {
      return NextResponse.redirect(new URL(pathname.slice('/blog'.length), request.url));
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
  if (!isLocal) {
    if (pathname === '/blog' || pathname === '/blog/') {
      return NextResponse.redirect(new URL(`https://${BLOG_HOST}`));
    }
    if (pathname.startsWith('/blog/')) {
      const rest = pathname.slice('/blog'.length);
      return NextResponse.redirect(new URL(`https://${BLOG_HOST}${rest}`));
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
