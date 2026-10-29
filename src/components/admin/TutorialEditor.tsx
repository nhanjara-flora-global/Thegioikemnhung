"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { deleteTutorialAction, saveTutorialAction, type SaveInput } from "@/app/admin/actions";
import { formatPrice, type Product } from "@/lib/catalog";
import { levels, slugify, tutorialChecks, type MaterialSpec, type StoredTutorial, type TutorialStatus } from "@/lib/tutorials";
import { parseVideo } from "@/lib/video";

export type EditorProduct = Pick<Product, "slug" | "name" | "spec" | "sellUnit" | "pack" | "color" | "inStock" | "price">;
type Draft = Omit<StoredTutorial, "id"> & { id?: string };
type Tip = { afterStep: number; text: string };

const fmt = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" })
    : "";

function Card({ title, right, children }: { title: ReactNode; right?: ReactNode; children: ReactNode }) {
  return (
    <section className="ad-card">
      <div className="ad-card__h">
        <h2>{title}</h2>
        {right}
      </div>
      <div className="ad-card__b">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="ad-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

/** Nút lên / xuống / xoá cho một dòng trong danh sách. */
function RowTools({ i, n, onMove, onRemove }: { i: number; n: number; onMove: (d: -1 | 1) => void; onRemove: () => void }) {
  return (
    <span className="ad-tools">
      <button type="button" onClick={() => onMove(-1)} disabled={i === 0} aria-label="Đưa lên">↑</button>
      <button type="button" onClick={() => onMove(1)} disabled={i === n - 1} aria-label="Đưa xuống">↓</button>
      <button type="button" onClick={onRemove} aria-label="Xoá" className="ad-tools__x">✕</button>
    </span>
  );
}

const swap = <T,>(xs: T[], i: number, d: -1 | 1) => {
  const a = [...xs];
  [a[i], a[i + d]] = [a[i + d], a[i]];
  return a;
};

/** Trình soạn bài hướng dẫn: thông tin, video, bước làm + mẹo, nguyên liệu, kiểm tra trước khi đăng. */
export function TutorialEditor({ initial, products, channels }: { initial: Draft; products: EditorProduct[]; channels: { id: string; name: string }[] }) {
  const router = useRouter();
  const [v, setV] = useState<Draft>(initial);
  // Đường dẫn tự theo tiêu đề cho tới khi shop tự sửa (bài mới), hoặc giữ nguyên (bài cũ).
  const [autoSlug, setAutoSlug] = useState(!initial.id);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [pick, setPick] = useState("");
  const saveRef = useRef<(s: TutorialStatus) => void>(() => {});

  const video = parseVideo(v.videoUrl);
  const checks = tutorialChecks(v, Boolean(video));
  const blocking = checks.filter((c) => c.required && !c.ok);
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const tips = v.tips ?? [];

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Ctrl/⌘ + S = lưu, giữ nguyên trạng thái hiện tại.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current(v.status);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [v.status]);

  const set = <K extends keyof Draft>(k: K, val: Draft[K]) => {
    setV((x) => ({ ...x, [k]: val }));
    setDirty(true);
    setMsg("");
  };
  const setTitle = (title: string) => {
    setV((x) => ({ ...x, title, slug: autoSlug ? slugify(title) : x.slug }));
    setDirty(true);
    setMsg("");
  };

  // Bước làm: xoá / đổi chỗ bước thì mẹo đi theo bước.
  const setSteps = (steps: string[], remap: (n: number) => number | null = (n) => n) => {
    const nextTips = tips.flatMap((t) => {
      const n = remap(t.afterStep);
      return n ? [{ ...t, afterStep: n }] : [];
    });
    setV((x) => ({ ...x, steps, tips: nextTips }));
    setDirty(true);
    setMsg("");
  };
  const moveStep = (i: number, d: -1 | 1) =>
    setSteps(swap(v.steps, i, d), (n) => (n === i + 1 ? i + 1 + d : n === i + 1 + d ? i + 1 : n));
  const removeStep = (i: number) =>
    setSteps(v.steps.filter((_, j) => j !== i), (n) => (n === i + 1 ? null : n > i + 1 ? n - 1 : n));
  const setTips = (next: Tip[]) => set("tips", next);

  const setMaterials = (m: MaterialSpec[]) => set("materials", m);
  const addMaterial = (slug: string) => {
    const p = bySlug.get(slug);
    if (!p || v.materials.some((m) => m.product === slug)) return;
    // Món bán theo bó nhiều sợi (kẽm, nhị) thường tính theo số bông; dụng cụ / phụ kiện tính cả bó.
    setMaterials([...v.materials, p.pack ? { product: slug, perFlower: 1 } : { product: slug, fixed: 1 }]);
    setPick("");
  };
  const patchMaterial = (i: number, m: MaterialSpec) => setMaterials(v.materials.map((x, j) => (j === i ? m : x)));

  async function save(status: TutorialStatus) {
    if (busy) return;
    if (status === "published" && blocking.length) {
      setError(`Chưa đăng được: ${blocking.map((c) => c.label).join("; ")}`);
      return;
    }
    setBusy(status);
    setError("");
    const r = await saveTutorialAction({ ...v, status } as SaveInput);
    setBusy("");
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setV((x) => ({ ...x, id: r.id, status, updatedAt: r.updatedAt, publishedAt: r.publishedAt }));
    setDirty(false);
    setAutoSlug(false);
    setMsg(status === "published" ? (v.status === "published" ? "Đã cập nhật bài trên web" : "Đã đăng bài") : v.status === "published" ? "Đã gỡ bài khỏi web, chuyển về nháp" : "Đã lưu nháp");
    if (!v.id) router.replace(`/admin/bai-viet/${r.id}`);
    else router.refresh();
  }
  useEffect(() => {
    saveRef.current = save;
  });

  async function remove() {
    if (!v.id || !confirm(`Xoá hẳn bài “${v.title}”? Không lấy lại được.`)) return;
    setDirty(false);
    setBusy("delete");
    await deleteTutorialAction(v.id);
  }

  const published = v.status === "published";
  const unused = products.filter((p) => !v.materials.some((m) => m.product === p.slug));

  return (
    <div className="ad-editor">
      <div className="ad-title ad-editor__title">
        <div>
          <Link href="/admin/bai-viet" className="ad-back">← Bài hướng dẫn</Link>
          <h1 className="text-h2">{v.id ? v.title || "(Chưa có tiêu đề)" : "Viết bài mới"}</h1>
        </div>
        <span className="ad-acts">
          {published && v.id && (
            <Link href={`/huong-dan/${v.slug}`} target="_blank" className="kn-btn kn-btn--ghost kn-btn--sm">Xem trên web</Link>
          )}
        </span>
      </div>

      <div className="ad-editor__grid">
        <div className="ad-editor__main">
          <Card title="Thông tin bài">
            <Field label="Tiêu đề">
              <input className="ad-input ad-input--lg" value={v.title} onChange={(e) => setTitle(e.target.value)} placeholder="Bó tulip hồng phấn cho người mới" maxLength={120} />
            </Field>
            <Field label="Đường dẫn" hint={`thegioikemnhung…/huong-dan/${v.slug || "…"}`}>
              <input
                className="ad-input"
                value={v.slug}
                onChange={(e) => { setAutoSlug(false); set("slug", slugify(e.target.value)); }}
                onBlur={(e) => !e.target.value && setAutoSlug(true)}
              />
            </Field>
            <div className="ad-grid2">
              <Field label="Kênh đăng">
                <select className="ad-input" value={v.channel} onChange={(e) => set("channel", e.target.value)}>
                  {channels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Tên bông" hint="Dùng trong nút: Mua nguyên liệu làm …">
                <input className="ad-input" value={v.flowerName} onChange={(e) => set("flowerName", e.target.value)} placeholder="tulip hồng phấn" maxLength={60} />
              </Field>
              <Field label="Độ khó">
                <span className="ad-seg">
                  {levels.map((l) => (
                    <button key={l.id} type="button" aria-pressed={v.level === l.id} onClick={() => set("level", l.id)}>{l.label}</button>
                  ))}
                </span>
              </Field>
              <Field label="Thời gian làm">
                <input className="ad-input" value={v.makeTime} onChange={(e) => set("makeTime", e.target.value)} placeholder="30 phút" maxLength={40} />
              </Field>
              <Field label="Số bông của bó mẫu" hint="Khách chỉnh được khi mua nguyên liệu">
                <input className="ad-input" type="number" min={1} max={99} value={v.defaultFlowers} onChange={(e) => set("defaultFlowers", Number(e.target.value))} />
              </Field>
            </div>
            <Field label="Giới thiệu ngắn" hint="Hiện dưới video">
              <textarea className="ad-input" rows={3} value={v.summary} onChange={(e) => set("summary", e.target.value)} maxLength={600} />
            </Field>
          </Card>

          <Card title="Video">
            <Field label="Link video" hint="TikTok, YouTube, YouTube Shorts, Instagram Reels, Facebook Reels">
              <input className="ad-input" value={v.videoUrl ?? ""} onChange={(e) => set("videoUrl", e.target.value)} placeholder="https://www.tiktok.com/@…/video/…" inputMode="url" />
            </Field>
            {v.videoUrl && !video && <p className="ad-error">Không đọc được link này — nhận TikTok, YouTube, Instagram, Facebook.</p>}
            {video && (
              <div className={`ad-video ${video.vertical ? "ad-video--v" : ""}`}>
                <iframe src={video.embedUrl} title="Xem trước video" allow="encrypted-media; picture-in-picture" allowFullScreen />
              </div>
            )}
            <div className="ad-grid2">
              <Field label="Độ dài video" hint="vd 1:12">
                <input className="ad-input" value={v.duration ?? ""} onChange={(e) => set("duration", e.target.value)} maxLength={10} />
              </Field>
              <Field label="Link ảnh bìa" hint={video?.thumbnailUrl ? "YouTube tự lấy ảnh bìa — để trống cũng được" : "Nên có cho video TikTok"}>
                <input className="ad-input" value={v.thumbnailUrl ?? ""} onChange={(e) => set("thumbnailUrl", e.target.value)} inputMode="url" />
              </Field>
            </div>
          </Card>

          <Card title={`Các bước làm (${v.steps.filter((s) => s.trim()).length})`}>
            <ol className="ad-steps">
              {v.steps.map((s, i) => (
                <li key={i}>
                  <div className="ad-step">
                    <span className="ad-step__n">{i + 1}</span>
                    <textarea className="ad-input" rows={2} value={s} onChange={(e) => setSteps(v.steps.map((x, j) => (j === i ? e.target.value : x)))} placeholder="Mô tả bước này" />
                    <RowTools i={i} n={v.steps.length} onMove={(d) => moveStep(i, d)} onRemove={() => removeStep(i)} />
                  </div>
                  {tips.map((t, ti) => t.afterStep === i + 1 && (
                    <div key={ti} className="ad-tip">
                      <span className="kn-tip__label">Mẹo nhỏ</span>
                      <input className="ad-input" value={t.text} onChange={(e) => setTips(tips.map((x, j) => (j === ti ? { ...x, text: e.target.value } : x)))} placeholder="Mẹo cho bước này" maxLength={300} />
                      <button type="button" className="ad-tools__x" onClick={() => setTips(tips.filter((_, j) => j !== ti))} aria-label="Xoá mẹo">✕</button>
                    </div>
                  ))}
                  {tips.length < 3 && !tips.some((t) => t.afterStep === i + 1) && (
                    <button type="button" className="ad-link ad-addtip" onClick={() => setTips([...tips, { afterStep: i + 1, text: "" }])}>+ Mẹo sau bước {i + 1}</button>
                  )}
                </li>
              ))}
            </ol>
            <button type="button" className="kn-btn kn-btn--soft kn-btn--sm" onClick={() => setSteps([...v.steps, ""])}>+ Thêm bước</button>
            <small className="kn-muted"> Tối đa 3 mẹo mỗi bài ({tips.length}/3)</small>
          </Card>

          <Card title={`Nguyên liệu (${v.materials.length})`}>
            <ul className="ad-mats">
              {v.materials.map((m, i) => {
                const p = bySlug.get(m.product);
                const per = "perFlower" in m;
                return (
                  <li key={m.product} className="ad-mat">
                    <span className="ad-mat__dot" style={{ background: p?.color ?? "var(--paper-200)" }} />
                    <span className="ad-mat__name">
                      <b>{p?.name ?? m.product}</b>
                      <small>{p ? `${p.spec} · ${formatPrice(p.price)}` : "Sản phẩm không còn"}{p && !p.inStock && " · hết hàng"}</small>
                    </span>
                    <span className="ad-mat__qty">
                      <select className="ad-input" value={per ? "per" : "fixed"} aria-label="Cách tính"
                        onChange={(e) => patchMaterial(i, e.target.value === "per" ? { product: m.product, note: m.note, perFlower: 1 } : { product: m.product, note: m.note, fixed: 1 })}>
                        {p?.pack && <option value="per">{p.pack.unit} mỗi bông</option>}
                        <option value="fixed">{p?.sellUnit ?? "cái"} cho cả bó</option>
                      </select>
                      <input className="ad-input ad-input--num" type="number" min={1} max={99} aria-label="Số lượng"
                        value={per ? m.perFlower : m.fixed}
                        onChange={(e) => patchMaterial(i, per ? { ...m, perFlower: Number(e.target.value) } : { ...m, fixed: Number(e.target.value) })} />
                    </span>
                    <input className="ad-input ad-mat__note" value={m.note ?? ""} placeholder="Ghi chú: Làm cánh…" maxLength={120}
                      onChange={(e) => patchMaterial(i, { ...m, note: e.target.value })} />
                    <RowTools i={i} n={v.materials.length} onMove={(d) => setMaterials(swap(v.materials, i, d))} onRemove={() => setMaterials(v.materials.filter((_, j) => j !== i))} />
                  </li>
                );
              })}
            </ul>
            {unused.length > 0 && (
              <select className="ad-input" value={pick} onChange={(e) => addMaterial(e.target.value)} aria-label="Thêm nguyên liệu">
                <option value="">+ Thêm nguyên liệu từ cửa hàng…</option>
                {unused.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.name} — {formatPrice(p.price)}{p.inStock ? "" : " (hết hàng)"}</option>
                ))}
              </select>
            )}
          </Card>
        </div>

        <aside className="ad-editor__side">
          <Card title="Đăng bài" right={<span className={`ad-pill ad-pill--${v.status}`}>{published ? "Đã đăng" : "Nháp"}</span>}>
            {v.updatedAt && (
              <p className="kn-muted kn-caption">
                Sửa lần cuối {fmt(v.updatedAt)}
                {v.publishedAt && <><br />Đăng ngày {fmt(v.publishedAt)}</>}
              </p>
            )}
            <ul className="ad-checks">
              {checks.map((c) => (
                <li key={c.label} className={c.ok ? "is-ok" : c.required ? "is-bad" : "is-warn"}>
                  <span aria-hidden>{c.ok ? "✓" : "!"}</span>
                  {c.label}
                </li>
              ))}
            </ul>
            {error && <p className="ad-error" role="alert">{error}</p>}
            {msg && <p className="ad-ok" role="status">{msg}</p>}
            <div className="ad-publish">
              <button type="button" className="kn-btn kn-btn--primary kn-btn--block" onClick={() => save("published")} disabled={Boolean(busy) || blocking.length > 0}>
                {busy === "published" ? "Đang lưu…" : published ? "Cập nhật bài" : "Đăng bài"}
              </button>
              <button type="button" className="kn-btn kn-btn--ghost kn-btn--block" onClick={() => save("draft")} disabled={Boolean(busy)}>
                {busy === "draft" ? "Đang lưu…" : published ? "Gỡ khỏi web (về nháp)" : "Lưu nháp"}
              </button>
            </div>
            <small className="kn-muted">{dirty ? "Có thay đổi chưa lưu · " : ""}Ctrl + S để lưu nhanh</small>
            {v.id && (
              <button type="button" className="ad-link ad-link--danger" onClick={remove} disabled={Boolean(busy)}>Xoá bài</button>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
