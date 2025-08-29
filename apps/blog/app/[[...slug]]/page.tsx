import { blogSource } from '../../lib/source';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import path from 'node:path';
import fs from 'node:fs/promises';
import type { MDXComponents } from 'mdx/types';
import { LLMCopyButton, ViewOptions } from '../../components/ai/page-actions';
import Script from 'next/script';
export const runtime = 'nodejs';

interface BlogFrontmatter {
  title: string;
  description?: string;
  icon?: string;
  full?: boolean;
  _openapi?: object;
  author?: string;
  date?: string | Date;
  tags?: string[];
  image?: string;
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

export default async function BlogPage(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};
  // Normalize slug: Treat empty string segments as no segment to avoid false 404 at root
  const rawSlug = params.slug ?? [];
  const normSlug = rawSlug.filter((s) => typeof s === 'string' && s.trim() !== '');
  const isRoot = normSlug.length === 0 || (normSlug.length === 1 && normSlug[0] === 'index');

  if (isRoot) {
    const pages = (blogSource.getPages() as unknown as LoadedBlogPage[]).filter((p) => p.slugs.join('/') !== 'index');

    function parseDate(value: unknown): Date | undefined {
      if (!value) return undefined;
      if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value;
      if (typeof value === 'string') {
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? undefined : d;
      }
      return undefined;
    }

    async function readFrontmatterFromFile(p: LoadedBlogPage): Promise<Partial<BlogFrontmatter>> {
      try {
        const baseDir = path.join(process.cwd(), '../../content/blog');
        const baseName = p.slugs.join('/');
        const tryFiles = [
          path.join(baseDir, `${baseName}.mdx`),
          path.join(baseDir, `${baseName}.md`),
        ];
        let raw: string | undefined;
        for (const f of tryFiles) {
          try {
            raw = await fs.readFile(f, 'utf8');
            break;
          } catch {}
        }
        if (!raw) return {};
        const m = raw.match(/^---[\s\S]*?---/);
        if (!m) return {};
        const fmBlock = m[0].replace(/^---|---$/g, '').trim();
        const out: Partial<BlogFrontmatter> = {};
        for (const line of fmBlock.split('\n')) {
          const idx = line.indexOf(':');
          if (idx === -1) continue;
          const key = line.slice(0, idx).trim();
          const val = line.slice(idx + 1).trim();
          if (key === 'title' || key === 'description' || key === 'author') {
            out[key] = val.replace(/^"|^'|"$|'$/g, '');
          } else if (key === 'date') {
            out.date = val.replace(/^"|^'|"$|'$/g, '');
          } else if (key === 'tags') {
            // supports YAML array inline: [a, b, c]
            const arr = val.match(/^\[(.*)\]$/);
            if (arr) {
              out.tags = arr[1]
                .split(',')
                .map((s) => s.trim().replace(/^"|^'|"$|'$/g, ''))
                .filter(Boolean);
            }
          } else if (key === 'image' || key === 'cover') {
            out.image = val.replace(/^"|^'|"$|'$/g, '');
          }
        }
        return out;
      } catch {
        return {};
      }
    }

    async function getDataWithFrontmatter(p: LoadedBlogPage): Promise<Partial<BlogFrontmatter & { lastModified?: Date | string }>> {
      const data = p.data as BlogPageData & { frontmatter?: Partial<BlogFrontmatter>; _exports?: { frontmatter?: Partial<BlogFrontmatter> } };
      const fm: Partial<BlogFrontmatter & { lastModified?: Date | string }> =
        data.frontmatter ?? data._exports?.frontmatter ?? await readFrontmatterFromFile(p);
      return {
        title: data.title ?? fm.title,
        description: data.description ?? fm.description,
        author: data.author ?? fm.author,
        date: data.date ?? fm.date,
        tags: data.tags ?? fm.tags,
        image: data.image ?? fm.image,
        lastModified: data.lastModified,
      };
    }

    function extractDateFromSlugOrFile(p: LoadedBlogPage): Date | undefined {
      const fileName = p.slugs[0];
      if (!fileName) return undefined;
      const iso = fileName.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
      return iso ? parseDate(iso) : undefined;
    }

    const enriched = await Promise.all(
      pages.map(async (p) => {
        const meta = await getDataWithFrontmatter(p);
        const parsedDate = parseDate(meta.date) || parseDate(meta.lastModified) || extractDateFromSlugOrFile(p);
        return { p, meta, parsedDate };
      })
    );

    enriched.sort((a, b) => (b.parsedDate?.getTime() ?? 0) - (a.parsedDate?.getTime() ?? 0));

    const tagParam = typeof searchParams?.tag === 'string' ? searchParams.tag : undefined;
    const allTags = Array.from(new Set(
      enriched.flatMap((e) => (Array.isArray(e.meta.tags) ? e.meta.tags : []))
    )).sort((a, b) => a.localeCompare(b));

    const filtered = tagParam
      ? enriched.filter((e) => Array.isArray(e.meta.tags) && e.meta.tags.includes(tagParam))
      : enriched;

    return (
      <div className="container max-w-3xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">.agent Community Blog</h1>
          <p className="text-lg md:text-xl text-muted-foreground">Insights, updates, and thoughts from the .agent community</p>
        </header>
        <Script id="ld-blog-index" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: '.agent Community Blog',
            url: `${(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')}${process.env.NEXT_PUBLIC_BASE_PATH || ''}`,
            blogPost: enriched.slice(0, 50).map((e) => ({
              '@type': 'BlogPosting',
              headline: e.meta.title,
              description: e.meta.description,
              url: `${(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')}${process.env.NEXT_PUBLIC_BASE_PATH || ''}/${e.p.slugs.join('/')}`,
              datePublished: e.parsedDate ? e.parsedDate.toISOString() : undefined,
            })),
          }) }}
        />

        {allTags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={{ pathname: '/', query: {} }} className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${!tagParam ? 'bg-muted' : 'hover:bg-muted/60'}`}>
                All
              </Link>
              {allTags.map((t) => (
                <Link
                  key={t}
                  href={{ pathname: '/', query: { tag: t } }}
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${tagParam === t ? 'bg-muted' : 'hover:bg-muted/60'}`}
                >
                  #{t}
                </Link>
              ))}
              {tagParam && (
                <Link href={{ pathname: '/', query: {} }} className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs hover:bg-muted/60">
                  Clear
                </Link>
              )}
            </div>
          </div>
        )}

        <ul className="space-y-6">
          {filtered.map((e) => {
            const href = `/${e.p.slugs.join('/')}`;
            const dateLabel = e.parsedDate
              ? e.parsedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
              : undefined;
            const data = e.meta as BlogFrontmatter;

            return (
              <li key={href} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                <Link href={href} className="flex gap-4 items-start">
                  {data.image && (
                    <img
                      src={data.image}
                      alt=""
                      width={96}
                      height={96}
                      className="h-24 w-24 rounded-md object-cover border"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold mb-1">{data.title}</h2>
                    {data.description && (
                      <p className="text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{data.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
                      {dateLabel && (
                        <span className="text-gray-600 dark:text-gray-300 font-medium">{dateLabel}</span>
                      )}
                      {Array.isArray(data.tags) && data.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {data.tags.map((tag) => (
                            <Link
                              key={tag}
                              href={{ pathname: '/', query: { tag } }}
                              className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs hover:bg-muted/60"
                            >
                              #{tag}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
    </div>
    );
  }

  const page = blogSource.getPage(normSlug);
  if (!page) notFound();

  const pageData = page.data as BlogPageData;
  const MDXContent = pageData.body;
  const apiSlug = normSlug.length > 0 ? normSlug.join('/') : 'index';
  async function readFrontmatterForSlug(slugParts: string[]): Promise<string[] | undefined> {
    try {
      const baseDir = path.join(process.cwd(), '../../content/blog');
      const baseName = slugParts.join('/');
      for (const ext of ['mdx', 'md']) {
        const f = path.join(baseDir, `${baseName}.${ext}`);
        try {
          const raw = await fs.readFile(f, 'utf8');
          const m = raw.match(/^---[\s\S]*?---/);
          if (!m) break;
          const fmBlock = m[0].replace(/^---|---$/g, '').trim();
          const line = fmBlock.split('\n').find((l) => l.trim().startsWith('tags:'));
          if (!line) break;
          const arr = line.split(':').slice(1).join(':').trim().match(/^\[(.*)\]$/);
          if (arr) return arr[1].split(',').map((s) => s.trim().replace(/^"|^'|"$|'$/g, '')).filter(Boolean);
          break;
        } catch {}
      }
    } catch {}
    return undefined;
  }
  const exportedFm = (pageData._exports as { frontmatter?: Partial<BlogFrontmatter> } | undefined)?.frontmatter;
  const pageTags: string[] | undefined = Array.isArray(pageData.tags)
    ? pageData.tags
    : Array.isArray(exportedFm?.tags)
      ? exportedFm?.tags
      : await readFrontmatterForSlug(page.slugs);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-10">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{pageData.title}</h1>
          {pageData.description && (<p className="text-lg md:text-xl text-muted-foreground mb-4">{pageData.description}</p>)}
          <div className="flex flex-row flex-wrap gap-2 items-center border-b pt-2 pb-6">
            <LLMCopyButton markdownUrl={`/api/mdx/blog/${apiSlug}`} />
            <ViewOptions markdownUrl={`/api/mdx/blog/${apiSlug}`} githubUrl={`https://github.com/agentcommunity/docs/blob/main/content/blog/${page.slugs.join('/')}.mdx`} />
            {Array.isArray(pageTags) && pageTags.length > 0 && (
              <div className="flex flex-wrap gap-2 ml-auto">
                {pageTags.map((tag) => (
                  <Link
                    key={tag}
                    href={{ pathname: '/', query: { tag } }}
                    className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted/60"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
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
  const posts = blogSource.getPages().map((page) => ({ slug: page.slugs }));
  // Include root index and optional /index path so production build serves the landing page
  return [
    { slug: [] as string[] },
    { slug: ['index'] as string[] },
    ...posts,
  ];
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const isRoot = !params.slug || params.slug.length === 0 || (params.slug.length === 1 && params.slug[0] === 'index');
  if (isRoot) {
    const og = ['/blog-og', 'index', 'image.png'].join('/');
    return { title: '.agent Community Blog', description: 'Latest posts from the .agent community', alternates: { canonical: `${base}/blog` }, openGraph: { type: 'website', title: '.agent Community Blog', description: 'Latest posts from the .agent community', url: `${base}/blog`, images: og }, twitter: { card: 'summary_large_image', images: og } } as const;
  }
  const page = blogSource.getPage(normSlug);
  if (!page) notFound();
  const pageData = page.data as BlogPageData;
  const slugPath = normSlug.length > 0 ? normSlug.join('/') : 'index';
  const og = ['/blog-og', ...normSlug, 'image.png'].join('/');
  return { title: pageData.title, description: pageData.description, alternates: { canonical: `${base}/blog/${slugPath}` }, openGraph: { type: 'article', title: pageData.title, description: pageData.description, url: `${base}/blog/${slugPath}`, images: og }, twitter: { card: 'summary_large_image', images: og } } as const;
}
