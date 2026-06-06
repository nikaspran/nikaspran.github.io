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

GitHub Pages must be configured as **Deploy from a branch → `master` → `/ (root)`**.

Push to `master`. `.github/workflows/pages.yml` builds the site, exports it to the branch root (including `.nojekyll` and `CNAME`), and commits the result. GitHub Pages serves those files directly without running Jekyll.

Manual publish:

```sh
npm run export:root
git add -A
git commit -m "Deploy static site"
git push
```
