"use client";

import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { AddToCartButton } from "./AddToCartButton";

// Chọn số lượng + thêm vào giỏ ở trang chi tiết sản phẩm.
export function BuyBox({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);

  return (
    <div className="site-buy">
      {product.inStock && (
        <div className="kn-stepper">
          <button aria-label="Bớt một" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            −
          </button>
          <output aria-live="polite" aria-label="Số lượng">
            {qty}
          </output>
          <button aria-label="Thêm một" onClick={() => setQty((q) => Math.min(99, q + 1))}>
            +
          </button>
        </div>
      )}
      <AddToCartButton product={product} qty={qty} size="md" />
    </div>
  );
}
