// Bộ biểu tượng nét (24×24) cho khung trang kiểu YouTube.
const paths = {
  menu: "M3 6h18M3 12h18M3 18h18",
  home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z",
  heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  channel: "M4 5h16v14H4zM9 15c.6-1.8 1.7-2.5 3-2.5s2.4.7 3 2.5M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  bag: "M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2",
  search: "M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zM16 16l5 5",
  cart: "M3 4h2l2.4 11h10.2L20 7H6.2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  close: "M6 6l12 12M18 6 6 18",
  chevron: "m9 6 6 6-6 6",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, filled }: { name: IconName; filled?: boolean }) {
  return (
    <svg className="yt-icon" viewBox="0 0 24 24" aria-hidden="true" fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
}
