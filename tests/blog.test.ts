import { describe, it, expect } from 'vitest';
import { getAllPosts, getPost, getAllPostSlugs, getAllTags } from '@/lib/blog';

describe('blog content', () => {
  const posts = getAllPosts();
  const slugs = getAllPostSlugs();

  it('discovers at least one blog post', () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it('getAllPosts and getAllPostSlugs return the same count', () => {
    expect(posts.length).toBe(slugs.length);
  });

  it('every slug from getAllPostSlugs is loadable via getPost', () => {
    for (const slug of slugs) {
      const post = getPost(slug);
      expect(post, `getPost("${slug}") returned null`).not.toBeNull();
    }
  });

  it('every post has required frontmatter', () => {
    for (const post of posts) {
      expect(post.title, `post ${post.slug} missing title`).toBeTruthy();
      expect(post.description, `post ${post.slug} missing description`).toBeTruthy();
      expect(post.date, `post ${post.slug} missing date`).toBeTruthy();
      expect(post.author, `post ${post.slug} missing author`).toBeTruthy();
    }
  });

  it('every post date is a valid YYYY-MM-DD format', () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    for (const post of posts) {
      expect(post.date, `post ${post.slug} has invalid date: ${post.date}`).toMatch(dateRegex);
      const parsed = new Date(post.date);
      expect(parsed.toString(), `post ${post.slug} date does not parse`).not.toBe('Invalid Date');
    }
  });

  it('posts are sorted by date descending', () => {
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date, `posts not sorted: ${posts[i - 1].slug} (${posts[i - 1].date}) before ${posts[i].slug} (${posts[i].date})`).toBe(true);
    }
  });

  it('no duplicate slugs', () => {
    const unique = new Set(slugs);
    expect(slugs.length).toBe(unique.size);
  });

  it('tags is always an array', () => {
    for (const post of posts) {
      expect(Array.isArray(post.tags), `post ${post.slug} tags is not an array`).toBe(true);
    }
  });

  it('every post has non-empty content', () => {
    for (const post of posts) {
      expect(post.content.trim().length, `post ${post.slug} has empty content`).toBeGreaterThan(0);
    }
  });
});

describe('blog tags', () => {
  const tags = getAllTags();

  it('returns tags as sorted array', () => {
    const sorted = [...tags].sort();
    expect(tags).toEqual(sorted);
  });

  it('no empty tags', () => {
    for (const tag of tags) {
      expect(tag.trim().length).toBeGreaterThan(0);
    }
  });
});
