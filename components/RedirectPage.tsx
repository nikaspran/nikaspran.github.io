import Link from 'next/link';
import type { Post } from '@/lib/content';
import { absoluteUrl } from '@/lib/content';

export function RedirectPage({ post }: { post: Post }) {
  const target = absoluteUrl(post.url);

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${post.url}`} />
      <link rel="canonical" href={target} />
      <main className="shell page-content narrow">
        <h1>Moved</h1>
        <p>
          This page has moved to <Link href={post.url}>{post.title}</Link>.
        </p>
      </main>
    </>
  );
}
