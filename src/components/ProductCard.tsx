import Link from "next/link";
import { formatPrice, type Product } from "@/lib/catalog";
import { AddToCartButton } from "./AddToCartButton";
import { ProductMedia } from "./ProductMedia";

// Thẻ phụ kiện dạng phẳng như thẻ video: ảnh, tên, quy cách, giá + nút thêm giỏ.
export function ProductCard({ product }: { product: Product }) {
  const href = `/san-pham/${product.slug}`;
  return (
    <article className="yt-prod">
      <Link href={href} className="yt-prod__img" aria-label={product.name}>
        <ProductMedia product={product}>
          {product.bestSeller && <span className="kn-tag kn-tag--hot yt-thumb__level">★ Bán chạy</span>}
        </ProductMedia>
      </Link>
      <h3 className="yt-card__title">
        <Link href={href}>{product.name}</Link>
      </h3>
      <p className="yt-card__meta">{product.spec}</p>
      <div className="yt-prod__row">
        <span className="yt-prod__price">
          {formatPrice(product.price)}
          {product.oldPrice && <s>{formatPrice(product.oldPrice)}</s>}
        </span>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
