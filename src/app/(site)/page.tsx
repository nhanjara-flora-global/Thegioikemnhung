import { Suspense } from "react";
import { Feed, SearchFeed } from "@/components/yt/Feed";
import { getChannels } from "@/lib/channels-data";
import { getTutorials } from "@/lib/tutorials-data";

export default async function Home() {
  const [tutorials, channels] = await Promise.all([getTutorials(), getChannels()]);
  return (
    <Suspense fallback={<Feed tutorials={tutorials} channels={channels} />}>
      <SearchFeed tutorials={tutorials} channels={channels} />
    </Suspense>
  );
}
