// Đổi link TikTok / YouTube mà shop dán vào thành link nhúng.

export type VideoEmbed = {
  embedUrl: string;
  /** Video dọc (TikTok, YouTube Shorts) hay ngang. */
  vertical: boolean;
  /** Ảnh bìa tự lấy được (chỉ YouTube). */
  thumbnailUrl?: string;
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
    return id ? { embedUrl: `https://www.tiktok.com/player/v1/${id}`, vertical: true } : null;
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
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    vertical,
    thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}
