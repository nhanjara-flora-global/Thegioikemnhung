"use client";

import { useState } from "react";
import { levels, type Level, type Tutorial } from "@/lib/tutorials";
import { TutorialCard } from "./TutorialCard";

export function TutorialGrid({ tutorials }: { tutorials: Tutorial[] }) {
  const [filter, setFilter] = useState<Level | "all">("all");
  const shown = filter === "all" ? tutorials : tutorials.filter((t) => t.level === filter);

  return (
    <>
      <div className="kn-seg" role="group" aria-label="Lọc theo cấp độ">
        {[{ id: "all" as const, label: "Tất cả" }, ...levels].map((l) => (
          <button key={l.id} aria-pressed={filter === l.id} onClick={() => setFilter(l.id)}>
            {l.label}
          </button>
        ))}
      </div>
      {shown.length > 0 ? (
        <div className="site-grid site-grid--video">
          {shown.map((t) => (
            <TutorialCard key={t.slug} tutorial={t} />
          ))}
        </div>
      ) : (
        <p className="text-body">Chưa có bài ở cấp độ này — sắp có nhé!</p>
      )}
    </>
  );
}
