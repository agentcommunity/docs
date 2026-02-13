import { source } from '@/lib/source';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';
import DocsLayout from '../docs-layout';
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
    <DocsLayout>
      <DocsPage toc={page.data.toc} tableOfContent={{ enabled: true }} lastUpdate={page.data.lastModified}>
        <DocsTitle>{page.data.title}</DocsTitle>
        <div className="flex flex-row gap-2 mb-4 mt-2">
          <LLMCopyButton
            markdownUrl={`/api/mdx/docs/${apiSlug}`}
            pageUrl={`/${slug.join('/') || 'index'}`}
          />
          <ViewOptions
            markdownUrl={`/api/mdx/docs/${apiSlug}`}
            githubUrl={`https://github.com/agentcommunity/docs/tree/main/content/docs/${page.slugs.join('/') || 'index'}${page.slugs.includes('index') ? '' : '/index'}.mdx`}
          />
        </div>
        {page.data.description && <DocsDescription>{page.data.description}</DocsDescription>}
        <DocsBody>
          <MDX components={getMDXComponents()} />
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}

export async function generateStaticParams() {
  return source.generateParams().map(params => ({ slug: params.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const slug = params.slug || [];

  const canonicalBase = process.env.NEXT_PUBLIC_CANONICAL_BASE || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const page = source.getPage(slug);

  if (page) {
    const isDocsSubdomain = canonicalBase.includes('docs.agentcommunity.org');

    const canonicalUrl = isDocsSubdomain
      ? `${canonicalBase}/${slug.join('/') || 'index'}`
      : `${canonicalBase}/docs/${slug.join('/') || 'index'}`;

    return {
      title: page.data.title,
      description: page.data.description,
      alternates: { canonical: canonicalUrl },
    } as const;
  }
  return {};
}
