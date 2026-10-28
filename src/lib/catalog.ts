// Dữ liệu sản phẩm. Hiện là dữ liệu mẫu (giá mẫu) — khi nối Supabase chỉ cần thay thân các hàm get*.

export type Category = "kem-nhung" | "dung-cu" | "phu-kien";

export const categories: { id: Category; label: string }[] = [
  { id: "kem-nhung", label: "Kẽm nhung" },
  { id: "dung-cu", label: "Dụng cụ" },
  { id: "phu-kien", label: "Phụ kiện" },
];

export type Product = {
  slug: string;
  name: string;
  category: Category;
  /** Quy cách bán, ghi số lượng cụ thể: "Bó 100 sợi, dài 30cm". */
  spec: string;
  /** Đơn vị bán: bó, túi, cái, cuộn, xấp. */
  sellUnit: string;
  /** Một đơn vị bán chứa bao nhiêu món nhỏ — để bài hướng dẫn tính số bó cần mua. */
  pack?: { size: number; unit: string };
  price: number;
  oldPrice?: number;
  /** Màu sợi (mã màu) — chỉ cho kẽm nhung, dùng vẽ mẫu màu. */
  color?: string;
  /** Link ảnh có sẵn trên mạng; để trống thì hiện hình minh hoạ. */
  imageUrl?: string;
  inStock: boolean;
  bestSeller?: boolean;
  description?: string;
};

const wire = { sellUnit: "bó", pack: { size: 100, unit: "sợi" } };

const products: Product[] = [
  {
    slug: "kem-nhung-hong-phan",
    name: "Kẽm nhung hồng phấn",
    category: "kem-nhung",
    spec: "Bó 100 sợi, dài 30cm, sợi 6mm",
    ...wire,
    price: 25000,
    color: "#ff9cc2",
    inStock: true,
    bestSeller: true,
    description: "Màu hồng phấn dịu, hợp làm tulip, hoa hồng và thỏ mini.",
  },
  {
    slug: "kem-nhung-tim-oai-huong",
    name: "Kẽm nhung tím oải hương",
    category: "kem-nhung",
    spec: "Bó 100 sợi, dài 30cm, sợi 6mm",
    ...wire,
    price: 25000,
    color: "#a978ff",
    inStock: true,
    bestSeller: true,
    description: "Màu được chọn nhiều nhất cho tulip và hoa lan.",
  },
  {
    slug: "kem-nhung-xanh-la",
    name: "Kẽm nhung xanh lá",
    category: "kem-nhung",
    spec: "Bó 100 sợi, dài 30cm, sợi 6mm",
    ...wire,
    price: 25000,
    color: "#2ed482",
    inStock: true,
    description: "Dùng làm lá và cành cho mọi loại hoa.",
  },
  {
    slug: "kem-nhung-vang-chanh",
    name: "Kẽm nhung vàng chanh",
    category: "kem-nhung",
    spec: "Bó 100 sợi, dài 30cm, sợi 6mm",
    ...wire,
    price: 25000,
    color: "#ffd43b",
    inStock: true,
  },
  {
    slug: "kem-nhung-trang",
    name: "Kẽm nhung trắng",
    category: "kem-nhung",
    spec: "Bó 100 sợi, dài 30cm, sợi 6mm",
    ...wire,
    price: 25000,
    color: "#f4f1ee",
    inStock: false,
  },
  {
    slug: "kim-cat-kem",
    name: "Kìm cắt kẽm mini",
    category: "dung-cu",
    spec: "1 cái, dài 12cm",
    sellUnit: "cái",
    price: 35000,
    oldPrice: 45000,
    inStock: true,
    bestSeller: true,
    description: "Cắt gọn sợi kẽm nhung, cán bọc cao su êm tay.",
  },
  {
    slug: "sung-ban-keo",
    name: "Súng bắn keo nến",
    category: "dung-cu",
    spec: "1 cái, 20W, kèm 5 thanh keo",
    sellUnit: "cái",
    price: 65000,
    inStock: true,
  },
  {
    slug: "nhi-hoa-vang",
    name: "Nhị hoa vàng",
    category: "phu-kien",
    spec: "Túi 50 nhị",
    sellUnit: "túi",
    pack: { size: 50, unit: "nhị" },
    price: 15000,
    inStock: true,
    bestSeller: true,
  },
  {
    slug: "bang-keo-quan-canh",
    name: "Băng keo quấn cành xanh lá",
    category: "phu-kien",
    spec: "Cuộn 27m, bản 1,2cm",
    sellUnit: "cuộn",
    price: 10000,
    inStock: true,
    description: "Quấn quanh cành cho gọn và giữ các bông dính vào nhau.",
  },
  {
    slug: "ruy-bang-lua",
    name: "Ruy băng lụa",
    category: "phu-kien",
    spec: "Cuộn 10m, bản 2,5cm",
    sellUnit: "cuộn",
    price: 12000,
    inStock: true,
  },
  {
    slug: "giay-goi-hoa",
    name: "Giấy gói hoa Hàn Quốc",
    category: "phu-kien",
    spec: "Xấp 10 tờ, 58×58cm",
    sellUnit: "xấp",
    price: 20000,
    inStock: true,
  },
];

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getBestSellers(): Promise<Product[]> {
  return products.filter((p) => p.bestSeller);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export function categoryLabel(id: Category) {
  return categories.find((c) => c.id === id)?.label ?? id;
}

/** Giá dạng 149.000₫ (dấu chấm phân cách nghìn, ₫ liền sau). */
export function formatPrice(value: number) {
  return `${value.toLocaleString("vi-VN")}₫`;
}
