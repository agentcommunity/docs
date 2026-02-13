import { Suspense } from 'react';
import { getAllPosts, getAllTags } from '@/lib/blog';
import { BlogPostCard } from '@/components/blog-post-card';
import { TagFilter } from '@/components/tag-filter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, updates, and thoughts from the .agent community.',
};

interface Props {
  searchParams: Promise<{ tag?: string }>;
}

function BlogContent({ tag }: { tag?: string }) {
  const allPosts = getAllPosts();
  const allTags = getAllTags();
  const posts = tag ? allPosts.filter(p => p.tags.includes(tag)) : allPosts;

  return (
    <>
      <Suspense fallback={null}>
        <TagFilter tags={allTags} activeTag={tag} />
      </Suspense>
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts found{tag ? ` for tag "${tag}"` : ''}.</p>
        ) : (
          posts.map(post => <BlogPostCard key={post.slug} post={post} />)
        )}
      </div>
    </>
  );
}

export default async function BlogIndex({ searchParams }: Props) {
  const { tag } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">.agent Community Blog</h1>
      <p className="text-muted-foreground mb-6">Insights, updates, and thoughts from the community.</p>
      <BlogContent tag={tag} />
    </div>
  );
}
