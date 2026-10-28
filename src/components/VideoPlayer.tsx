import { parseVideo } from "@/lib/video";
import { FlowerArt } from "./ProductMedia";

// Nhúng video TikTok / YouTube; link chưa có hoặc không đọc được thì hiện hình minh hoạ.
export function VideoPlayer({ url, title }: { url?: string; title: string }) {
  const video = parseVideo(url);

  if (!video) {
    return (
      <div className="kn-media kn-media--video site-video site-video--vertical">
        <FlowerArt />
        <div className="kn-media__badges">
          <span className="kn-tag kn-tag--topic">Video sắp có</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`site-video${video.vertical ? " site-video--vertical" : ""}`}>
      <iframe
        src={video.embedUrl}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
