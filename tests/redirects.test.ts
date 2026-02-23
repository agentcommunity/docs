import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';

function makeRequest(url: string, host: string): NextRequest {
  return new NextRequest(url, { headers: { host } });
}

function getLocation(response: Response): string {
  return response.headers.get('location') || '';
}

describe('proxy redirects and rewrites', () => {
  it('redirects blog-host /blog/:slug to clean /:slug with 308 and preserves query', () => {
    const req = makeRequest('https://blog.agentcommunity.org/blog/missing_record?ref=gsc', 'blog.agentcommunity.org');
    const res = proxy(req);
    expect(res.status).toBe(308);
    expect(getLocation(res)).toBe('https://blog.agentcommunity.org/missing_record?ref=gsc');
  });

  it('rewrites blog-host / to /blog', () => {
    const req = makeRequest('https://blog.agentcommunity.org/', 'blog.agentcommunity.org');
    const res = proxy(req);
    expect(res.headers.get('x-middleware-rewrite')).toBe('https://blog.agentcommunity.org/blog');
  });

  it('redirects docs-host /blog/:slug to blog domain with 308 and preserves query', () => {
    const req = makeRequest('https://docs.agentcommunity.org/blog/missing_record?utm=1', 'docs.agentcommunity.org');
    const res = proxy(req);
    expect(res.status).toBe(308);
    expect(getLocation(res)).toBe('https://blog.agentcommunity.org/missing_record?utm=1');
  });

  it('redirects /docs/*/index to canonical docs URL with 308 and preserves query', () => {
    const req = makeRequest('https://docs.agentcommunity.org/docs/work-items/index?src=gsc', 'docs.agentcommunity.org');
    const res = proxy(req);
    expect(res.status).toBe(308);
    expect(getLocation(res)).toBe('https://docs.agentcommunity.org/docs/work-items?src=gsc');
  });

  it('redirects malformed mirrored docs path on blog host to docs domain', () => {
    const req = makeRequest(
      'https://blog.agentcommunity.org/docs.agentcommunity.org/aid/specification?x=1',
      'blog.agentcommunity.org',
    );
    const res = proxy(req);
    expect(res.status).toBe(308);
    expect(getLocation(res)).toBe('https://docs.agentcommunity.org/aid/specification?x=1');
  });
});
