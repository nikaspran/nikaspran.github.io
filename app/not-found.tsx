import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="shell page-content narrow not-found">
      <h1>404</h1>
      <p>Sorry, I cannot seem to find this page.</p>
      <div className="button-row">
        <Link href="/">Home</Link>
        <Link href="/contact/">Contact</Link>
      </div>
    </main>
  );
}
