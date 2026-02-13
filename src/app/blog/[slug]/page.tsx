import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getPost, getAllPostSlugs } from '@/lib/blog';
import { mdxComponents } from '@/components/mdx-components';
import { TableOfContents } from '@/components/toc';
import { MobileTableOfContents } from '@/components/toc-mobile';
import { Toolbar } from '@/components/toolbar';
import type { Metadata } from 'next';

const BASE_URL = 'https://blog.agentcommunity.org';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const ogImage = `/og/blog-${slug}.png`;
  const canonical = `${BASE_URL}/${slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // Find the actual filename for the toolbar
  const fileSlug = slug;

  return (
    <div className="mx-auto max-w-7xl flex">
      <main className="flex-1 min-w-0 px-6 py-8 lg:px-12">
        <article className="max-w-3xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <span>·</span>
              <span>{post.author}</span>
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs">#{tag}</span>
              ))}
            </div>
          </header>
          <Toolbar rawContent={post.rawContent} slug={fileSlug} type="blog" />
          <MobileTableOfContents headings={post.headings} />
          <MDXRemote
            source={post.content}
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
        <TableOfContents headings={post.headings} />
      </aside>
    </div>
  );
}
