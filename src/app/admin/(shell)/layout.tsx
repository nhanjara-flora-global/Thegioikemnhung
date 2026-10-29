import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { site } from "@/lib/site";
import { logoutAction } from "../actions";

export default async function AdminShell({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  return (
    <>
      <header className="ad-top">
        <div className="ad-wrap ad-top__inner">
          <Link href="/admin/bai-viet" className="ad-top__logo">
            {site.name} <small>Quản trị</small>
          </Link>
          <nav className="ad-top__nav">
            <Link href="/admin/bai-viet">Bài hướng dẫn</Link>
            <Link href="/admin/kenh">Kênh</Link>
            <Link href="/" target="_blank">Xem web</Link>
            <form action={logoutAction}>
              <button className="ad-link">Đăng xuất</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="ad-wrap ad-main">{children}</main>
    </>
  );
}
