"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteChannelAction, saveChannelAction } from "@/app/admin/actions";
import { channelColors, type Channel } from "@/lib/channels";
import { ChannelAvatar } from "../yt/ChannelAvatar";

const BLANK: Channel = { id: "", name: "", handle: "", description: "", color: "violet" };

/** Danh sách kênh: sửa tại chỗ, thêm kênh mới ở cuối. */
export function ChannelsAdmin({ channels, counts }: { channels: Channel[]; counts: Record<string, number> }) {
  return (
    <div className="ad-chgrid">
      {channels.map((c) => (
        <ChannelForm key={c.id} initial={c} count={counts[c.id] ?? 0} />
      ))}
      <ChannelForm key={`new-${channels.length}`} initial={BLANK} isNew />
    </div>
  );
}

function ChannelForm({ initial, isNew, count = 0 }: { initial: Channel; isNew?: boolean; count?: number }) {
  const router = useRouter();
  const [c, setC] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const set = <K extends keyof Channel>(k: K, v: Channel[K]) => { setC((x) => ({ ...x, [k]: v })); setMsg(null); };

  async function save() {
    setBusy(true);
    const r = await saveChannelAction({ ...c, isNew });
    setBusy(false);
    if (!r.ok) return setMsg({ ok: false, text: r.error });
    setMsg({ ok: true, text: "Đã lưu" });
    if (isNew) setC(BLANK);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Xoá kênh “${initial.name}”?`)) return;
    setBusy(true);
    const r = await deleteChannelAction(initial.id);
    setBusy(false);
    if (!r.ok) return setMsg({ ok: false, text: r.error ?? "Không xoá được" });
    router.refresh();
  }

  return (
    <section className="ad-card">
      <div className="ad-card__h">
        <h2 className="ad-chtitle">
          <ChannelAvatar channel={c.name ? c : { name: "+", color: c.color }} size={40} />
          {isNew ? "Thêm kênh" : initial.name}
        </h2>
        {!isNew && <Link href={`/kenh/${initial.id}`} target="_blank" className="ad-link">{count} bài ↗</Link>}
      </div>
      <div className="ad-card__b">
        <div className="ad-grid2">
          <label className="ad-field"><span>Tên kênh</span>
            <input className="ad-input" value={c.name} onChange={(e) => set("name", e.target.value)} maxLength={60} />
          </label>
          <label className="ad-field"><span>@ tên gọi</span>
            <input className="ad-input" value={c.handle} onChange={(e) => set("handle", e.target.value)} placeholder="tự tạo theo tên" maxLength={40} />
          </label>
        </div>
        <label className="ad-field"><span>Giới thiệu</span>
          <textarea className="ad-input" rows={2} value={c.description} onChange={(e) => set("description", e.target.value)} maxLength={300} />
        </label>
        <div className="ad-field">
          <span>Màu</span>
          <span className="ad-seg">
            {channelColors.map((col) => (
              <button key={col} type="button" aria-pressed={c.color === col} aria-label={col} onClick={() => set("color", col)}>
                <span className={`yt-avatar yt-avatar--${col}`} style={{ width: 20, height: 20 }} />
              </button>
            ))}
          </span>
        </div>
        {msg && <p className={msg.ok ? "ad-ok" : "ad-error"}>{msg.text}</p>}
        <div className="ad-acts">
          <button className="kn-btn kn-btn--primary kn-btn--sm" onClick={save} disabled={busy}>{isNew ? "Thêm kênh" : "Lưu"}</button>
          {!isNew && <button className="ad-link ad-link--danger" onClick={remove} disabled={busy}>Xoá</button>}
        </div>
      </div>
    </section>
  );
}
