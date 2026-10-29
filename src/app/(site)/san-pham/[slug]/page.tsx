import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/BuyBox";
import { ProductMedia } from "@/components/ProductMedia";
import { categoryLabel, formatPrice, getProduct, getProducts } from "@/lib/catalog";
import { CompactCard } from "@/components/yt/VideoCards";
import { getChannels } from "@/lib/channels-data";
import { getTutorialsUsing } from "@/lib/tutorials-data";

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

  const channels = await getChannels();

  return (
    <article className="yt-watch yt-watch--product">
      <div className="yt-watch__main yt-product">
        <div className="yt-product__img">
          <ProductMedia product={product} />
        </div>
        <div className="yt-product__info">
          <span className="yt-card__meta">{categoryLabel(product.category)}</span>
          <h1 className="yt-watch__title">{product.name}</h1>
          <p className="yt-card__meta">{product.spec}</p>
          <p className="yt-product__price">
            {formatPrice(product.price)}
            {product.oldPrice && <s>{formatPrice(product.oldPrice)}</s>}
          </p>
          <p className={product.inStock ? "site-stock" : "site-stock site-stock--out"}>
            {product.inStock ? "Còn hàng" : "Hết hàng"}
          </p>
          <BuyBox product={product} />
        </div>
        {product.description && (
          <div className="yt-desc yt-product__desc">
            <p>{product.description}</p>
          </div>
        )}
      </div>

      {tutorials.length > 0 && (
        <aside className="yt-watch__related">
          <h2 className="yt-watch__h2">Làm gì với món này?</h2>
          {tutorials.map((t) => (
            <CompactCard key={t.slug} tutorial={t} channel={channels.find((c) => c.id === t.channel)} />
          ))}
        </aside>
      )}
    </article>
  );
}
