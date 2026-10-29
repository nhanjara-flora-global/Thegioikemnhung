"use client";

import { useEffect, useRef, useState } from "react";

// Rê chuột lên ảnh bìa ~0,5 giây thì phát video tắt tiếng ngay trong khung, như YouTube.
// Chỉ bật trên máy có chuột (màn cảm ứng bấm là vào trang chi tiết luôn).
export function HoverPreview({ src }: { src: string }) {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = ref.current?.parentElement;
    if (!box || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let timer: ReturnType<typeof setTimeout>;
    const enter = () => { timer = setTimeout(() => setOn(true), 500); };
    const leave = () => { clearTimeout(timer); setOn(false); };
    box.addEventListener("mouseenter", enter);
    box.addEventListener("mouseleave", leave);
    return () => {
      clearTimeout(timer);
      box.removeEventListener("mouseenter", enter);
      box.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <span ref={ref} className="yt-preview" aria-hidden="true">
      {on && <iframe src={src} title="" tabIndex={-1} allow="autoplay; encrypted-media" />}
    </span>
  );
}
