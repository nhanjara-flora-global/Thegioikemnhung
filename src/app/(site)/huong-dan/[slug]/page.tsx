import type { Metadata } from "next";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { TutorialMaterials } from "@/components/TutorialMaterials";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ChannelAvatar } from "@/components/yt/ChannelAvatar";
import { LikeButton, SubscribeButton } from "@/components/yt/SubscribeButton";
import Link from "next/link";
import { getChannel, getChannels } from "@/lib/channels-data";
import { CompactCard } from "@/components/yt/VideoCards";
import { PlatformLogo } from "@/components/yt/PlatformLogo";
import { parseVideo, type Platform } from "@/lib/video";
import { levelLabel } from "@/lib/tutorials";
import { getMaterials, getTutorial, getTutorials } from "@/lib/tutorials-data";

const PLATFORM_NAMES: Record<Platform, string> = { tiktok: "TikTok", youtube: "YouTube", shorts: "YouTube", instagram: "Instagram", facebook: "Facebook" };

export async function generateStaticParams() {
  const tutorials = await getTutorials();
  return tutorials.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/huong-dan/[slug]">): Promise<Metadata> {
  const tutorial = await getTutorial((await params).slug);
  return { title: tutorial?.title, description: tutorial?.summary };
}

export default async function TutorialPage({ params }: PageProps<"/huong-dan/[slug]">) {
  const tutorial = await getTutorial((await params).slug);
  if (!tutorial) notFound();
  const video = parseVideo(tutorial.videoUrl);
  const [materials, channel] = await Promise.all([getMaterials(tutorial), getChannel(tutorial.channel)]);

  const related = (await getTutorials())
    .filter((t) => t.slug !== tutorial.slug)
    .sort((a, b) => Number(b.channel === tutorial.channel) - Number(a.channel === tutorial.channel))
    .slice(0, 10);
  const channels = await getChannels();
  const steps = tutorial.steps.length;

  return (
    <article className="yt-watch">
      <div className="yt-watch__main">
        <VideoPlayer url={tutorial.videoUrl} title={tutorial.title} />
        <h1 className="yt-watch__title">{tutorial.title}</h1>
        <div className="yt-watchbar">
          <Link href={`/kenh/${tutorial.channel}`} className="yt-watchbar__ch">
            <ChannelAvatar channel={channel} size={40} />
            <b>{channel?.name ?? tutorial.channel}</b>
          </Link>
          <SubscribeButton channel={tutorial.channel} />
          <span className="yt-watchbar__end">
            <LikeButton slug={tutorial.slug} />
            {video && (
              <a href={tutorial.videoUrl} target="_blank" rel="noopener noreferrer" className="yt-pillbtn">
                <PlatformLogo platform={video.platform} size={20} /> Xem trên {PLATFORM_NAMES[video.platform]}
              </a>
            )}
          </span>
        </div>
        <div className="yt-desc">
          <p className="yt-desc__meta">
            <span className={`kn-tag kn-tag--${tutorial.level}`}>{levelLabel(tutorial.level)}</span>
            {steps} bước · {tutorial.makeTime}
          </p>
          {tutorial.summary && <p>{tutorial.summary}</p>}
        </div>
      </div>

      <aside className="yt-watch__side">
        <TutorialMaterials materials={materials} flowerName={tutorial.flowerName} defaultFlowers={tutorial.defaultFlowers} />
      </aside>

      <section className="yt-watch__steps">
        <h2 className="yt-watch__h2">Các bước làm</h2>
        <ol className="site-steps">
          {tutorial.steps.map((step, i) => (
            <Fragment key={i}>
              <li>{step}</li>
              {tutorial.tips
                ?.filter((tip) => tip.afterStep === i + 1)
                .map((tip) => (
                  <li key={tip.text} className="site-steps__tip">
                    <aside className="kn-tip">
                      <span className="kn-tip__label">Mẹo nhỏ</span>
                      <p>{tip.text}</p>
                    </aside>
                  </li>
                ))}
            </Fragment>
          ))}
        </ol>
      </section>

      {related.length > 0 && (
        <section className="yt-watch__related">
          <h2 className="yt-watch__h2">Bài khác</h2>
          {related.map((t) => (
            <CompactCard key={t.slug} tutorial={t} channel={channels.find((c) => c.id === t.channel)} />
          ))}
        </section>
      )}
    </article>
  );
}
