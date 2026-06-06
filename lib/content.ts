import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';
import { site } from './site';

const postsDirectory = path.join(process.cwd(), '_posts');

export type PostLayout = 'post' | 'talk';

export type Frontmatter = {
  layout?: PostLayout;
  title?: string;
  date?: Date | string;
  summary?: string | null;
  categories?: string | string[];
  tags?: string | string[];
  comments?: boolean;
  minutes?: number;
  location?: string;
  update_date?: Date | string;
  permalink?: string;
  redirect_from?: string[];
};

export type Heading = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export type Post = {
  id: string;
  slug: string;
  sourcePath: string;
  layout: PostLayout;
  title: string;
  date: Date;
  summary: string;
  categories: string[];
  tags: string[];
  comments: boolean;
  minutes?: number;
  location?: string;
  updateDate?: Date;
  permalink?: string;
  redirectFrom: string[];
  url: string;
  content: string;
  headings: Heading[];
  readTime: number;
};

const datePrefixPattern = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/;

function asArray(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function asDate(value: unknown, fallback: Date): Date {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    return new Date(value);
  }

  return fallback;
}

function cleanPermalink(permalink: string): string {
  return permalink.startsWith('/') ? permalink : `/${permalink}`;
}

function dateParts(date: Date) {
  return {
    year: String(date.getUTCFullYear()),
    month: String(date.getUTCMonth() + 1).padStart(2, '0'),
    day: String(date.getUTCDate()).padStart(2, '0')
  };
}

function urlForPost(fileSlug: string, date: Date, categories: string[], permalink?: string) {
  if (permalink) {
    return cleanPermalink(permalink).replace(/\/?$/, '/');
  }

  const category = categories[0] ?? 'posts';
  const { year, month, day } = dateParts(date);
  return `/${category}/${year}/${month}/${day}/${fileSlug}/`;
}

function wordCount(content: string) {
  return content
    .replace(/<[^>]*>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function extractHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();

  return content
    .split('\n')
    .flatMap((line) => {
      const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);

      if (!match) {
        return [];
      }

      const text = match[2]
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_~]/g, '')
        .trim();

      return [
        {
          id: slugger.slug(text),
          text,
          depth: match[1].length as 2 | 3
        }
      ];
    })
    .slice(0, 8);
}

function replacePostUrls(content: string, urlById: Map<string, string>) {
  return content.replace(/\{% post_url ([^ %}]+) %\}/g, (_, id: string) => {
    return urlById.get(id) ?? `/${id}/`;
  });
}

let cachedPosts: Post[] | undefined;

function loadPostsUncached() {
  const files = fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'));
  const parsed = files.map((file) => {
    const match = datePrefixPattern.exec(file);

    if (!match) {
      throw new Error(`Post filename does not match Jekyll format: ${file}`);
    }

    const [, year, month, day, fileSlug] = match;
    const sourcePath = path.join(postsDirectory, file);
    const source = fs.readFileSync(sourcePath, 'utf8');
    const { data, content } = matter(source);
    const frontmatter = data as Frontmatter;
    const fallbackDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    const date = asDate(frontmatter.date, fallbackDate);
    const categories = asArray(frontmatter.categories);
    const tags = asArray(frontmatter.tags);
    const layout = frontmatter.layout === 'talk' ? 'talk' : 'post';
    const title = frontmatter.title ?? fileSlug;
    const summary = frontmatter.summary?.trim() ?? '';
    const permalink = frontmatter.permalink;

    return {
      id: `${year}-${month}-${day}-${fileSlug}`,
      slug: fileSlug,
      sourcePath,
      layout,
      title,
      date,
      summary,
      categories,
      tags,
      comments: Boolean(frontmatter.comments),
      minutes: frontmatter.minutes,
      location: frontmatter.location,
      updateDate: frontmatter.update_date ? asDate(frontmatter.update_date, date) : undefined,
      permalink,
      redirectFrom: asArray(frontmatter.redirect_from),
      url: urlForPost(fileSlug, date, categories, permalink),
      content,
      headings: extractHeadings(content),
      readTime: Math.max(1, Math.round(wordCount(content) / 180))
    } satisfies Post;
  });

  const urlById = new Map(parsed.map((post) => [post.id, post.url]));

  return parsed
    .map((post) => ({
      ...post,
      content: replacePostUrls(post.content, urlById)
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getAllPosts() {
  cachedPosts ??= loadPostsUncached();
  return cachedPosts;
}

export function getBlogPosts() {
  return getAllPosts().filter((post) => post.layout !== 'talk');
}

export function getTalks() {
  return getAllPosts().filter((post) => post.layout === 'talk');
}

export function getPostBySlugPath(slugPath: string[]) {
  const requested = `/${slugPath.join('/')}/`;
  return getAllPosts().find((post) => post.url === requested);
}

export function getRedirectBySlugPath(slugPath: string[]) {
  const requested = `/${slugPath.join('/')}/`;
  return getAllPosts().find((post) => post.redirectFrom.includes(requested));
}

export function getPostStaticParams() {
  const { totalPages } = getPaginatedPosts(1);
  const paginationRoutes = Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    slug: [`page${index + 2}`]
  }));

  const postRoutes = getAllPosts().map((post) => ({
    slug: post.url.replace(/^\/|\/$/g, '').split('/')
  }));

  const redirectRoutes = getAllPosts().flatMap((post) =>
    post.redirectFrom.map((redirect) => ({
      slug: redirect.replace(/^\/|\/$/g, '').split('/')
    }))
  );

  return [...paginationRoutes, ...postRoutes, ...redirectRoutes];
}

export function getPaginatedPosts(page: number) {
  const posts = getAllPosts();
  const totalPages = Math.ceil(posts.length / site.postsPerPage);
  const start = (page - 1) * site.postsPerPage;

  return {
    posts: posts.slice(start, start + site.postsPerPage),
    totalPages,
    page
  };
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);
}

export function absoluteUrl(pathname: string) {
  return `${site.url}${pathname}`;
}
