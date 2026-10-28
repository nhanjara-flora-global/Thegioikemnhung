"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";
import type { Product } from "@/lib/catalog";

type Props = {
  product: Product;
  qty?: number;
  size?: "sm" | "md";
};

export function AddToCartButton({ product, qty = 1, size = "sm" }: Props) {
  const [added, setAdded] = useState(false);

  if (!product.inStock) {
    return (
      <button className={`kn-btn kn-btn--primary${size === "sm" ? " kn-btn--sm" : ""}`} disabled>
        Hết hàng
      </button>
    );
  }

  return (
    <button
      className={`kn-btn kn-btn--primary${size === "sm" ? " kn-btn--sm" : ""}`}
      aria-label={`Thêm ${product.name} vào giỏ`}
      onClick={() => {
        const { slug, name, spec, price, color, imageUrl } = product;
        addToCart({ slug, name, spec, price, color, imageUrl }, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
    >
      {added ? "Đã thêm ✓" : "Thêm vào giỏ"}
    </button>
  );
}
