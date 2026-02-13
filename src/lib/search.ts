import { getAllDocSlugs, getDoc } from './docs';
import { getAllPosts } from './blog';

export interface SearchEntry {
  title: string;
  description: string;
  href: string;
  type: 'docs' | 'blog';
  content: string;
}

let cachedIndex: SearchEntry[] | null = null;

export function getSearchIndex(): SearchEntry[] {
  if (cachedIndex) return cachedIndex;

  const entries: SearchEntry[] = [];

  // Index docs
  for (const slug of getAllDocSlugs()) {
    const doc = getDoc(slug);
    if (!doc) continue;
    entries.push({
      title: doc.title,
      description: doc.description,
      href: slug.length === 0 ? '/docs' : `/docs/${slug.join('/')}`,
      type: 'docs',
      content: doc.content.toLowerCase(),
    });
  }

  // Index blog
  for (const post of getAllPosts()) {
    entries.push({
      title: post.title,
      description: post.description,
      href: `/blog/${post.slug}`,
      type: 'blog',
      content: post.content.toLowerCase(),
    });
  }

  cachedIndex = entries;
  return entries;
}

export function search(query: string): SearchEntry[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const index = getSearchIndex();

  return index
    .filter(entry =>
      entry.title.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q) ||
      entry.content.includes(q)
    )
    .map(({ content: _, ...rest }) => rest) as SearchEntry[];
}
