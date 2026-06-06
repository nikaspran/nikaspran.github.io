import type { Post } from '@/lib/content';
import { formatDate } from '@/lib/content';

export function Article({ post, html }: { post: Post; html: string }) {
  const duration = post.layout === 'talk' ? `${post.minutes ?? post.readTime} minute watch` : `${post.readTime} minute read`;

  return (
    <article className="article">
      <header className="article-header">
        <h1>{post.title}</h1>
        <div className="article-meta">
          <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time>
          {post.updateDate ? <span>Updated {formatDate(post.updateDate)}</span> : null}
          <span>{duration}</span>
          {post.location ? <span>{post.location}</span> : null}
        </div>
        {post.tags.length > 0 ? (
          <ul className="tag-list article-tags" aria-label="Tags">
            {post.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </header>

      <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

      {post.comments ? (
        <section className="comments" aria-label="Comments">
          <h2>Comments</h2>
          <div id="disqus_thread" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                var disqus_shortname = 'nikaspran';
                (function() {
                  var dsq = document.createElement('script');
                  dsq.type = 'text/javascript';
                  dsq.async = true;
                  dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
                  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
                })();
              `
            }}
          />
          <noscript>
            Please enable JavaScript to view the comments powered by Disqus.
          </noscript>
        </section>
      ) : null}
    </article>
  );
}

export function ArticleToc({ post }: { post: Post }) {
  if (post.headings.length === 0) {
    return null;
  }

  return (
    <aside className="toc" aria-label="On this page">
      <p>On this page</p>
      <ol>
        {post.headings.map((heading) => (
          <li key={heading.id} className={`depth-${heading.depth}`}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
