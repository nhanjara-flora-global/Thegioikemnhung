import type { ReactNode } from "react";
import type { Product } from "@/lib/catalog";

type Props = {
  product: Pick<Product, "name" | "color" | "imageUrl">;
  children?: ReactNode;
};

// Ảnh sản phẩm (link ngoài) hoặc hình minh hoạ khi chưa có ảnh.
// Dùng <img> thường để nhận link ảnh từ bất kỳ trang nào mà không phải khai báo tên miền.
export function ProductMedia({ product, children }: Props) {
  return (
    <div className="kn-media">
      {product.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.imageUrl} alt={product.name} loading="lazy" referrerPolicy="no-referrer" />
      ) : product.color ? (
        <WireBundle color={product.color} />
      ) : (
        <FlowerArt />
      )}
      {children}
    </div>
  );
}

// Bó sợi kẽm nhung tô theo màu sợi.
function WireBundle({ color }: { color: string }) {
  return (
    <svg className="kn-art" viewBox="0 0 240 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <circle className="w" cx="190" cy="40" r="56" />
      {[40, 60, 80, 100, 120].map((y, i) => (
        <rect key={y} x={28 + i * 6} y={y} width="184" height="14" rx="7" style={{ fill: color }} transform={`rotate(-12 120 ${y})`} />
      ))}
      <rect className="p6" x="104" y="44" width="16" height="96" rx="8" transform="rotate(-12 112 92)" />
    </svg>
  );
}

export function FlowerArt() {
  return (
    <svg className="kn-art" viewBox="0 0 240 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <circle className="p" cx="190" cy="40" r="56" />
      <rect className="m7" x="72" y="74" width="10" height="120" rx="5" />
      <rect className="m7" x="118" y="58" width="10" height="136" rx="5" />
      <rect className="m7" x="164" y="88" width="10" height="110" rx="5" />
      <circle className="p6" cx="77" cy="70" r="20" />
      <circle className="b" cx="123" cy="52" r="22" />
      <circle className="p6" cx="169" cy="84" r="18" />
      <circle className="w" cx="77" cy="70" r="6" />
      <circle className="w" cx="123" cy="52" r="7" />
      <circle className="w" cx="169" cy="84" r="5" />
    </svg>
  );
}
