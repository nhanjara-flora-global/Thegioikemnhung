import { useSyncExternalStore } from "react";

// Giỏ hàng lưu trong localStorage của trình duyệt khách.
// Lưu kèm tên và giá lúc thêm để hiển thị; giá thật được kiểm lại khi đặt hàng.

export type CartItem = {
  slug: string;
  name: string;
  spec: string;
  price: number;
  color?: string;
  imageUrl?: string;
  qty: number;
};

const KEY = "kn-cart";
const MAX_QTY = 99;
const empty: CartItem[] = [];

let items: CartItem[] = empty;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    items = Array.isArray(parsed) ? parsed : empty;
  } catch {
    items = empty;
  }
}

function commit(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Trình duyệt chặn lưu trữ (chế độ ẩn danh…) — giỏ vẫn dùng được đến khi tải lại trang.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Đồng bộ khi khách mở nhiều tab.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return items;
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, () => empty);
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  load();
  const existing = items.find((i) => i.slug === item.slug);
  if (existing) {
    setQty(item.slug, existing.qty + qty);
  } else {
    commit([...items, { ...item, qty: Math.min(qty, MAX_QTY) }]);
  }
}

export function setQty(slug: string, qty: number) {
  load();
  if (qty <= 0) return removeFromCart(slug);
  commit(items.map((i) => (i.slug === slug ? { ...i, qty: Math.min(qty, MAX_QTY) } : i)));
}

export function removeFromCart(slug: string) {
  load();
  commit(items.filter((i) => i.slug !== slug));
}

export function cartCount(list: CartItem[]) {
  return list.reduce((sum, i) => sum + i.qty, 0);
}

export function cartTotal(list: CartItem[]) {
  return list.reduce((sum, i) => sum + i.qty * i.price, 0);
}
