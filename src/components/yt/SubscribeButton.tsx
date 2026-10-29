"use client";

import { toggleLike, toggleSubscribe, useLiked, useSubscriptions } from "@/lib/prefs";
import { Icon } from "./Icon";

export function SubscribeButton({ channel }: { channel: string }) {
  const on = useSubscriptions().includes(channel);
  return (
    <button className={`yt-pillbtn ${on ? "" : "yt-pillbtn--dark"}`} aria-pressed={on} onClick={() => toggleSubscribe(channel)}>
      {on ? "Đã đăng ký" : "Đăng ký"}
    </button>
  );
}

export function LikeButton({ slug }: { slug: string }) {
  const on = useLiked().includes(slug);
  return (
    <button className="yt-pillbtn" aria-pressed={on} onClick={() => toggleLike(slug)}>
      <Icon name="heart" filled={on} /> {on ? "Đã thích" : "Thích"}
    </button>
  );
}
