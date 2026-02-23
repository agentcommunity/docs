/**
 * Catches pages with missing SEO-critical frontmatter fields.
 * A page without a title or description silently tanks search rankings.
 */
import { describe, it, expect } from 'vitest';
import { getAllDocSlugs, getDoc } from '@/lib/docs';
import { getAllPosts } from '@/lib/blog';

describe('doc pages have required frontmatter', () => {
  const slugs = getAllDocSlugs();

  it.each(slugs.map(s => [s.join('/') || 'index', s]))(
    '%s',
    (_label, slug) => {
      const doc = getDoc(slug);
      expect(doc, 'page not found').not.toBeNull();
      expect(doc!.title.trim(), 'missing title').not.toBe('');
      expect(doc!.description.trim(), 'missing description').not.toBe('');
    },
  );
});

describe('blog posts have required frontmatter', () => {
  const posts = getAllPosts();

  it.each(posts.map(p => [p.slug, p]))(
    '%s',
    (_slug, post) => {
      expect(post.title.trim(), 'missing title').not.toBe('');
      expect(post.description.trim(), 'missing description').not.toBe('');
      expect(post.date, 'missing date').toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.author.trim(), 'missing author').not.toBe('');
    },
  );
});
