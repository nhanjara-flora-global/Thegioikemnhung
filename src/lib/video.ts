// Đổi link video (TikTok, YouTube, Instagram, Facebook) mà shop dán vào thành link nhúng.

export type Platform = "tiktok" | "youtube" | "shorts" | "instagram" | "facebook";

/** Các nền tảng video dọc, theo thứ tự kệ hiện trên trang chủ. Mỗi nền tảng một kệ riêng. */
export const SHORT_PLATFORMS: { id: Platform; label: string }[] = [
  { id: "tiktok", label: "TikTok" },
  { id: "shorts", label: "YouTube Shorts" },
  { id: "instagram", label: "Instagram Reels" },
  { id: "facebook", label: "Facebook Reels" },
];

export type VideoEmbed = {
  platform: Platform;
  embedUrl: string;
  /** Video dọc (TikTok, YouTube Shorts) hay ngang. */
  vertical: boolean;
  /** Ảnh bìa tự lấy được (chỉ YouTube). */
  thumbnailUrl?: string;
  /** Link phát xem trước khi rê chuột: tự chạy, tắt tiếng, không nút. Instagram / Facebook không hỗ trợ. */
  previewUrl?: string;
  /** Link phát ở trang chi tiết: tự chạy, có tiếng (trình duyệt chặn thì khách bấm play). */
  playUrl: string;
};

export function parseVideo(url: string | undefined): VideoEmbed | null {
  if (!url) return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www|m)\./, "");

  // https://www.tiktok.com/@ten/video/7300000000000000000
  if (host === "tiktok.com") {
    const id = u.pathname.match(/\/video\/(\d+)/)?.[1];
    return id ? {
      platform: "tiktok",
      embedUrl: `https://www.tiktok.com/player/v1/${id}`,
      vertical: true,
      previewUrl: `https://www.tiktok.com/player/v1/${id}?autoplay=1&muted=1&controls=0&loop=1&progress_bar=0&play_button=0&volume_control=0&fullscreen_button=0&timestamp=0&music_info=0&description=0&rel=0`,
      playUrl: `https://www.tiktok.com/player/v1/${id}?autoplay=1`,
    } : null;
  }

  // https://www.instagram.com/reel/ABC123/ (hoặc /p/ABC123/)
  if (host === "instagram.com") {
    const id = u.pathname.match(/^\/(?:reels?|p)\/([\w-]+)/)?.[1];
    const embedUrl = `https://www.instagram.com/reel/${id}/embed`;
    return id ? { platform: "instagram", embedUrl, playUrl: embedUrl, vertical: true } : null;
  }

  // https://www.facebook.com/reel/1234567890 · fb.watch/… (Facebook tự nhận link qua plugin)
  if (host === "facebook.com" || host === "fb.watch") {
    if (host === "facebook.com" && !/^\/(reel|watch|[^/]+\/videos)\b/.test(u.pathname)) return null;
    const vertical = host === "fb.watch" || u.pathname.startsWith("/reel");
    const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u.href)}&show_text=false`;
    return { platform: "facebook", embedUrl, playUrl: `${embedUrl}&autoplay=true`, vertical };
  }

  // youtu.be/ID · youtube.com/watch?v=ID · youtube.com/shorts/ID · youtube.com/embed/ID
  let id: string | null | undefined;
  let vertical = false;
  if (host === "youtu.be") {
    id = u.pathname.slice(1);
  } else if (host === "youtube.com") {
    const shorts = u.pathname.match(/^\/shorts\/([\w-]+)/)?.[1];
    vertical = Boolean(shorts);
    id = shorts ?? u.pathname.match(/^\/embed\/([\w-]+)/)?.[1] ?? u.searchParams.get("v");
  }
  if (!id || !/^[\w-]{6,}$/.test(id)) return null;
  return {
    platform: vertical ? "shorts" : "youtube",
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    vertical,
    thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    previewUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3`,
    playUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`,
  };
}
