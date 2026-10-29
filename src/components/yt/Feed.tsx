"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Channel } from "@/lib/channels";
import { isShort, levels, slugify, type Level, type Tutorial } from "@/lib/tutorials";
import { parseVideo, SHORT_PLATFORMS } from "@/lib/video";
import { PlatformLogo } from "./PlatformLogo";
import { ShortCard, VideoCard } from "./VideoCards";

type Chip = "all" | "shorts" | "videos" | Level;

const CHIPS: { id: Chip; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "shorts", label: "Shorts" },
  { id: "videos", label: "Video" },
  ...levels,
];

type Props = { tutorials: Tutorial[]; channels: Channel[]; hideChannel?: boolean; empty?: string };

/** Trang chủ đọc ô tìm kiếm từ ?q=. */
export function SearchFeed(props: Props) {
  return <Feed {...props} q={useSearchParams().get("q") ?? ""} />;
}

// Như YouTube: một hàng video, rồi kệ Shorts, rồi phần còn lại.
const FIRST_ROW = 3;

/** Lưới bài kiểu YouTube: hàng chip lọc, video ngang, kệ Shorts chen giữa. */
export function Feed({ tutorials, channels, hideChannel, empty = "Chưa có bài nào.", q = "" }: Props & { q?: string }) {
  const [chip, setChip] = useState<Chip>("all");
  const byId = new Map(channels.map((c) => [c.id, c]));
  const terms = slugify(q).split("-").filter(Boolean);

  const found = tutorials.filter((t) => {
    if (chip !== "all" && chip !== "shorts" && chip !== "videos" && t.level !== chip) return false;
    const text = slugify(`${t.title} ${t.flowerName} ${byId.get(t.channel)?.name ?? ""}`);
    return terms.every((w) => text.includes(w));
  });
  const shorts = chip === "videos" ? [] : found.filter(isShort);
  const videos = chip === "shorts" ? [] : found.filter((t) => !isShort(t));
  // Mỗi nền tảng (TikTok, YouTube Shorts, Reels…) một kệ riêng, không gộp chung.
  const shelves = SHORT_PLATFORMS.map((p) => ({ ...p, items: shorts.filter((t) => parseVideo(t.videoUrl)?.platform === p.id) }))
    .filter((p) => p.items.length);
  const card = (t: Tutorial) => <VideoCard key={t.slug} tutorial={t} channel={byId.get(t.channel)} hideChannel={hideChannel} />;
  const none = chip === "shorts" ? !shorts.length : !videos.length && !shorts.length;

  return (
    <div className="yt-feed">
      <div className="yt-chips" role="group" aria-label="Lọc">
        {CHIPS.map((c) => (
          <button key={c.id} aria-pressed={chip === c.id} onClick={() => setChip(c.id)}>{c.label}</button>
        ))}
      </div>
      {q && <p className="yt-card__meta">Kết quả cho “{q}”: {found.length} bài</p>}
      {none && <p className="yt-empty">{q ? "Không tìm thấy bài nào." : empty}</p>}
      {chip === "shorts" ? (
        shelves.map(({ id, label, items }) => (
          <section key={id} className="yt-page">
            <h2 className="yt-shelf__title"><PlatformLogo platform={id} size={24} /> {label}</h2>
            <div className="yt-shorts-grid">{items.map((t) => <ShortCard key={t.slug} tutorial={t} />)}</div>
          </section>
        ))
      ) : (
        <>
          {videos.length > 0 && <div className="yt-grid">{videos.slice(0, FIRST_ROW).map(card)}</div>}
          {shelves.map(({ id, label, items }) => (
            <section key={id} className="yt-shelf">
              <h2 className="yt-shelf__title"><PlatformLogo platform={id} size={24} /> {label}</h2>
              <div className="yt-shelf__row">{items.map((t) => <ShortCard key={t.slug} tutorial={t} />)}</div>
            </section>
          ))}
          {videos.length > FIRST_ROW && <div className="yt-grid">{videos.slice(FIRST_ROW).map(card)}</div>}
        </>
      )}
    </div>
  );
}
