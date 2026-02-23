import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: [
      'https://docs.agentcommunity.org/sitemap.xml',
      'https://blog.agentcommunity.org/sitemap.xml',
    ],
  };
}
