import Link from 'next/link';
import { navItems, site } from '@/lib/site';

export function Header() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="site-title" href="/">
          {site.title}
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
