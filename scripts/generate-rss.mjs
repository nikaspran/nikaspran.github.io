import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const site = {
  title: 'Nikas Praninskas',
  description: 'A blog about beautiful code, web development and technology',
  url: 'https://nikas.praninskas.com'
};

const postsDirectory = path.join(process.cwd(), '_posts');
const outputPath = path.join(process.cwd(), 'public', 'feed.xml');
const datePrefixPattern = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/;

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function asArray(value) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value.map(String) : String(value).split(',').map((item) => item.trim());
}

function cleanPermalink(permalink) {
  return permalink.startsWith('/') ? permalink : `/${permalink}`;
}

function postUrl(fileSlug, date, categories, permalink) {
  if (permalink) {
    return cleanPermalink(permalink).replace(/\/?$/, '/');
  }

  const category = categories[0] || 'posts';
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `/${category}/${year}/${month}/${day}/${fileSlug}/`;
}

const posts = fs
  .readdirSync(postsDirectory)
  .filter((file) => file.endsWith('.md'))
  .map((file) => {
    const match = datePrefixPattern.exec(file);

    if (!match) {
      throw new Error(`Post filename does not match Jekyll format: ${file}`);
    }

    const [, year, month, day, fileSlug] = match;
    const source = fs.readFileSync(path.join(postsDirectory, file), 'utf8');
    const { data, content } = matter(source);
    const fallbackDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    const date = data.date instanceof Date ? data.date : new Date(data.date || fallbackDate);
    const url = postUrl(fileSlug, date, asArray(data.categories), data.permalink);

    return {
      title: data.title || fileSlug,
      content,
      date,
      url
    };
  })
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 10);

const items = posts
  .map((post) => {
    const href = `${site.url}${post.url}`;

    return `
      <item>
        <title>${escapeXml(post.title)}</title>
        <description>${escapeXml(post.content)}</description>
        <pubDate>${post.date.toUTCString()}</pubDate>
        <link>${escapeXml(href)}</link>
        <guid isPermaLink="true">${escapeXml(href)}</guid>
      </item>`;
  })
  .join('');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <description>${escapeXml(site.description)}</description>
    <link>${site.url}/</link>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>
`;

fs.writeFileSync(outputPath, rss);
