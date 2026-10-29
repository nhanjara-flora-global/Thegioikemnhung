import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChannelAvatar } from "@/components/yt/ChannelAvatar";
import { Feed } from "@/components/yt/Feed";
import { SubscribeButton } from "@/components/yt/SubscribeButton";
import { getChannel, getChannels } from "@/lib/channels-data";
import { getChannelTutorials } from "@/lib/tutorials-data";

export async function generateStaticParams() {
  return (await getChannels()).map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/kenh/[id]">): Promise<Metadata> {
  const channel = await getChannel((await params).id);
  return { title: channel?.name, description: channel?.description };
}

export default async function ChannelPage({ params }: PageProps<"/kenh/[id]">) {
  const { id } = await params;
  const channel = await getChannel(id);
  if (!channel) notFound();
  const tutorials = await getChannelTutorials(id);

  return (
    <section className="yt-page">
      <div className={`yt-banner yt-banner--${channel.color}`} aria-hidden="true" />
      <header className="yt-chhead">
        <ChannelAvatar channel={channel} size={120} />
        <div className="yt-chhead__text">
          <h1 className="text-h1">{channel.name}</h1>
          <p className="yt-card__meta">@{channel.handle} · {tutorials.length} bài</p>
          {channel.description && <p className="text-body">{channel.description}</p>}
          <SubscribeButton channel={channel.id} />
        </div>
      </header>
      <Feed tutorials={tutorials} channels={[channel]} hideChannel empty="Kênh chưa đăng bài nào." />
    </section>
  );
}
