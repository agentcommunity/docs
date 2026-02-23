import { notFound, permanentRedirect } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getDoc, getAllDocSlugs } from '@/lib/docs';
import { mdxComponents } from '@/components/mdx-components';
import { TableOfContents } from '@/components/toc';
import { SetMobileHeadings } from '@/components/mobile-nav-context';
import { Toolbar } from '@/components/toolbar';
import type { Metadata } from 'next';

const BASE_URL = 'https://docs.agentcommunity.org';

interface Props {
  params: Promise<{ slug?: string[] }>;
}

function normalizeSlug(slug?: string[]): { normalized: string[]; hasChanged: boolean } {
  const raw = slug ?? [];
  const normalized = [...raw];

  while (normalized.length > 0 && normalized[normalized.length - 1] === 'index') {
    normalized.pop();
  }

  return { normalized, hasChanged: normalized.length !== raw.length };
}

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return [
    { slug: undefined },
    ...slugs.filter(s => s.length > 0).map(s => ({ slug: s })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { normalized } = normalizeSlug(slug);
  const doc = getDoc(normalized);
  if (!doc) return {};

  const ogSlug = normalized.length > 0 ? normalized.join('/') : 'index';
  const ogImage = `/og/docs-${ogSlug.replace(/\//g, '-')}.png`;
  const canonical = normalized.length > 0 ? `${BASE_URL}/docs/${normalized.join('/')}` : `${BASE_URL}/docs`;

  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical },
    openGraph: {
      title: doc.title,
      description: doc.description,
      url: canonical,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description,
      images: [ogImage],
    },
  };
}

export default async function DocsPage({ params }: Props) {
  const { slug } = await params;
  const { normalized, hasChanged } = normalizeSlug(slug);
  if (hasChanged) {
    const target = normalized.length > 0 ? `/docs/${normalized.join('/')}` : '/docs';
    permanentRedirect(target);
  }

  const doc = getDoc(normalized);
  if (!doc) notFound();

  const fileSlug = normalized.length > 0 ? normalized.join('/') : 'index';

  return (
    <>
      <main className="flex-1 min-w-0 px-6 py-8 lg:px-12">
        <SetMobileHeadings headings={doc.headings} />
        <article className="max-w-3xl">
          <Toolbar rawContent={doc.rawContent} slug={fileSlug} type="docs" />
          <MDXRemote
            source={doc.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
              },
            }}
            components={mdxComponents}
          />
        </article>
      </main>
      <aside className="hidden xl:block w-56 shrink-0 p-6 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
        <TableOfContents headings={doc.headings} />
      </aside>
    </>
  );
}
