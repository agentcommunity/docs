import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';
import { getAllDocSlugs } from '@/lib/docs';
import { getAllPosts } from '@/lib/blog';

const DOCS_BASE_URL = 'https://docs.agentcommunity.org';
const BLOG_BASE_URL = 'https://blog.agentcommunity.org';

describe('sitemap', () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);

  it('has no duplicate URLs', () => {
    expect(urls.length).toBe(new Set(urls).size);
  });

  it('contains only https URLs', () => {
    for (const url of urls) {
      expect(url.startsWith('https://'), `non-https sitemap URL: ${url}`).toBe(true);
    }
  });

  it('includes docs and blog roots', () => {
    expect(urls).toContain(`${DOCS_BASE_URL}/docs`);
    expect(urls).toContain(BLOG_BASE_URL);
  });

  it('includes every docs slug URL', () => {
    for (const slug of getAllDocSlugs()) {
      const expectedUrl =
        slug.length === 0 ? `${DOCS_BASE_URL}/docs` : `${DOCS_BASE_URL}/docs/${slug.join('/')}`;
      expect(urls, `missing docs URL in sitemap: ${expectedUrl}`).toContain(expectedUrl);
    }
  });

  it('includes every blog post URL', () => {
    for (const post of getAllPosts()) {
      const expectedUrl = `${BLOG_BASE_URL}/${post.slug}`;
      expect(urls, `missing blog URL in sitemap: ${expectedUrl}`).toContain(expectedUrl);
    }
  });

  it('keeps docs URLs on docs host and blog URLs on blog host', () => {
    for (const url of urls) {
      if (url === BLOG_BASE_URL || url.startsWith(`${BLOG_BASE_URL}/`)) {
        expect(url.startsWith(BLOG_BASE_URL), `blog URL on wrong host: ${url}`).toBe(true);
      }
      if (url === `${DOCS_BASE_URL}/docs` || url.startsWith(`${DOCS_BASE_URL}/docs/`)) {
        expect(url.startsWith(DOCS_BASE_URL), `docs URL on wrong host: ${url}`).toBe(true);
      }
    }
  });

  it('sets lastModified and changeFrequency for all entries', () => {
    for (const entry of entries) {
      expect(entry.lastModified, `missing lastModified for ${entry.url}`).toBeDefined();
      expect(entry.changeFrequency, `missing changeFrequency for ${entry.url}`).toBeDefined();
    }
  });
});
