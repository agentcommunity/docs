import { NextRequest, NextResponse } from 'next/server';
import { getDoc } from '@/lib/docs';
import { getPost } from '@/lib/blog';

interface RouteParams {
  params: Promise<{ slug: string[] }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const format = request.nextUrl.searchParams.get('format');

  // Determine if it's a docs or blog request
  const [section, ...rest] = slug;

  let title = '';
  let description = '';
  let rawContent = '';

  if (section === 'docs') {
    const doc = getDoc(rest);
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    title = doc.title;
    description = doc.description;
    rawContent = doc.rawContent;
  } else if (section === 'blog') {
    const postSlug = rest.join('/');
    const post = getPost(postSlug);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    title = post.title;
    description = post.description;
    rawContent = post.rawContent;
  } else {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (format === 'json') {
    return NextResponse.json(
      { title, description, content: rawContent },
      { headers: { 'Cache-Control': 'public, max-age=3600' } }
    );
  }

  return new Response(rawContent, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
