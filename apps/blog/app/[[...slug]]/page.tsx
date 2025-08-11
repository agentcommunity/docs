import { blogSource } from '../../lib/source';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';
import { LLMCopyButton, ViewOptions } from '../../components/ai/page-actions';
import Script from 'next/script';

interface BlogFrontmatter {
  title: string;
  description?: string;
  icon?: string;
  full?: boolean;
  _openapi?: object;
  author?: string;
  date?: string | Date;
  tags?: string[];
}

interface BlogPageData extends BlogFrontmatter {
  body: React.ComponentType<{ components?: MDXComponents }>;
  toc?: unknown;
  structuredData?: unknown;
  _exports?: Record<string, unknown>;
  lastModified?: Date;
}

type LoadedBlogPage = { slugs: string[]; data: BlogPageData };

function getBlogMDXComponents(): MDXComponents {
  return {
    h1: ({ children, ...props }) => (<h1 className="text-3xl font-bold mb-4" {...props}>{children}</h1>),
    h2: ({ children, ...props }) => (<h2 className="text-2xl font-semibold mb-3" {...props}>{children}</h2>),
    h3: ({ children, ...props }) => (<h3 className="text-xl font-semibold mb-2" {...props}>{children}</h3>),
    p: ({ children, ...props }) => (<p className="mb-4 leading-relaxed" {...props}>{children}</p>),
    code: ({ children, ...props }) => (<code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>{children}</code>),
    pre: ({ children, ...props }) => (<pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4" {...props}>{children}</pre>),
  };
}

export default async function BlogPage(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const isRoot = !params.slug || params.slug.length === 0 || (params.slug.length === 1 && params.slug[0] === 'index');

  if (isRoot) {
    const pages = (blogSource.getPages() as unknown as LoadedBlogPage[]).filter((p) => p.slugs.join('/') !== 'index');

    function getPublishedDate(p: LoadedBlogPage): Date | undefined {
      const data = p.data as Partial<BlogFrontmatter & { lastModified?: Date }>;
      if (data.date instanceof Date) return data.date;
      if (typeof data.date === 'string') {
        const d = new Date(data.date);
        if (!Number.isNaN(d.getTime())) return d;
      }
      return data.lastModified;
    }

    const sorted = pages.sort((a, b) => {
      const da = getPublishedDate(a)?.getTime() ?? 0;
      const db = getPublishedDate(b)?.getTime() ?? 0;
      return db - da;
    });

    return (
      <div className="container max-w-3xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">.agent Community Blog</h1>
          <p className="text-lg md:text-xl text-muted-foreground">Insights, updates, and thoughts from the .agent community</p>
        </header>

        <ul className="space-y-6">
          {sorted.map((p) => {
            const data = p.data as BlogFrontmatter & { lastModified?: Date };
            const href = `/blog/${p.slugs.join('/')}`;
            const publishedAt = getPublishedDate(p);
            const dateLabel = publishedAt ? publishedAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }) : undefined;

            return (
              <li key={href} className="border rounded-lg p-5 hover:bg-muted/30 transition-colors">
                <Link href={href} className="block">
                  <h2 className="text-xl font-semibold mb-1">{data.title}</h2>
                  {data.description && (<p className="text-muted-foreground mb-2">{data.description}</p>)}
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {dateLabel && <span className="text-muted-foreground">{dateLabel}</span>}
                    {Array.isArray(data.tags) && data.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {data.tags.map((tag) => (<span key={tag} className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs">{tag}</span>))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const page = blogSource.getPage(params.slug);
  if (!page) notFound();

  const pageData = page.data as BlogPageData;
  const MDXContent = pageData.body;
  const apiSlug = params.slug && params.slug.length > 0 ? params.slug.join('/') : 'index';

  return (
    <div className="container max-w-3xl mx-auto px-4 py-10">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{pageData.title}</h1>
          {pageData.description && (<p className="text-lg md:text-xl text-muted-foreground mb-4">{pageData.description}</p>)}
          <div className="flex flex-row gap-2 items-center border-b pt-2 pb-6">
            <LLMCopyButton markdownUrl={`/api/mdx/blog/${apiSlug}`} />
            <ViewOptions markdownUrl={`/api/mdx/blog/${apiSlug}`} githubUrl={`https://github.com/agentcommunity/docs/blob/main/content/blog/${page.slugs.join('/')}.mdx`} />
          </div>
        </header>

        <div className="max-w-none">
          <MDXContent components={getBlogMDXComponents()} />
        </div>
      </article>
      <Script id="ld-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: pageData.title, description: pageData.description, datePublished: (() => { if (pageData.date instanceof Date) return pageData.date.toISOString(); if (typeof pageData.date === 'string') { const d = new Date(pageData.date); return Number.isNaN(d.getTime()) ? undefined : d.toISOString(); } return undefined; })(), dateModified: pageData.lastModified ?? undefined, author: pageData.author ? { '@type': 'Person', name: pageData.author } : undefined, mainEntityOfPage: { '@type': 'WebPage', '@id': typeof window !== 'undefined' ? window.location.href : '' } }) }} />
    </div>
  );
}

export async function generateStaticParams() {
  return blogSource.getPages().map((page) => ({ slug: page.slugs }));
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const isRoot = !params.slug || params.slug.length === 0 || (params.slug.length === 1 && params.slug[0] === 'index');
  if (isRoot) {
    return { title: '.agent Community Blog', description: 'Latest posts from the .agent community', alternates: { canonical: `${base}/blog` }, openGraph: { type: 'website', title: '.agent Community Blog', description: 'Latest posts from the .agent community', url: `${base}/blog` } } as const;
  }
  const page = blogSource.getPage(params.slug);
  if (!page) notFound();
  const pageData = page.data as BlogPageData;
  const slugPath = params.slug && params.slug.length > 0 ? params.slug.join('/') : 'index';
  return { title: pageData.title, description: pageData.description, alternates: { canonical: `${base}/blog/${slugPath}` }, openGraph: { type: 'article', title: pageData.title, description: pageData.description, url: `${base}/blog/${slugPath}` } } as const;
}