// Bài hướng dẫn: mỗi bài là một video dạy làm một bó hoa, kèm vật liệu để mua.
// Shop đăng / sửa bài ở /admin/bai-viet; đọc bài qua lib/tutorials-data.ts.

import type { Product } from "./catalog";
import { parseVideo } from "./video";

export type Level = "beginner" | "medium" | "advanced";

export const levels: { id: Level; label: string }[] = [
  { id: "beginner", label: "Người mới" },
  { id: "medium", label: "Trung bình" },
  { id: "advanced", label: "Nâng cao" },
];

/** Vật liệu trong bài: tính theo số bông, hoặc số lượng cố định cho cả bó. */
export type MaterialSpec = { product: string; note?: string } & (
  | { perFlower: number } // số món nhỏ (sợi, nhị) cho mỗi bông
  | { fixed: number } // số đơn vị bán cho cả bó, không đổi theo số bông
);

export type Tutorial = {
  slug: string;
  title: string;
  /** Mã kênh đăng bài (lib/channels.ts). */
  channel: string;
  /** Tên bông dùng trong nút: "Mua nguyên liệu làm 9 bông tulip hồng". */
  flowerName: string;
  level: Level;
  /** Link TikTok hoặc YouTube (kể cả Shorts). Để trống thì hiện hình minh hoạ. */
  videoUrl?: string;
  /** Ảnh bìa cho video TikTok (YouTube tự lấy). */
  thumbnailUrl?: string;
  /** Độ dài video, vd "0:58". */
  duration?: string;
  /** Thời gian làm ước tính. */
  makeTime: string;
  /** Số bông của bó mẫu trong video. */
  defaultFlowers: number;
  summary: string;
  steps: string[];
  /** Mẹo nhỏ chèn sau bước thứ `afterStep` (đếm từ 1). Tối đa 3 mẹo mỗi bài. */
  tips?: { afterStep: number; text: string }[];
  materials: MaterialSpec[];
};

export type Material = MaterialSpec & { item: Product };

export type TutorialStatus = "draft" | "published";

/** Bài lưu trong kho: thêm mã bài, trạng thái, ngày giờ. */
export type StoredTutorial = Tutorial & {
  id: string;
  status: TutorialStatus;
  updatedAt: string;
  publishedAt?: string;
};

/** Video dọc (TikTok, YouTube Shorts) hiện ở kệ Shorts; còn lại là video thường. */
export function isShort(t: Pick<Tutorial, "videoUrl">) {
  return Boolean(parseVideo(t.videoUrl)?.vertical);
}

export function levelLabel(id: Level) {
  return levels.find((l) => l.id === id)?.label ?? id;
}

/** Bỏ dấu, viết thường, nối bằng gạch ngang: "Bó tulip hồng" → "bo-tulip-hong". */
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export type Check = { ok: boolean; required?: boolean; label: string };

/** Danh sách kiểm tra trước khi đăng. Mục `required` chưa đạt thì không cho đăng. */
export function tutorialChecks(t: Tutorial, hasVideo: boolean): Check[] {
  const len = t.title.trim().length;
  const steps = t.steps.filter((s) => s.trim()).length;
  return [
    len < 10 || len > 90
      ? { ok: false, required: true, label: `Tiêu đề ${len} ký tự (cần 10–90)` }
      : { ok: true, label: `Tiêu đề ${len} ký tự` },
    /^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.slug)
      ? { ok: true, label: `Đường dẫn /huong-dan/${t.slug}` }
      : { ok: false, required: true, label: "Đường dẫn chỉ gồm chữ thường không dấu, số và dấu gạch ngang" },
    t.flowerName.trim()
      ? { ok: true, label: `Nút mua: “Mua nguyên liệu làm ${t.flowerName.trim()}”` }
      : { ok: false, required: true, label: "Chưa có tên bông (dùng trong nút mua nguyên liệu)" },
    steps
      ? { ok: true, label: `${steps} bước làm` }
      : { ok: false, required: true, label: "Chưa có bước làm nào" },
    t.materials.length
      ? { ok: true, label: `${t.materials.length} món nguyên liệu` }
      : { ok: false, required: true, label: "Chưa chọn nguyên liệu — khách không mua được" },
    hasVideo
      ? { ok: true, label: "Có video" }
      : { ok: false, label: t.videoUrl ? "Link video không đọc được (nhận TikTok, YouTube, Instagram, Facebook)" : "Chưa có video (trang sẽ hiện hình minh hoạ)" },
    t.summary.trim()
      ? { ok: true, label: "Có đoạn giới thiệu" }
      : { ok: false, label: "Chưa có đoạn giới thiệu (hiện dưới video)" },
    t.makeTime.trim()
      ? { ok: true, label: `Thời gian làm: ${t.makeTime.trim()}` }
      : { ok: false, label: "Chưa ghi thời gian làm" },
  ];
}
