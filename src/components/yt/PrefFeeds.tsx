"use client";

import Link from "next/link";
import type { Channel } from "@/lib/channels";
import { useLiked, useSubscriptions } from "@/lib/prefs";
import type { Tutorial } from "@/lib/tutorials";
import { ChannelAvatar } from "./ChannelAvatar";
import { Feed } from "./Feed";
import { SubscribeButton } from "./SubscribeButton";

type Props = { tutorials: Tutorial[]; channels: Channel[] };

export function LikedFeed({ tutorials, channels }: Props) {
  const liked = useLiked();
  const list = liked.map((slug) => tutorials.find((t) => t.slug === slug)).filter((t) => t !== undefined);
  return <Feed tutorials={list} channels={channels} empty="Chưa thích bài nào." />;
}

export function SubscribedFeed({ tutorials, channels }: Props) {
  const subs = useSubscriptions();
  return <Feed tutorials={tutorials.filter((t) => subs.includes(t.channel))} channels={channels} empty="Chưa đăng ký kênh nào." />;
}

export function ChannelDirectory({ channels, counts }: { channels: Channel[]; counts: Record<string, number> }) {
  return (
    <ul className="yt-chlist">
      {channels.map((c) => (
        <li key={c.id} className="yt-chrow">
          <Link href={`/kenh/${c.id}`} className="yt-chrow__link">
            <ChannelAvatar channel={c} size={64} />
            <span>
              <b>{c.name}</b>
              <small className="yt-card__meta">@{c.handle} · {counts[c.id] ?? 0} bài</small>
            </span>
          </Link>
          <SubscribeButton channel={c.id} />
        </li>
      ))}
    </ul>
  );
}
