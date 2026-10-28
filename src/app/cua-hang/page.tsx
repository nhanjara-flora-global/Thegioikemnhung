import type { Metadata } from "next";
import { ShopGrid } from "@/components/ShopGrid";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Cửa hàng" };

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <section className="site-container site-section">
      <h1 className="text-h1">Cửa hàng</h1>
      <ShopGrid products={products} />
    </section>
  );
}
