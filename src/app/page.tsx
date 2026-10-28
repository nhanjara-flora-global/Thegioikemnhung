import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { TutorialCard } from "@/components/TutorialCard";
import { getBestSellers } from "@/lib/catalog";
import { site } from "@/lib/site";
import { getTutorials } from "@/lib/tutorials";

export default async function Home() {
  const [bestSellers, tutorials] = await Promise.all([getBestSellers(), getTutorials()]);

  return (
    <>
      <section className="site-container site-hero">
        <div className="site-hero__text">
          <h1 className="text-display">Kẽm nhung đủ màu cho mọi ý tưởng</h1>
          <p className="text-body">
            {site.tagline} Chọn sợi, dụng cụ và phụ kiện — bạn chỉ việc uốn thành hoa.
          </p>
          <Link href="/huong-dan" className="kn-btn kn-btn--mint">
            Bắt đầu ngay
          </Link>
        </div>
        <HeroArt />
      </section>

      <section className="site-container site-section">
        <div className="site-section__head">
          <h2 className="text-h2">Làm bó hoa đầu tiên</h2>
          <Link href="/huong-dan" className="kn-btn kn-btn--ghost kn-btn--sm">
            Xem tất cả
          </Link>
        </div>
        <div className="site-grid site-grid--video site-rail">
          {tutorials.slice(0, 4).map((t) => (
            <TutorialCard key={t.slug} tutorial={t} />
          ))}
        </div>
      </section>

      <section className="site-container site-section">
        <div className="site-section__head">
          <h2 className="text-h2">Bán chạy</h2>
          <Link href="/cua-hang" className="kn-btn kn-btn--ghost kn-btn--sm">
            Xem tất cả
          </Link>
        </div>
        <div className="site-grid">
          {bestSellers.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}

// Hình minh hoạ tạm (theo examples/Cover.html) — thay bằng video/ảnh thật khi có.
function HeroArt() {
  return (
    <svg className="kn-art site-hero__art" viewBox="0 0 480 288" aria-hidden="true" style={{ position: "static" }}>
      <rect className="p" x="16" y="0" width="160" height="264" rx="22" />
      <rect className="m" x="192" y="80" width="128" height="184" rx="22" />
      <rect className="l" x="336" y="32" width="128" height="168" rx="22" />
      <rect className="m7" x="216" y="120" width="16" height="144" rx="8" />
      <rect className="m7" x="248" y="96" width="16" height="168" rx="8" />
      <rect className="m7" x="280" y="136" width="16" height="128" rx="8" />
      <circle className="p6" cx="224" cy="120" r="24" />
      <circle className="b" cx="256" cy="96" r="24" />
      <circle className="p6" cx="288" cy="136" r="20" />
      <circle className="w" cx="224" cy="120" r="8" />
      <circle className="p6" cx="256" cy="96" r="8" />
      <circle className="w" cx="288" cy="136" r="6" />
      <circle className="w" cx="96" cy="72" r="32" />
      <circle className="p6" cx="96" cy="72" r="12" />
      <rect className="o" x="352" y="216" width="112" height="16" rx="8" />
      <rect className="b" x="368" y="240" width="72" height="16" rx="8" />
    </svg>
  );
}
