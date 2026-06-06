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

Push to `master`. `.github/workflows/pages.yml` builds the site and deploys `out/` to GitHub Pages.

The custom domain is configured via `public/CNAME` (included in the build artifact). Do not commit a root-level `CNAME` file; it can route the custom domain to stale branch content instead of the Actions deployment.

For manual branch-root publishing (legacy fallback only):

```sh
npm run export:root
git add -A
git commit -m "Deploy static site"
git push
```
