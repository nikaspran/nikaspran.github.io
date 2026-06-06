# nikas.praninskas.com

Personal blog for [nikas.praninskas.com](https://nikas.praninskas.com).

This site is built with Next.js and exported as static files.

## Development

Install dependencies:

```sh
npm install
```

Run locally:

```sh
npm run dev
```

The dev server usually runs at <http://localhost:3000>.

## Build

```sh
npm run build
```

The production site is written to `out/`.

## Checks

```sh
npm run typecheck
npm run lint
```

## Content

Posts live in `_posts/` as Markdown with Jekyll-style frontmatter. The Next.js content loader preserves the existing URL structure, custom permalinks, redirects, raw HTML embeds, and `{% post_url ... %}` links.

Static assets live in `public/`. RSS is generated into `public/feed.xml` during `npm run build`.

## Deployment

GitHub Pages deployment is configured in `.github/workflows/pages.yml`. The workflow builds the static export and deploys `out/`.
