import type { Metadata } from "next";
import { ShopGrid } from "@/components/ShopGrid";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Danh sách phụ kiện" };

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <section className="yt-page">
      <h1 className="text-h2">Danh sách phụ kiện</h1>
      <ShopGrid products={products} />
    </section>
  );
}
