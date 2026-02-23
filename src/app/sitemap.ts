import type { MetadataRoute } from 'next';
import { getAllDocSlugs } from '@/lib/docs';
import { getAllPosts } from '@/lib/blog';

const DOCS_BASE_URL = 'https://docs.agentcommunity.org';
const BLOG_BASE_URL = 'https://blog.agentcommunity.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const docPages = getAllDocSlugs().map(slug => ({
    url: slug.length === 0 ? `${DOCS_BASE_URL}/docs` : `${DOCS_BASE_URL}/docs/${slug.join('/')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
  }));

  const blogPages = getAllPosts().map(post => ({
    url: `${BLOG_BASE_URL}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
  }));

  const uniqueDocPages = Array.from(
    new Map(docPages.map((page) => [page.url, page])).values(),
  );

  return [
    { url: `${DOCS_BASE_URL}/docs`, lastModified: new Date(), changeFrequency: 'weekly' },
    ...uniqueDocPages.filter((page) => page.url !== `${DOCS_BASE_URL}/docs`),
    { url: BLOG_BASE_URL, lastModified: new Date(), changeFrequency: 'weekly' },
    ...blogPages,
  ];
}
