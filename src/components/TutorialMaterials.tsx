"use client";

import Link from "next/link";
import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import type { Material } from "@/lib/tutorials";

// StemCalculator + MaterialList gộp một khối, một nút mua duy nhất.
// Xem document/design-system/pop/components/StemCalculator.md và MaterialList.md.

const QUICK_PICKS = [3, 9, 20, 99];
const MAX_FLOWERS = 199;

/** Số đơn vị bán cần mua cho `flowers` bông (làm tròn lên theo bó/túi). */
function buyQty(m: Material, flowers: number) {
  if ("fixed" in m) return m.fixed;
  return Math.ceil((m.perFlower * flowers) / (m.item.pack?.size ?? 1));
}

function describe(m: Material, flowers: number, qty: number) {
  const parts = m.note ? [m.note] : [];
  if ("perFlower" in m) {
    const unit = m.item.pack?.unit ?? m.item.sellUnit;
    parts.push(`${m.perFlower} ${unit}/bông → ${m.perFlower * flowers} ${unit} → ${qty} ${m.item.sellUnit}`);
  } else {
    parts.push(`${qty} ${m.item.sellUnit}`);
  }
  return parts.join(" · ");
}

type Props = {
  materials: Material[];
  flowerName: string;
  defaultFlowers: number;
};

export function TutorialMaterials({ materials, flowerName, defaultFlowers }: Props) {
  const [flowers, setFlowers] = useState(defaultFlowers);
  // Lưu món khách bỏ chọn (đã có ở nhà); mặc định chọn hết.
  const [skipped, setSkipped] = useState<Set<string>>(() => new Set());
  const [added, setAdded] = useState(false);

  const rows = materials.map((m) => {
    const qty = buyQty(m, flowers);
    const available = m.item.inStock;
    return { m, qty, available, selected: available && !skipped.has(m.product) };
  });
  const selected = rows.filter((r) => r.selected);
  const availableCount = rows.filter((r) => r.available).length;
  const total = selected.reduce((sum, r) => sum + r.qty * r.m.item.price, 0);

  const label =
    selected.length === 0
      ? "Chọn ít nhất một món"
      : selected.length === availableCount
        ? `Mua nguyên liệu làm ${flowers} bông ${flowerName}`
        : `Thêm ${selected.length} món vào giỏ`;

  function changeFlowers(n: number) {
    setFlowers(Math.min(MAX_FLOWERS, Math.max(1, n)));
    setAdded(false);
  }

  function toggle(slug: string) {
    setSkipped((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    setAdded(false);
  }

  function addAll() {
    for (const { m, qty } of selected) {
      const { slug, name, spec, price, color, imageUrl } = m.item;
      addToCart({ slug, name, spec, price, color, imageUrl }, qty);
    }
    setAdded(true);
  }

  return (
    <section id="nguyen-lieu" className="kn-materials site-tut__materials" aria-labelledby="nguyen-lieu-title">
      <h2 className="kn-h3" id="nguyen-lieu-title">
        Bạn muốn làm bó mấy bông?
      </h2>
      <div className="kn-seg" role="group" aria-label="Chọn nhanh số bông">
        {QUICK_PICKS.map((n) => (
          <button key={n} aria-pressed={flowers === n} onClick={() => changeFlowers(n)}>
            {n} bông
          </button>
        ))}
      </div>
      <div className="site-row">
        <span className="kn-muted">Hoặc tự chọn</span>
        <div className="kn-stepper">
          <button aria-label="Bớt một bông" onClick={() => changeFlowers(flowers - 1)}>
            −
          </button>
          <output aria-live="polite" aria-label="Số bông">
            {flowers}
          </output>
          <button aria-label="Thêm một bông" onClick={() => changeFlowers(flowers + 1)}>
            +
          </button>
        </div>
      </div>

      <div className="kn-materials__head site-tut__list-head">
        <h3 className="text-label">Vật liệu cho bó {flowers} bông</h3>
        <span className="kn-muted">{rows.length} món</span>
      </div>
      <ul>
        {rows.map(({ m, qty, available, selected }) => (
          <li key={m.product} className="kn-mat">
            <input
              type="checkbox"
              className="kn-check"
              checked={selected}
              disabled={!available}
              onChange={() => toggle(m.product)}
              aria-label={`Chọn ${m.item.name}`}
            />
            <span
              className="kn-swatch"
              style={
                m.item.color
                  ? { background: "var(--pink-100)", color: m.item.color }
                  : { background: "var(--paper-200)", color: "var(--ink-muted)" }
              }
              aria-hidden="true"
            />
            <div>
              <Link href={`/san-pham/${m.product}`} className="kn-mat__name">
                {m.item.name}
              </Link>
              <div className="kn-mat__meta">
                {describe(m, flowers, qty)}
                {!available && <span className="site-stock--out"> · Hết hàng</span>}
              </div>
            </div>
            <span className="kn-mat__price">{formatPrice(qty * m.item.price)}</span>
          </li>
        ))}
      </ul>
      <div className="kn-total">
        <span className="kn-muted">Tạm tính</span>
        <span className="kn-price">{formatPrice(total)}</span>
      </div>
      <button className="kn-btn kn-btn--primary kn-btn--block" disabled={selected.length === 0} onClick={addAll}>
        {label}
      </button>
      {added && (
        <p className="site-added" role="status">
          Đã thêm vào giỏ ✓ <Link href="/gio-hang">Xem giỏ hàng</Link>
        </p>
      )}
    </section>
  );
}
