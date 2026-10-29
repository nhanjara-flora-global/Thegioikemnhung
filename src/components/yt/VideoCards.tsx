import Link from "next/link";
import type { Channel } from "@/lib/channels";
import { levelLabel, type Tutorial } from "@/lib/tutorials";
import { parseVideo } from "@/lib/video";
import { FlowerArt } from "../ProductMedia";
import { ChannelAvatar } from "./ChannelAvatar";
import { HoverPreview } from "./HoverPreview";
import { PlatformBadge } from "./PlatformLogo";

const thumbOf = (t: Tutorial) => t.thumbnailUrl ?? parseVideo(t.videoUrl)?.thumbnailUrl;

function Thumb({ t }: { t: Tutorial }) {
  const src = thumbOf(t);
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <FlowerArt />;
}

/** Thẻ video ngang: ảnh 16:9, dưới là ảnh kênh + tiêu đề + tên kênh. */
export function VideoCard({ tutorial: t, channel, hideChannel }: { tutorial: Tutorial; channel?: Channel; hideChannel?: boolean }) {
  const href = `/huong-dan/${t.slug}`;
  const video = parseVideo(t.videoUrl);
  const platform = video?.platform;
  return (
    <article className="yt-card">
      <Link href={href} className="yt-thumb" aria-label={t.title}>
        <Thumb t={t} />
        {video?.previewUrl && <HoverPreview src={video.previewUrl} />}
        <span className={`kn-tag kn-tag--${t.level} yt-thumb__level`}>{levelLabel(t.level)}</span>
        {platform && <PlatformBadge platform={platform} />}
        {t.duration && <span className="yt-thumb__time">{t.duration}</span>}
      </Link>
      <div className="yt-card__info">
        {!hideChannel && (
          <Link href={`/kenh/${t.channel}`} aria-label={channel?.name}>
            <ChannelAvatar channel={channel} />
          </Link>
        )}
        <div className="yt-card__text">
          <h3 className="yt-card__title">
            <Link href={href}>{t.title}</Link>
          </h3>
          {!hideChannel && (
            <Link href={`/kenh/${t.channel}`} className="yt-card__meta yt-card__channel">{channel?.name ?? t.channel}</Link>
          )}
          <p className="yt-card__meta">{t.steps.length} bước · {t.makeTime || "—"}</p>
        </div>
      </div>
    </article>
  );
}

/** Thẻ Shorts: ảnh dọc 9:16, tiêu đề ngắn. */
export function ShortCard({ tutorial: t }: { tutorial: Tutorial }) {
  const video = parseVideo(t.videoUrl);
  const platform = video?.platform;
  return (
    <Link href={`/huong-dan/${t.slug}`} className="yt-short">
      <span className="yt-short__thumb">
        <Thumb t={t} />
        {video?.previewUrl && <HoverPreview src={video.previewUrl} />}
        {platform && <PlatformBadge platform={platform} compact />}
      </span>
      <span className="yt-card__title">{t.title}</span>
      <span className="yt-card__meta">{levelLabel(t.level)} · {t.makeTime || "—"}</span>
    </Link>
  );
}

/** Thẻ gọn ở cột phải trang chi tiết (như "video tiếp theo" của YouTube): ảnh nhỏ bên trái, chữ bên phải. */
export function CompactCard({ tutorial: t, channel }: { tutorial: Tutorial; channel?: Channel }) {
  const video = parseVideo(t.videoUrl);
  return (
    <Link href={`/huong-dan/${t.slug}`} className="yt-compact">
      <span className="yt-thumb yt-compact__thumb">
        <Thumb t={t} />
        {video && <PlatformBadge platform={video.platform} compact />}
        {t.duration && <span className="yt-thumb__time">{t.duration}</span>}
      </span>
      <span className="yt-card__text">
        <span className="yt-card__title">{t.title}</span>
        <span className="yt-card__meta">{channel?.name ?? t.channel}</span>
        <span className="yt-card__meta">{levelLabel(t.level)} · {t.makeTime || "—"}</span>
      </span>
    </Link>
  );
}
