import Link from "next/link";
import { formatPrice, type Product } from "@/lib/catalog";
import { AddToCartButton } from "./AddToCartButton";
import { ProductMedia } from "./ProductMedia";

// KitCard — xem document/design-system/pop/components/KitCard.md.
// Phụ kiện lẻ nên không có tag cấp độ.
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="kn-card site-card">
      <Link href={`/san-pham/${product.slug}`} className="site-card__link">
        <ProductMedia product={product}>
          {product.bestSeller && (
            <div className="kn-media__badges">
              <span className="kn-tag kn-tag--hot">★ Bán chạy</span>
            </div>
          )}
        </ProductMedia>
      </Link>
      <div className="kn-card__body">
        <h3 className="kn-h3">
          <Link href={`/san-pham/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="kn-muted">{product.spec}</p>
        <div className="kn-kit__row">
          <span className="kn-price">
            {formatPrice(product.price)}
            {product.oldPrice && <span className="kn-kit__old">{formatPrice(product.oldPrice)}</span>}
          </span>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
