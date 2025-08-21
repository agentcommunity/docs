import { source, aidSource } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';
import { headers } from 'next/headers';
// Local-only: remove remote fetching

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const slug = params.slug || [];
  
  // Get the current pathname to determine which source to use
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Determine if we're in the AID section
  const isAIDRoute = pathname.startsWith('/docs/aid');
  
  if (isAIDRoute) {
    const aidSlug = slug.slice(1);
    const page = aidSource.getPage(aidSlug);
    if (!page) notFound();

    const MDX = page.data.body;
    const apiSlug = aidSlug.length > 0 ? aidSlug.join('/') : 'index';

    return (
      <DocsPage
        toc={page.data.toc}
        tableOfContent={{
          enabled: true,
        }}
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
        {page.data.description && (
          <DocsDescription>{page.data.description}</DocsDescription>
        )}
        <DocsBody>
          <MDX components={getMDXComponents()} />
        </DocsBody>
      </DocsPage>
    );
  } else {
    // Handle community docs with local content
    const page = source.getPage(slug);
    if (!page) notFound();

    const MDX = page.data.body;
    const apiSlug = slug.length > 0 ? slug.join('/') : 'index';

    return (
      <DocsPage
        toc={page.data.toc}
        tableOfContent={{
          enabled: true,
        }}
        lastUpdate={page.data.lastModified}
      >
        <DocsTitle>{page.data.title}</DocsTitle>
        <div className="flex flex-row gap-2 mb-4 mt-2">
          <LLMCopyButton markdownUrl={`/api/mdx/docs/${apiSlug}`} />
          <ViewOptions
            markdownUrl={`/api/mdx/docs/${apiSlug}`}
            githubUrl={`https://github.com/agentcommunity/docs/tree/main/content/docs/${page.slugs.join('/') || 'index'}${page.slugs.includes('index') ? '' : '/index'}.mdx`}
          />
        </div>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody>
          <MDX
            components={getMDXComponents()}
          />
        </DocsBody>
      </DocsPage>
    );
  }
}

export async function generateStaticParams() {
  const communityParams = source.generateParams();
  const aidParams = aidSource.generateParams().map((p) => ({ slug: ['aid', ...p.slug] }));
  return [...communityParams, ...aidParams];
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const slug = params.slug || [];
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Community first
  const page = source.getPage(slug);
  if (page) {
    const image = ['/docs-og', ...slug, 'image.png'].join('/');
    return {
      title: page.data.title,
      description: page.data.description,
      alternates: { canonical: `${base}/docs/${slug.join('/')}` },
      openGraph: {
        images: image,
      },
      twitter: {
        card: 'summary_large_image',
        images: image,
      },
      other: {
        'script:ld+json': JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Docs', item: `${base}/docs` },
            ...(slug.length > 0
              ? slug.map((s, i) => ({
                  '@type': 'ListItem',
                  position: i + 2,
                  name: s,
                  item: `${base}/docs/${slug.slice(0, i + 1).join('/')}`,
                }))
              : []),
          ],
        }),
      },
    };
  }

  // AID
  if (slug[0] === 'aid') {
    const aidSlug = slug.slice(1);
    const aidPage = aidSource.getPage(aidSlug);
    if (aidPage) {
      const image = ['/docs-og', ...slug, 'image.png'].join('/');
      return {
        title: aidPage.data.title,
        description: aidPage.data.description,
        alternates: { canonical: `${base}/docs/aid/${aidSlug.join('/')}` },
        openGraph: {
          images: image,
        },
        twitter: {
          card: 'summary_large_image',
          images: image,
        },
        other: {
          'script:ld+json': JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Docs', item: `${base}/docs` },
              { '@type': 'ListItem', position: 2, name: 'AID', item: `${base}/docs/aid` },
              ...(aidSlug.length > 0
                ? aidSlug.map((s, i) => ({
                    '@type': 'ListItem',
                    position: i + 3,
                    name: s,
                    item: `${base}/docs/aid/${aidSlug.slice(0, i + 1).join('/')}`,
                  }))
                : []),
            ],
          }),
        },
      };
    }
  }

  return {};
}
