import { useSyncExternalStore } from "react";

// Bài đã thích và kênh đã đăng ký — lưu trong localStorage của trình duyệt khách (giống giỏ hàng).

const KEYS = { liked: "kn-liked", subs: "kn-subs" } as const;
type Kind = keyof typeof KEYS;

const empty: string[] = [];
const cache: Record<Kind, string[] | null> = { liked: null, subs: null };
const listeners = new Set<() => void>();

function read(kind: Kind) {
  if (cache[kind]) return cache[kind];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEYS[kind]) ?? "[]");
    cache[kind] = Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : empty;
  } catch {
    cache[kind] = empty;
  }
  return cache[kind];
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    const kind = (Object.keys(KEYS) as Kind[]).find((k) => KEYS[k] === e.key);
    if (!kind) return;
    cache[kind] = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function toggle(kind: Kind, id: string) {
  const list = read(kind);
  const next = list.includes(id) ? list.filter((x) => x !== id) : [id, ...list];
  cache[kind] = next;
  try {
    localStorage.setItem(KEYS[kind], JSON.stringify(next));
  } catch {
    // Trình duyệt chặn lưu trữ — vẫn dùng được đến khi tải lại trang.
  }
  listeners.forEach((l) => l());
}

const use = (kind: Kind) => useSyncExternalStore(subscribe, () => read(kind), () => empty);

/** Slug các bài đã thích, mới nhất trước. */
export const useLiked = () => use("liked");
export const toggleLike = (slug: string) => toggle("liked", slug);

/** Mã các kênh đã đăng ký. */
export const useSubscriptions = () => use("subs");
export const toggleSubscribe = (channel: string) => toggle("subs", channel);
