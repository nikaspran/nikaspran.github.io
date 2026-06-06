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

If GitHub Pages is configured as "Deploy from branch", publish the static export into the repository root before committing:

```sh
npm run export:root
```

This writes `index.html`, `.nojekyll`, `CNAME`, `_next/`, and route folders at the branch root so GitHub Pages serves the static Next.js output directly.

## Checks

```sh
npm run typecheck
npm run lint
```

## Content

Posts live in `_posts/` as Markdown with Jekyll-style frontmatter. The Next.js content loader preserves the existing URL structure, custom permalinks, redirects, raw HTML embeds, and `{% post_url ... %}` links.

Static assets live in `public/`. RSS is generated into `public/feed.xml` during `npm run build`.

## Deployment

Preferred: configure GitHub Pages to use "GitHub Actions". `.github/workflows/pages.yml` builds and deploys `out/`.

Fallback: if Pages is still configured as "Deploy from branch", run `npm run export:root` and commit the generated root files.
