"use client";

import { useState } from "react";
import { categories, type Category, type Product } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

// Lọc theo loại ngay trên trình duyệt — danh mục còn nhỏ nên tải hết một lần.
export function ShopGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Category | "all">("all");
  const shown = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <>
      <div className="kn-seg" role="group" aria-label="Lọc theo loại">
        {[{ id: "all" as const, label: "Tất cả" }, ...categories].map((c) => (
          <button key={c.id} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="site-grid">
        {shown.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </>
  );
}
