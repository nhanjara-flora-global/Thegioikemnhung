import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/BuyBox";
import { ProductMedia } from "@/components/ProductMedia";
import { categoryLabel, formatPrice, getProduct, getProducts } from "@/lib/catalog";
import { getTutorialsUsing } from "@/lib/tutorials";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/san-pham/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return { title: product?.name, description: product?.description };
}

export default async function ProductPage({ params }: PageProps<"/san-pham/[slug]">) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const tutorials = await getTutorialsUsing(product.slug);

  return (
    <section className="site-container site-product">
      <ProductMedia product={product} />
      <div className="site-product__info">
        <span className="kn-tag kn-tag--topic">{categoryLabel(product.category)}</span>
        <h1 className="text-h1">{product.name}</h1>
        <p className="text-body">{product.spec}</p>
        <p className="text-price">
          {formatPrice(product.price)}
          {product.oldPrice && <span className="kn-kit__old">{formatPrice(product.oldPrice)}</span>}
        </p>
        <p className={product.inStock ? "site-stock" : "site-stock site-stock--out"}>
          {product.inStock ? "Còn hàng" : "Hết hàng"}
        </p>
        <BuyBox product={product} />
        {product.description && <p className="text-body">{product.description}</p>}
        {tutorials.length > 0 && (
          <div className="site-product__ideas">
            <h2 className="text-h3">Làm gì với món này?</h2>
            {tutorials.map((t) => (
              <Link key={t.slug} href={`/huong-dan/${t.slug}`} className="kn-btn kn-btn--soft kn-btn--sm">
                Xem cách làm {t.title.toLowerCase()}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
