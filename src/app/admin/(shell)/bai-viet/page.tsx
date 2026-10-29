import type { Metadata } from "next";
import Link from "next/link";
import { levelLabel, slugify, type TutorialStatus } from "@/lib/tutorials";
import { listAllTutorials } from "@/lib/tutorials-data";
import { parseVideo } from "@/lib/video";

export const metadata: Metadata = { title: "Bài hướng dẫn" };

const TABS: { key: TutorialStatus | ""; label: string }[] = [
  { key: "", label: "Tất cả" },
  { key: "published", label: "Đã đăng" },
  { key: "draft", label: "Nháp" },
];

const date = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "—";

export default async function AdminTutorialsPage({ searchParams }: PageProps<"/admin/bai-viet">) {
  const sp = await searchParams;
  const tab = TABS.find((t) => t.key === sp.tt)?.key ?? "";
  const q = String(sp.q ?? "").slice(0, 60).trim();
  const terms = slugify(q).split("-").filter(Boolean);

  const all = await listAllTutorials();
  const found = all.filter((t) => terms.every((w) => slugify(`${t.title} ${t.flowerName}`).includes(w)));
  const rows = found.filter((t) => !tab || t.status === tab);
  const count = (k: TutorialStatus | "") => found.filter((t) => !k || t.status === k).length;
  const link = (tt: string) => {
    const u = new URLSearchParams(Object.entries({ tt, q }).filter(([, v]) => v));
    return `/admin/bai-viet${u.size ? `?${u}` : ""}`;
  };

  return (
    <>
      <div className="ad-title">
        <h1 className="text-h2">Bài hướng dẫn</h1>
        <span className="ad-acts">
          <Link href="/" target="_blank" className="kn-btn kn-btn--ghost kn-btn--sm">Xem trên web</Link>
          <Link href="/admin/bai-viet/moi" className="kn-btn kn-btn--primary kn-btn--sm">+ Viết bài</Link>
        </span>
      </div>
      <div className="ad-card">
        <div className="ad-tabs">
          {TABS.map((t) => (
            <Link key={t.key} href={link(t.key)} aria-current={tab === t.key ? "true" : undefined}>
              {t.label} <small>{count(t.key)}</small>
            </Link>
          ))}
        </div>
        <form className="ad-filters" action="/admin/bai-viet">
          {tab && <input type="hidden" name="tt" value={tab} />}
          <input className="ad-input" name="q" defaultValue={q} placeholder="Tìm theo tiêu đề, tên bông" aria-label="Tìm bài" />
          <button className="kn-btn kn-btn--ghost kn-btn--sm">Tìm</button>
        </form>
        <ul className="ad-list">
          {rows.map((t) => {
            const thumb = t.thumbnailUrl ?? parseVideo(t.videoUrl)?.thumbnailUrl;
            return (
              <li key={t.id}>
                <Link href={`/admin/bai-viet/${t.id}`} className="ad-row">
                  <span className="ad-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {thumb ? <img src={thumb} alt="" referrerPolicy="no-referrer" /> : <span aria-hidden>🌷</span>}
                  </span>
                  <span className="ad-row__main">
                    <b>{t.title || "(Chưa có tiêu đề)"}</b>
                    <small>
                      /huong-dan/{t.slug} · {levelLabel(t.level)} · {t.steps.length} bước · {t.materials.length} nguyên liệu
                      {!parseVideo(t.videoUrl) && " · chưa có video"}
                    </small>
                  </span>
                  <span className="ad-row__side">
                    <span className={`ad-pill ad-pill--${t.status}`}>{t.status === "published" ? "Đã đăng" : "Nháp"}</span>
                    <small>Sửa {date(t.updatedAt)}</small>
                  </span>
                </Link>
              </li>
            );
          })}
          {!rows.length && (
            <li className="ad-empty">
              {all.length ? "Không có bài nào khớp." : <>Chưa có bài nào. <Link href="/admin/bai-viet/moi">Viết bài đầu tiên</Link></>}
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
