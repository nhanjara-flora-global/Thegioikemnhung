"use client";

import Link from "next/link";
import { cartCount, cartTotal, removeFromCart, setQty, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";

export function CartView() {
  const items = useCart();

  if (items.length === 0) {
    return (
      <div className="kn-materials site-empty">
        <p className="text-body">Giỏ hàng của bạn đang trống.</p>
        <Link href="/cua-hang" className="kn-btn kn-btn--mint">
          Chọn nguyên liệu
        </Link>
      </div>
    );
  }

  return (
    <div className="kn-materials">
      <div className="kn-materials__head">
        <h2 className="kn-h3">{cartCount(items)} món</h2>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.slug} className="site-cart-row">
            <span className="kn-swatch" style={{ background: "var(--pink-100)", color: item.color ?? "var(--pink-400)" }} aria-hidden="true" />
            <div>
              <Link href={`/san-pham/${item.slug}`} className="kn-mat__name">
                {item.name}
              </Link>
              <div className="kn-mat__meta">
                {item.spec} · {formatPrice(item.price)}
              </div>
            </div>
            <div className="kn-stepper">
              <button aria-label={`Bớt một ${item.name}`} onClick={() => setQty(item.slug, item.qty - 1)}>
                −
              </button>
              <output aria-live="polite">{item.qty}</output>
              <button aria-label={`Thêm một ${item.name}`} onClick={() => setQty(item.slug, item.qty + 1)}>
                +
              </button>
            </div>
            <span className="kn-mat__price">{formatPrice(item.price * item.qty)}</span>
            <button className="kn-btn kn-btn--ghost kn-btn--sm" onClick={() => removeFromCart(item.slug)}>
              Xoá
            </button>
          </li>
        ))}
      </ul>
      <div className="kn-total">
        <span className="text-label">Tạm tính</span>
        <span className="kn-price">{formatPrice(cartTotal(items))}</span>
      </div>
      {/* Bước đặt hàng + mã QR chuyển khoản làm ở phần tiếp theo. */}
      <button className="kn-btn kn-btn--primary kn-btn--block" disabled>
        Đặt hàng (sắp có)
      </button>
    </div>
  );
}
