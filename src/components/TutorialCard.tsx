import Link from "next/link";
import { levelLabel, type Tutorial } from "@/lib/tutorials";
import { parseVideo } from "@/lib/video";
import { FlowerArt } from "./ProductMedia";

// TutorialCard — xem document/design-system/pop/components/TutorialCard.md.
// Luôn kèm nút "Mua nguyên liệu làm …" dẫn tới danh sách vật liệu của bài.
export function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  const href = `/huong-dan/${tutorial.slug}`;
  const thumbnail = tutorial.thumbnailUrl ?? parseVideo(tutorial.videoUrl)?.thumbnailUrl;

  return (
    <article className="kn-card site-card">
      <div className="kn-media kn-media--video">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnail} alt="" loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <FlowerArt />
        )}
        <div className="kn-media__badges">
          <span className={`kn-tag kn-tag--${tutorial.level}`}>{levelLabel(tutorial.level)}</span>
        </div>
        <Link href={href} className="kn-play" aria-label={`Xem video: ${tutorial.title}`} />
        {tutorial.duration && <span className="kn-media__time">{tutorial.duration}</span>}
      </div>
      <div className="kn-card__body">
        <h3 className="kn-h3">
          <Link href={href}>{tutorial.title}</Link>
        </h3>
        <p className="kn-muted kn-caption">
          {tutorial.steps.length} bước · {tutorial.makeTime}
        </p>
        <Link href={`${href}#nguyen-lieu`} className="kn-btn kn-btn--primary kn-btn--sm kn-btn--block">
          Mua nguyên liệu làm {tutorial.flowerName}
        </Link>
      </div>
    </article>
  );
}
