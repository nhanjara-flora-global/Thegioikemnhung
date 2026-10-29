import type { Metadata } from "next";
import { TutorialGrid } from "@/components/TutorialGrid";
import { getTutorials } from "@/lib/tutorials";

export const metadata: Metadata = { title: "Hướng dẫn" };

export default async function TutorialsPage() {
  const tutorials = await getTutorials();

  return (
    <section className="site-container site-section">
      <div className="site-section__intro">
        <h1 className="text-h1">Video hướng dẫn</h1>
        <p className="text-body">Mỗi video là một bó hoa — xem cách làm, rồi mua đúng nguyên liệu trong một lần bấm.</p>
      </div>
      <TutorialGrid tutorials={tutorials} />
    </section>
  );
}
