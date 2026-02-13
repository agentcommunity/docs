import type { MetadataRoute } from 'next';
import { getAllDocSlugs } from '@/lib/docs';
import { getAllPosts } from '@/lib/blog';

const BASE_URL = 'https://docs.agentcommunity.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const docPages = getAllDocSlugs().map(slug => ({
    url: slug.length === 0 ? `${BASE_URL}/docs` : `${BASE_URL}/docs/${slug.join('/')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
  }));

  const blogPages = getAllPosts().map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly' },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly' },
    ...docPages,
    ...blogPages,
  ];
}
