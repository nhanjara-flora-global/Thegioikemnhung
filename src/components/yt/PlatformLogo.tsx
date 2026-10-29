import { siFacebook, siInstagram, siTiktok, siYoutube, siYoutubeshorts } from "simple-icons";
import type { Platform } from "@/lib/video";

// Logo gốc của TikTok / YouTube (bộ simple-icons, đúng hình và màu thương hiệu) — không tự vẽ.
const ICONS = { tiktok: siTiktok, youtube: siYoutube, shorts: siYoutubeshorts, instagram: siInstagram, facebook: siFacebook } as const;

export function PlatformLogo({ platform, size = 16 }: { platform: Platform; size?: number }) {
  const icon = ICONS[platform];
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} role="img" aria-label={icon.title} style={{ flex: "none" }}>
      <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
  );
}

/** Nhãn nền trắng đặt ở góc ảnh bìa: logo + tên nền tảng. */
export function PlatformBadge({ platform, compact }: { platform: Platform; compact?: boolean }) {
  return (
    <span className="yt-platform">
      <PlatformLogo platform={platform} size={14} />
      {!compact && <span>{ICONS[platform].title}</span>}
    </span>
  );
}
