import Link from 'next/link';
import { site } from '@/lib/site';

function GithubIcon() {
  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 24 24">
      <path d="M12 .5a12 12 0 0 0-3.8 23.39c.6.11.82-.26.82-.58v-2.1c-3.34.73-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.1-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.57c1.02 0 2.05.14 3.01.41 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.93.43.37.82 1.1.82 2.23v3.3c0 .32.21.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function BlueskyIcon() {
  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 24 24">
      <path d="M5.1 3.25C7.9 5.33 10.9 9.56 12 11.83c1.1-2.27 4.1-6.5 6.9-8.58 2.02-1.5 5.29-2.67 5.29 1.04 0 .74-.43 6.22-.68 7.11-.87 3.09-4.04 3.89-6.87 3.41 4.94.83 6.19 3.6 3.48 6.36-5.15 5.25-7.4-1.31-7.98-2.99-.08-.23-.12-.37-.16-.37s-.08.14-.16.37c-.58 1.68-2.83 8.24-7.98 2.99-2.71-2.76-1.46-5.53 3.48-6.36-2.83.48-6-.32-6.87-3.41C.2 10.51-.22 5.03-.22 4.29c0-3.71 3.27-2.54 5.32-1.04Z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <Link href="/" className="muted-link">
          &copy; {site.author} {year}
        </Link>
        <div className="footer-links">
          <a href={`https://github.com/${site.githubUsername}`} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GithubIcon />
          </a>
          <a href={site.blueskyUrl} target="_blank" rel="noreferrer" aria-label="Bluesky">
            <BlueskyIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
