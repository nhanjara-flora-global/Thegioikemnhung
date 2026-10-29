import type { Metadata } from "next";
import { ChannelDirectory, SubscribedFeed } from "@/components/yt/PrefFeeds";
import { getChannels } from "@/lib/channels-data";
import { getTutorials } from "@/lib/tutorials-data";

export const metadata: Metadata = { title: "Kênh của bạn" };

export default async function ChannelsPage() {
  const [tutorials, channels] = await Promise.all([getTutorials(), getChannels()]);
  const counts = Object.fromEntries(channels.map((c) => [c.id, tutorials.filter((t) => t.channel === c.id).length]));
  return (
    <section className="yt-page">
      <h1 className="text-h2">Kênh của bạn</h1>
      <SubscribedFeed tutorials={tutorials} channels={channels} />
      <h2 className="text-h3">Tất cả kênh</h2>
      <ChannelDirectory channels={channels} counts={counts} />
    </section>
  );
}
