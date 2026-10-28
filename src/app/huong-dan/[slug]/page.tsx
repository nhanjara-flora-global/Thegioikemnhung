import type { Metadata } from "next";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { TutorialMaterials } from "@/components/TutorialMaterials";
import { VideoPlayer } from "@/components/VideoPlayer";
import { getMaterials, getTutorial, getTutorials, levelLabel } from "@/lib/tutorials";

export async function generateStaticParams() {
  const tutorials = await getTutorials();
  return tutorials.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/huong-dan/[slug]">): Promise<Metadata> {
  const tutorial = await getTutorial((await params).slug);
  return { title: tutorial?.title, description: tutorial?.summary };
}

export default async function TutorialPage({ params }: PageProps<"/huong-dan/[slug]">) {
  const tutorial = await getTutorial((await params).slug);
  if (!tutorial) notFound();
  const materials = await getMaterials(tutorial);

  return (
    <article className="site-container site-tut">
      <header className="site-tut__head">
        <span className={`kn-tag kn-tag--${tutorial.level}`}>{levelLabel(tutorial.level)}</span>
        <h1 className="text-h1">{tutorial.title}</h1>
        <p className="kn-muted">
          {tutorial.steps.length} bước · {tutorial.makeTime}
        </p>
      </header>

      <div className="site-tut__video">
        <VideoPlayer url={tutorial.videoUrl} title={tutorial.title} />
      </div>

      <div className="site-tut__panel">
        <TutorialMaterials
          materials={materials}
          flowerName={tutorial.flowerName}
          defaultFlowers={tutorial.defaultFlowers}
        />
      </div>

      <div className="site-tut__body">
        <p className="text-body">{tutorial.summary}</p>
        <h2 className="text-h2">Các bước làm</h2>
        <ol className="site-steps">
          {tutorial.steps.map((step, i) => (
            <Fragment key={i}>
              <li className="text-body">{step}</li>
              {tutorial.tips
                ?.filter((tip) => tip.afterStep === i + 1)
                .map((tip) => (
                  <li key={tip.text} className="site-steps__tip">
                    <aside className="kn-tip">
                      <span className="kn-tip__label">Mẹo nhỏ</span>
                      <p>{tip.text}</p>
                    </aside>
                  </li>
                ))}
            </Fragment>
          ))}
        </ol>
      </div>
    </article>
  );
}
