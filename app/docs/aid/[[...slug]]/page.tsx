import { aidSource } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const slug = params.slug || [];
  const page = aidSource.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const apiSlug = slug.length > 0 ? slug.join('/') : 'index';

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{ enabled: true }}
      lastUpdate={page.data.lastModified}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <div className="flex flex-row gap-2 mb-4 mt-2">
        <LLMCopyButton markdownUrl={`/api/mdx/aid/${apiSlug}`} />
        <ViewOptions
          markdownUrl={`/api/mdx/aid/${apiSlug}`}
          githubUrl={`https://github.com/agentcommunity/agent-interface-discovery/tree/main/packages/docs/${page.slugs.join('/') || 'index'}${page.slugs.includes('index') ? '' : '/index'}.md`}
        />
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


