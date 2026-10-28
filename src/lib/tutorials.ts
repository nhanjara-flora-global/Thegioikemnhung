// Bài hướng dẫn: mỗi bài là một video dạy làm một bó hoa, kèm vật liệu để mua.
// Hiện là dữ liệu mẫu — khi có trang quản trị + Supabase, shop sẽ đăng bài từ đó.

import { getProduct, type Product } from "./catalog";

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

const tutorials: Tutorial[] = [
  {
    slug: "bo-tulip-hong-phan",
    title: "Bó tulip hồng phấn cho người mới",
    flowerName: "tulip hồng phấn",
    level: "beginner",
    makeTime: "30 phút",
    duration: "1:12",
    defaultFlowers: 3,
    summary: "Bó 3 bông tulip xinh xắn — mẫu dễ nhất để bắt đầu với kẽm nhung.",
    steps: [
      "Lấy 3 sợi kẽm hồng, uốn mỗi sợi thành một vòng cánh dài khoảng 5cm.",
      "Chụm 3 cánh lại, xoắn chặt phần gốc vào nhau.",
      "Lấy 1 sợi xanh lá làm cành, móc đầu cành vào giữa 3 cánh rồi xoắn chặt.",
      "Uốn sợi xanh lá thứ hai thành chiếc lá, xoắn vào giữa cành.",
      "Bóp nhẹ các cánh cho khum lại thành hình tulip.",
      "Làm đủ số bông, chụm lại, quấn băng keo quanh cành.",
      "Gói giấy, thắt ruy băng là xong.",
    ],
    tips: [
      { afterStep: 2, text: "Xoắn 2 vòng ở gốc để bông thật chắc nhé!" },
      { afterStep: 5, text: "Cánh hơi lệch một chút trông lại tự nhiên hơn." },
    ],
    materials: [
      { product: "kem-nhung-hong-phan", perFlower: 3, note: "Làm cánh" },
      { product: "kem-nhung-xanh-la", perFlower: 2, note: "Làm cành và lá" },
      { product: "bang-keo-quan-canh", fixed: 1, note: "Quấn cành" },
      { product: "giay-goi-hoa", fixed: 1, note: "Gói bó hoa" },
      { product: "ruy-bang-lua", fixed: 1, note: "Thắt nơ" },
      { product: "kim-cat-kem", fixed: 1, note: "Cắt kẽm — bỏ chọn nếu đã có" },
    ],
  },
  {
    slug: "bo-9-tulip-tim",
    title: "Bó 9 tulip tím oải hương tặng sinh nhật",
    flowerName: "tulip tím",
    level: "beginner",
    makeTime: "1 giờ 15 phút",
    duration: "2:05",
    defaultFlowers: 9,
    summary: "9 bông tulip tím — con số “mãi mãi” người Việt hay chọn để tặng.",
    steps: [
      "Làm từng bông tulip giống bài tulip hồng: 3 cánh tím, 1 cành, 1 lá.",
      "Xếp 1 bông ở giữa, 8 bông xoay vòng quanh, cao thấp so le.",
      "Quấn băng keo quanh cành từ trên xuống dưới cho chặt.",
      "Cắt bằng gốc cành, gói 2 lớp giấy và thắt ruy băng.",
    ],
    tips: [{ afterStep: 2, text: "Bông giữa cao hơn khoảng 2cm thì bó hoa nhìn sẽ tròn đầy." }],
    materials: [
      { product: "kem-nhung-tim-oai-huong", perFlower: 3, note: "Làm cánh" },
      { product: "kem-nhung-xanh-la", perFlower: 2, note: "Làm cành và lá" },
      { product: "bang-keo-quan-canh", fixed: 1, note: "Quấn cành" },
      { product: "giay-goi-hoa", fixed: 1, note: "Gói bó hoa" },
      { product: "ruy-bang-lua", fixed: 1, note: "Thắt nơ" },
      { product: "kim-cat-kem", fixed: 1, note: "Cắt kẽm — bỏ chọn nếu đã có" },
    ],
  },
  {
    slug: "bo-cuc-vang",
    title: "Bó cúc vàng có nhị",
    flowerName: "cúc vàng",
    level: "medium",
    makeTime: "50 phút",
    duration: "1:48",
    defaultFlowers: 5,
    summary: "Cúc nhiều cánh nhỏ, gắn nhị hoa bằng keo nến — tươi tắn cho góc bàn học.",
    steps: [
      "Cắt mỗi sợi vàng làm đôi, uốn thành 8 cánh nhỏ.",
      "Xếp 8 cánh thành vòng tròn, xoắn gốc vào nhau.",
      "Bắn một chấm keo vào giữa, gắn nhị hoa.",
      "Gắn cành và lá xanh như bài tulip.",
      "Chụm các bông, quấn băng keo, gói giấy và thắt nơ.",
    ],
    tips: [{ afterStep: 3, text: "Đợi keo nguội 10 giây rồi mới buông tay nhé." }],
    materials: [
      { product: "kem-nhung-vang-chanh", perFlower: 4, note: "Làm cánh" },
      { product: "nhi-hoa-vang", perFlower: 1, note: "Nhụy giữa bông" },
      { product: "kem-nhung-xanh-la", perFlower: 2, note: "Làm cành và lá" },
      { product: "bang-keo-quan-canh", fixed: 1, note: "Quấn cành" },
      { product: "giay-goi-hoa", fixed: 1, note: "Gói bó hoa" },
      { product: "ruy-bang-lua", fixed: 1, note: "Thắt nơ" },
      { product: "sung-ban-keo", fixed: 1, note: "Gắn nhị — bỏ chọn nếu đã có" },
    ],
  },
];

export async function getTutorials(): Promise<Tutorial[]> {
  return tutorials;
}

export async function getTutorial(slug: string): Promise<Tutorial | undefined> {
  return tutorials.find((t) => t.slug === slug);
}

/** Ghép vật liệu của bài với thông tin sản phẩm (giá, còn hàng…). */
export async function getMaterials(tutorial: Tutorial): Promise<Material[]> {
  const rows = await Promise.all(
    tutorial.materials.map(async (m) => {
      const item = await getProduct(m.product);
      return item ? { ...m, item } : null;
    }),
  );
  return rows.filter((m) => m !== null);
}

/** Các bài có dùng sản phẩm này — để gợi ý ở trang sản phẩm. */
export async function getTutorialsUsing(productSlug: string): Promise<Tutorial[]> {
  return tutorials.filter((t) => t.materials.some((m) => m.product === productSlug));
}

export function levelLabel(id: Level) {
  return levels.find((l) => l.id === id)?.label ?? id;
}
