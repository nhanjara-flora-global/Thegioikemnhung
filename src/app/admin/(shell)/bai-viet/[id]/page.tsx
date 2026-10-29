import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TutorialEditor, type EditorProduct } from "@/components/admin/TutorialEditor";
import { getProducts } from "@/lib/catalog";
import { SHOP_CHANNEL } from "@/lib/channels";
import { listAllChannels } from "@/lib/channels-data";
import type { StoredTutorial } from "@/lib/tutorials";
import { getTutorialById } from "@/lib/tutorials-data";

export const metadata: Metadata = { title: "Soạn bài" };

const BLANK: Omit<StoredTutorial, "id"> = {
  slug: "", title: "", channel: SHOP_CHANNEL, flowerName: "", level: "beginner", makeTime: "", defaultFlowers: 3,
  summary: "", steps: [""], tips: [], materials: [], status: "draft", updatedAt: "",
};

export default async function EditTutorialPage({ params }: PageProps<"/admin/bai-viet/[id]">) {
  const { id } = await params;
  const tutorial = id === "moi" ? BLANK : await getTutorialById(id);
  if (!tutorial) notFound();
  const products: EditorProduct[] = (await getProducts()).map((p) => ({
    slug: p.slug, name: p.name, spec: p.spec, sellUnit: p.sellUnit, pack: p.pack, color: p.color, inStock: p.inStock, price: p.price,
  }));
  const channels = (await listAllChannels()).map((c) => ({ id: c.id, name: c.name }));
  return <TutorialEditor key={id} initial={tutorial} products={products} channels={channels} />;
}
