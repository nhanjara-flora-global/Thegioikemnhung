"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { cartCount, useCart } from "@/lib/cart";
import type { Channel } from "@/lib/channels";
import { useSubscriptions } from "@/lib/prefs";
import { site } from "@/lib/site";
import { ChannelAvatar } from "./ChannelAvatar";
import { Icon, type IconName } from "./Icon";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Trang chủ", icon: "home" },
  { href: "/da-thich", label: "Bài đã thích", icon: "heart" },
  { href: "/kenh", label: "Kênh của bạn", icon: "channel" },
  { href: "/cua-hang", label: "Danh sách phụ kiện", icon: "bag" },
];

/** Khung trang kiểu YouTube: thanh trên (logo, tìm kiếm, giỏ hàng) + menu trái. */
export function SiteShell({ channels, children }: { channels: Channel[]; children: ReactNode }) {
  // Màn rộng: menu đầy đủ ↔ thu gọn. Màn hẹp: menu trượt ra từ trái.
  // Ghi nhớ trang lúc mở menu: chuyển trang là menu tự đóng.
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (next: boolean) => setOpenAt(next ? pathname : null);

  return (
    <div className={`yt ${open ? "is-open" : ""}`}>
      <header className="yt-top">
        <button className="yt-iconbtn" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
          <Icon name="menu" />
        </button>
        <Link href="/" className="yt-logo">
          <span className="yt-logo__mark" aria-hidden="true">KN</span>
          <span className="yt-logo__name">{site.name}</span>
        </Link>
        <Suspense fallback={<SearchBox q="" />}>
          <SearchFromUrl />
        </Suspense>
        <CartButton />
      </header>
      <div className="yt-scrim" onClick={() => setOpen(false)} aria-hidden="true" />
      <nav className="yt-side" aria-label="Menu chính">
        <ul className="yt-side__group">
          {NAV.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <li key={n.href}>
                <Link href={n.href} className="yt-side__item" aria-current={active ? "page" : undefined}>
                  <Icon name={n.icon} filled={active} />
                  <span>{n.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Subscriptions channels={channels} pathname={pathname} />
        <p className="yt-side__foot">{site.name} — {site.tagline}</p>
      </nav>
      <main className="yt-main">{children}</main>
    </div>
  );
}

function SearchFromUrl() {
  return <SearchBox q={useSearchParams().get("q") ?? ""} />;
}

function SearchBox({ q }: { q: string }) {
  const router = useRouter();
  return (
    <form
      className="yt-search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const value = String(new FormData(e.currentTarget).get("q") ?? "").trim();
        router.push(value ? `/?q=${encodeURIComponent(value)}` : "/");
      }}
    >
      <input key={q} name="q" defaultValue={q} placeholder="Tìm mẫu hoa, kênh…" aria-label="Tìm kiếm" />
      <button aria-label="Tìm">
        <Icon name="search" />
      </button>
    </form>
  );
}

function CartButton() {
  const count = cartCount(useCart());
  return (
    <Link href="/gio-hang" className="yt-iconbtn yt-cart" aria-label={`Giỏ hàng, ${count} món`}>
      <Icon name="cart" />
      {count > 0 && <span className="yt-cart__badge">{count > 99 ? "99+" : count}</span>}
    </Link>
  );
}

function Subscriptions({ channels, pathname }: { channels: Channel[]; pathname: string }) {
  const subs = useSubscriptions();
  const list = subs.map((id) => channels.find((c) => c.id === id)).filter((c) => c !== undefined);
  return (
    <div className="yt-side__group">
      <Link href="/kenh" className="yt-side__title">
        Kênh đăng ký <Icon name="chevron" />
      </Link>
      {list.length ? (
        <ul>
          {list.map((c) => (
            <li key={c.id}>
              <Link href={`/kenh/${c.id}`} className="yt-side__item" aria-current={pathname === `/kenh/${c.id}` ? "page" : undefined}>
                <ChannelAvatar channel={c} size={24} />
                <span>{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Link href="/kenh" className="yt-side__item yt-side__item--muted">
          <span>Chưa đăng ký kênh nào</span>
        </Link>
      )}
    </div>
  );
}
