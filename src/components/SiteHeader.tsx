import Link from "next/link";
import { site } from "@/lib/site";
import { CartLink } from "./CartLink";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-container site-header__inner">
        <Link href="/" className="site-logo">
          {site.name}
        </Link>
        <nav className="site-nav" aria-label="Chính">
          <Link href="/huong-dan">Hướng dẫn</Link>
          <Link href="/cua-hang">Cửa hàng</Link>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <p className="kn-muted">
          {site.name} — {site.tagline}
        </p>
      </div>
    </footer>
  );
}
