import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';
import Script from 'next/script';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const slug = params.slug || [];

  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const apiSlug = slug.length > 0 ? slug.join('/') : 'index';

  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const breadcrumb = {
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
  };

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{
        enabled: true,
      }}
      lastUpdate={page.data.lastModified}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <Script id="ld-docs-breadcrumbs" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
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

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const slug = params.slug || [];
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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

  return {};
}
