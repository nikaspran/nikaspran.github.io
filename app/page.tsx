import type { Metadata } from 'next';
import { Pagination } from '@/components/Pagination';
import { PostList } from '@/components/PostList';
import { getPaginatedPosts } from '@/lib/content';

export const metadata: Metadata = {
  alternates: {
    canonical: '/'
  }
};

export default function Home() {
  const { posts, page, totalPages } = getPaginatedPosts(1);

  return (
    <main className="shell page-content">
      <PostList posts={posts} />
      <Pagination page={page} totalPages={totalPages} />
    </main>
  );
}
