import Link from 'next/link';
import type { BlogPost } from '@/lib/types';

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors no-underline">
      <div className="flex gap-4">
        {post.image && (
          <img src={post.image} alt="" className="w-24 h-24 rounded-md object-cover shrink-0" />
        )}
        <div className="min-w-0">
          <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">{post.title}</h2>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            <div className="flex gap-1 flex-wrap">
              {post.tags.slice(0, 3).map(tag => (
                <span key={tag} className="rounded-full bg-muted px-2 py-0.5">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
