import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getDoc, getAllDocSlugs } from '@/lib/docs';
import { mdxComponents } from '@/components/mdx-components';
import { TableOfContents } from '@/components/toc';
import { MobileTableOfContents } from '@/components/toc-mobile';
import { Toolbar } from '@/components/toolbar';
import type { Metadata } from 'next';

const BASE_URL = 'https://docs.agentcommunity.org';

interface Props {
  params: Promise<{ slug?: string[] }>;
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
  const doc = getDoc(slug || []);
  if (!doc) return {};

  const ogSlug = slug && slug.length > 0 ? slug.join('/') : 'index';
  const ogImage = `/og/docs-${ogSlug.replace(/\//g, '-')}.png`;
  const canonical = slug && slug.length > 0 ? `${BASE_URL}/docs/${slug.join('/')}` : `${BASE_URL}/docs`;

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
  const doc = getDoc(slug || []);
  if (!doc) notFound();

  const fileSlug = slug && slug.length > 0 ? slug.join('/') : 'index';

  return (
    <>
      <main className="flex-1 min-w-0 px-6 py-8 lg:px-12">
        <article className="max-w-3xl">
          <MobileTableOfContents headings={doc.headings} />
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
