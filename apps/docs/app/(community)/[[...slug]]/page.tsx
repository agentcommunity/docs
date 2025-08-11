import { source } from '@/lib/source';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';
import type React from 'react';
import type { MDXComponents } from 'mdx/types';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const slug = params.slug || [];

  const page = source.getPage(slug);
  if (!page) notFound();

  type MDXContent = React.ComponentType<{ components?: MDXComponents }>;
  const MDX = page.data.body as MDXContent;
  const apiSlug = slug.length > 0 ? slug.join('/') : 'index';

  return (
    <DocsPage toc={page.data.toc} tableOfContent={{ enabled: true }} lastUpdate={page.data.lastModified}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <div className="flex flex-row gap-2 mb-4 mt-2">
        <LLMCopyButton markdownUrl={`/api/mdx/docs/${apiSlug}`} />
        <ViewOptions markdownUrl={`/api/mdx/docs/${apiSlug}`} githubUrl={`https://github.com/agentcommunity/docs/blob/main/content/docs/${slug.join('/')}.mdx`} />
      </div>
      {page.data.description && <DocsDescription>{page.data.description}</DocsDescription>}
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const slug = params.slug || [];
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const page = source.getPage(slug);
  if (page) {
    return {
      title: page.data.title,
      description: page.data.description,
      alternates: { canonical: `${base}/${slug.join('/')}` },
    } as const;
  }
  return {};
}


