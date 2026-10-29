import type { Metadata } from "next";
import { LikedFeed } from "@/components/yt/PrefFeeds";
import { getChannels } from "@/lib/channels-data";
import { getTutorials } from "@/lib/tutorials-data";

export const metadata: Metadata = { title: "Bài đã thích" };

export default async function LikedPage() {
  const [tutorials, channels] = await Promise.all([getTutorials(), getChannels()]);
  return (
    <section className="yt-page">
      <h1 className="text-h2">Bài đã thích</h1>
      <LikedFeed tutorials={tutorials} channels={channels} />
    </section>
  );
}
