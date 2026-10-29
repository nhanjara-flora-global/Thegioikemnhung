import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = { title: "Giỏ hàng" };

export default function CartPage() {
  return (
    <section className="yt-page site-cart">
      <h1 className="text-h2">Giỏ hàng</h1>
      <CartView />
    </section>
  );
}
