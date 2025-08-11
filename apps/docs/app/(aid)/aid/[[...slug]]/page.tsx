import { aidSource } from '@/lib/source';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';
import type React from 'react';
import type { MDXComponents } from 'mdx/types';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const slug = params.slug || [];
  const page = aidSource.getPage(slug);
  if (!page) notFound();

  type MDXContent = React.ComponentType<{ components?: MDXComponents }>;
  const MDX = page.data.body as MDXContent;
  const apiSlug = slug.length > 0 ? slug.join('/') : 'index';

  return (
    <DocsPage toc={page.data.toc} tableOfContent={{ enabled: true }} lastUpdate={page.data.lastModified}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <div className="flex flex-row gap-2 mb-4 mt-2">
        <LLMCopyButton markdownUrl={`/api/mdx/aid/${apiSlug}`} />
        <ViewOptions markdownUrl={`/api/mdx/aid/${apiSlug}`} githubUrl={`https://github.com/agentcommunity/agent-interface-discovery/tree/main/packages/docs/${slug.join('/')}.md`} />
      </div>
      {page.data.description && <DocsDescription>{page.data.description}</DocsDescription>}
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return aidSource.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const slug = params.slug || [];
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const aidPage = aidSource.getPage(slug);
  if (aidPage) {
    return {
      title: aidPage.data.title,
      description: aidPage.data.description,
      alternates: { canonical: `${base}/aid/${slug.join('/')}` },
    } as const;
  }
  return {};
}


