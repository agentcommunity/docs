import { getAllPosts } from '@/lib/blog';

const BLOG_BASE_URL = 'https://blog.agentcommunity.org';

export async function GET() {
  const posts = getAllPosts();

  const items = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BLOG_BASE_URL}/${post.slug}</link>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${BLOG_BASE_URL}/${post.slug}</guid>
      ${post.tags.map(tag => `<category>${tag}</category>`).join('\n      ')}
    </item>`).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>.agent Community Blog</title>
    <link>${BLOG_BASE_URL}</link>
    <description>Insights, updates, and thoughts from the .agent community.</description>
    <language>en</language>
    <atom:link href="${BLOG_BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
