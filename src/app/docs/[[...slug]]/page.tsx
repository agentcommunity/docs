import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getDoc, getAllDocSlugs } from '@/lib/docs';
import { mdxComponents } from '@/components/mdx-components';
import { TableOfContents } from '@/components/toc';
import { MobileTableOfContents } from '@/components/toc-mobile';
import type { Metadata } from 'next';

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
  return {
    title: doc.title,
    description: doc.description,
  };
}

export default async function DocsPage({ params }: Props) {
  const { slug } = await params;
  const doc = getDoc(slug || []);
  if (!doc) notFound();

  return (
    <>
      {/* Main content */}
      <main className="flex-1 min-w-0 px-6 py-8 lg:px-12">
        <article className="max-w-3xl">
          <MobileTableOfContents headings={doc.headings} />
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

      {/* Desktop TOC */}
      <aside className="hidden xl:block w-56 shrink-0 p-6 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
        <TableOfContents headings={doc.headings} />
      </aside>
    </>
  );
}
