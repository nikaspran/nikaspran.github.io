import Link from 'next/link';
import type { Post } from '@/lib/content';
import { formatDate } from '@/lib/content';

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <article className="post-row" key={post.url}>
          <Link href={post.url} className="post-row-link">
            <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time>
            <div>
              <div className="post-row-title">
                <h2>{post.title}</h2>
                <span>{post.layout === 'talk' ? 'Talk' : `${post.readTime} min`}</span>
              </div>
              {post.summary ? <p>{post.summary}</p> : null}
              {post.tags.length > 0 ? (
                <ul className="tag-list" aria-label="Tags">
                  {post.tags.slice(0, 4).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
