import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Add the pathname to the headers so the layout can access it
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  
  // Return response with the updated headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Only run middleware on docs routes
  matcher: '/docs/:path*',
}; 