import { NextResponse } from 'next/server';

export interface SlugParam {
  slug?: string[];
}

export function normalizeSlug(param: SlugParam): string[] {
  const raw = Array.isArray(param.slug) ? param.slug : [];
  if (raw.length === 0) return [];
  if (raw.length === 1) {
    const s0 = (raw[0] ?? '').trim();
    if (s0 === '' || s0.toLowerCase() === 'index') return [];
  }
  return raw.map((s) => decodeURIComponent(s));
}

export function notFoundJson(where: string, slug: string[]) {
  return NextResponse.json({ error: 'PAGE_NOT_FOUND', where, slug }, { status: 404 });
}

export function badRequestJson(message: string) {
  return NextResponse.json({ error: 'BAD_REQUEST', message }, { status: 400 });
}

export function serverErrorJson(message: string) {
  // details logged server-side separately by callers if needed
  return NextResponse.json({ error: 'INTERNAL_ERROR', message }, { status: 500 });
}


