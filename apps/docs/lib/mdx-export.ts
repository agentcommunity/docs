import { NextResponse } from 'next/server';

export interface SlugParam {
  slug?: string[];
}

export const ALLOW_METHODS = ['GET', 'HEAD'] as const;

export function methodGuard(req: Request) {
  const m = req.method.toUpperCase();
  if (!ALLOW_METHODS.includes(m as any)) {
    return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }), {
      status: 405,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        allow: ALLOW_METHODS.join(', '),
      },
    });
  }
  return null;
}

export function safeDecode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export function normalizeSlug(param: SlugParam): string[] {
  const raw = Array.isArray(param.slug) ? param.slug : [];
  if (raw.length === 0) return [];
  if (raw.length === 1) {
    const s0 = (raw[0] ?? '').trim();
    if (s0 === '' || s0.toLowerCase() === 'index') return [];
  }
  return raw.map((s) => safeDecode(s));
}

export function notFoundJson(where: string, slug: string[]) {
  return NextResponse.json({ error: 'PAGE_NOT_FOUND', where, slug }, { status: 404 });
}

export function badRequestJson(message: string) {
  return NextResponse.json({ error: 'BAD_REQUEST', message }, { status: 400 });
}

export function serverErrorJson(message: string) {
  return NextResponse.json({ error: 'INTERNAL_ERROR', message }, { status: 500 });
}

export function buildDisposition(slug: string[], searchParams: URLSearchParams) {
  const name = (slug.length ? slug.join('-') : 'index') + '.mdx';
  const mode = searchParams.get('download') ? 'attachment' : 'inline';
  return `${mode}; filename="${name}"`;
}


