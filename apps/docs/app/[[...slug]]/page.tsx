import { source, aidSource } from '@/lib/source';
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
  const isAID = slug.length > 0 && slug[0] === 'aid';
  const pageSlug = isAID ? slug.slice(1) : slug;

  // Select the appropriate source based on URL
  const currentSource = isAID ? aidSource : source;
  const page = currentSource.getPage(pageSlug);

  if (!page) notFound();

  type MDXContent = React.ComponentType<{ components?: MDXComponents }>;
  const MDX = page.data.body as MDXContent;
  const apiSlug = pageSlug.length > 0 ? pageSlug.join('/') : 'index';

  return (
    <DocsLayout>
      <DocsPage toc={page.data.toc} tableOfContent={{ enabled: true }} lastUpdate={page.data.lastModified}>
        <DocsTitle>{page.data.title}</DocsTitle>
        <div className="flex flex-row gap-2 mb-4 mt-2">
          <LLMCopyButton
            markdownUrl={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/mdx/${isAID ? 'aid' : 'docs'}/${apiSlug}`}
          />
          <ViewOptions
            markdownUrl={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/mdx/${isAID ? 'aid' : 'docs'}/${apiSlug}`}
            githubUrl={
              isAID
                ? `https://github.com/agentcommunity/agent-interface-discovery/tree/main/packages/docs/${page.slugs.join('/') || 'index'}${page.slugs.includes('index') ? '' : '/index'}.md`
                : `https://github.com/agentcommunity/docs/tree/main/content/docs/${page.slugs.join('/') || 'index'}${page.slugs.includes('index') ? '' : '/index'}.mdx`
            }
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
  // Generate params for both sources
  const communityParams = source.generateParams().map(params => ({ slug: params.slug }));
  const aidParams = aidSource.generateParams().map(params => ({ slug: ['aid', ...params.slug] }));

  return [...communityParams, ...aidParams];
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const slug = params.slug || [];
  const isAID = slug.length > 0 && slug[0] === 'aid';
  const pageSlug = isAID ? slug.slice(1) : slug;

  const canonicalBase = process.env.NEXT_PUBLIC_CANONICAL_BASE || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const currentSource = isAID ? aidSource : source;
  const page = currentSource.getPage(pageSlug);

  if (page) {
    const canonicalUrl = isAID
      ? `${canonicalBase}/aid/${pageSlug.join('/')}`
      : `${canonicalBase}/${pageSlug.join('/')}`;

    return {
      title: page.data.title,
      description: page.data.description,
      alternates: { canonical: canonicalUrl },
    } as const;
  }
  return {};
}
