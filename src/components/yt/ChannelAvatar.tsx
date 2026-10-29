import { initials, type Channel } from "@/lib/channels";

export function ChannelAvatar({ channel, size = 36 }: { channel?: Pick<Channel, "name" | "color">; size?: number }) {
  return (
    <span className={`yt-avatar yt-avatar--${channel?.color ?? "pink"}`} style={{ width: size, height: size, fontSize: size * 0.4 }} aria-hidden="true">
      {initials(channel?.name ?? "?")}
    </span>
  );
}
