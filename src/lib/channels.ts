// Kênh: nơi đăng bài hướng dẫn (kênh của shop, kênh của người làm đồ handmade…).

export type Channel = {
  id: string;
  name: string;
  /** Tên gọi ngắn sau @, vd "@kemnhung". */
  handle: string;
  description: string;
  /** Màu ảnh đại diện (token màu trong kn/tokens.css). */
  color: ChannelColor;
};

export const channelColors = ["pink", "orange", "yellow", "green", "violet"] as const;
export type ChannelColor = (typeof channelColors)[number];

export const SHOP_CHANNEL = "thegioikemnhung";

export const seedChannels: Channel[] = [
  {
    id: SHOP_CHANNEL,
    name: "Thế Giới Kem Nhung",
    handle: "thegioikemnhung",
    description: "Kênh chính của shop — mẫu hoa kẽm nhung mới mỗi tuần.",
    color: "pink",
  },
];

/** Chữ cái đầu cho ảnh đại diện: "Thế Giới Kem Nhung" → "TG". */
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}
