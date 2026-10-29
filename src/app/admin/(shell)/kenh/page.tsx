import type { Metadata } from "next";
import { ChannelsAdmin } from "@/components/admin/ChannelsAdmin";
import { listAllChannels } from "@/lib/channels-data";
import { listAllTutorials } from "@/lib/tutorials-data";

export const metadata: Metadata = { title: "Kênh" };

export default async function AdminChannelsPage() {
  const [channels, tutorials] = await Promise.all([listAllChannels(), listAllTutorials()]);
  const counts = Object.fromEntries(channels.map((c) => [c.id, tutorials.filter((t) => t.channel === c.id).length]));
  return (
    <>
      <div className="ad-title">
        <h1 className="text-h2">Kênh</h1>
      </div>
      <ChannelsAdmin channels={channels} counts={counts} />
    </>
  );
}
