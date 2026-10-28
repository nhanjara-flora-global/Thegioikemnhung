"use client";

import Link from "next/link";
import { cartCount, useCart } from "@/lib/cart";

export function CartLink() {
  const count = cartCount(useCart());
  return (
    <Link href="/gio-hang" className="kn-btn kn-btn--soft kn-btn--sm" aria-label={`Giỏ hàng, ${count} món`}>
      Giỏ hàng{count > 0 && <span className="site-badge">{count}</span>}
    </Link>
  );
}
