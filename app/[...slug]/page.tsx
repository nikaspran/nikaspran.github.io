import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Article, ArticleToc } from '@/components/Article';
import { Pagination } from '@/components/Pagination';
import { PostList } from '@/components/PostList';
import { RedirectPage } from '@/components/RedirectPage';
import {
  absoluteUrl,
  getPaginatedPosts,
  getPostBySlugPath,
  getPostStaticParams,
  getRedirectBySlugPath
} from '@/lib/content';
import { markdownToHtml } from '@/lib/markdown';
import { site } from '@/lib/site';

export const dynamic = 'error';
export const dynamicParams = false;

type Props = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return getPostStaticParams();
}

function paginationPage(slug: string[]) {
  if (slug.length !== 1) {
    return null;
  }

  const match = /^page(\d+)$/.exec(slug[0]);
  return match ? Number(match[1]) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = paginationPage(slug);

  if (page) {
    return {
      title: `Page ${page}`,
      alternates: {
        canonical: `/page${page}/`
      }
    };
  }

  const redirect = getRedirectBySlugPath(slug);
  const post = redirect ?? getPostBySlugPath(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.summary || site.description,
    keywords: post.tags,
    alternates: {
      canonical: absoluteUrl(post.url)
    }
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const page = paginationPage(slug);

  if (page) {
    const paginated = getPaginatedPosts(page);

    if (page < 2 || page > paginated.totalPages) {
      notFound();
    }

    return (
      <main className="shell page-content">
        <section className="page-heading compact">
          <h1>Archive, page {page}</h1>
          <p>Older writing and talks from the blog archive.</p>
        </section>
        <PostList posts={paginated.posts} />
        <Pagination page={paginated.page} totalPages={paginated.totalPages} />
      </main>
    );
  }

  const redirect = getRedirectBySlugPath(slug);

  if (redirect) {
    return <RedirectPage post={redirect} />;
  }

  const post = getPostBySlugPath(slug);

  if (!post) {
    notFound();
  }

  const html = await markdownToHtml(post.content);

  return (
    <main className="shell article-shell">
      <Article post={post} html={html} />
      <ArticleToc post={post} />
    </main>
  );
}
