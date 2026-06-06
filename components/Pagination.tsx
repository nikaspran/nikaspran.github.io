import Link from 'next/link';

function hrefForPage(page: number) {
  return page <= 1 ? '/' : `/page${page}/`;
}

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const previousPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <nav className="pagination" aria-label="Pagination">
      {previousPage ? (
        <Link href={hrefForPage(previousPage)}>Newer</Link>
      ) : (
        <span aria-disabled="true">Newer</span>
      )}
      {nextPage ? <Link href={hrefForPage(nextPage)}>Older</Link> : <span aria-disabled="true">Older</span>}
    </nav>
  );
}
