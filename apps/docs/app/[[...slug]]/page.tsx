import { source, aidSource } from '@/lib/source';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const slug = params.slug || [];

  const isAID = slug[0] === 'aid';

  if (isAID) {
    const aidSlug = slug.slice(1);
    const page = aidSource.getPage(aidSlug);
    if (!page) notFound();

    const MDX = page.data.body;
    const apiSlug = aidSlug.length > 0 ? aidSlug.join('/') : 'index';

    return (
      <DocsPage toc={page.data.toc} tableOfContent={{ enabled: true }} lastUpdate={page.data.lastModified}>
        <DocsTitle>{page.data.title}</DocsTitle>
        <div className="flex flex-row gap-2 mb-4 mt-2">
          <LLMCopyButton markdownUrl={`/api/mdx/aid/${apiSlug}`} />
          <ViewOptions markdownUrl={`/api/mdx/aid/${apiSlug}`} githubUrl={`https://github.com/agentcommunity/agent-interface-discovery/tree/main/packages/docs/${aidSlug.join('/')}.md`} />
        </div>
        {page.data.description && <DocsDescription>{page.data.description}</DocsDescription>}
        <DocsBody>
          <MDX components={getMDXComponents()} />
        </DocsBody>
      </DocsPage>
    );
  }

  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const apiSlug = slug.length > 0 ? slug.join('/') : 'index';

  return (
    <DocsPage toc={page.data.toc} tableOfContent={{ enabled: true }} lastUpdate={page.data.lastModified}}>
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
  const communityParams = source.generateParams();
  const aidParams = aidSource.generateParams().map((p) => ({ slug: ['aid', ...p.slug] }));
  return [...communityParams, ...aidParams];
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

  if (slug[0] === 'aid') {
    const aidSlug = slug.slice(1);
    const aidPage = aidSource.getPage(aidSlug);
    if (aidPage) {
      return {
        title: aidPage.data.title,
        description: aidPage.data.description,
        alternates: { canonical: `${base}/aid/${aidSlug.join('/')}` },
      } as const;
    }
  }
  return {};
}