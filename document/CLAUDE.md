# Design system: Kẽm Nhung

Website hướng dẫn làm đồ handmade bằng kẽm nhung và bán set DIY / phụ kiện. Mọi giao diện phải dùng design system trong `design-system/`.

## Bản đang dùng

**`design-system/pop/`** (Kẽm Nhung Pop — màu kẹo rực rỡ, tiêu đề Baloo 2).
Bản thay thế: `design-system/pastel/` (pastel, tiêu đề Quicksand). Để đổi, thay `pop` bằng `pastel` ở dòng trên và trong các import. Không trộn hai bản.

Trước khi viết UI, đọc:
1. `design-system/pop/README.md` — nguyên tắc, màu, chữ, giọng văn, bản đồ trang.
2. `design-system/pop/components/<Tên>.md` — cấu trúc HTML và quy tắc của component cần dùng.
3. `design-system/pop/examples/<Tên>.html` — markup mẫu chạy được (mở `examples/index.html` trên trình duyệt để xem tất cả).

## Cài vào trang

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="/design-system/pop/tokens.css">
<link rel="stylesheet" href="/design-system/pop/components.css"> <!-- đã @import Google Fonts -->
<body class="kn">
```
Với React/Vue/Next: import hai file CSS trên một lần ở layout gốc, rồi dùng đúng các class `kn-*` (dùng `className` trong JSX).

## Quy tắc bắt buộc

- **Chỉ dùng token**: màu `var(--pink-600)`, khoảng cách `var(--space-4)`, bo góc `var(--radius-lg)`, bóng `var(--shadow-soft)`, font `var(--font-display|sans|hand)`. Không viết mã màu hex, px tuỳ ý hay font khác. Thiếu token thì hỏi trước, đừng tự tạo.
- **Tái sử dụng component có sẵn** (class tiền tố `kn-`): Button, Tag, KitCard, TutorialCard, MaterialList, StemCalculator, CommunityPost, TipNote. Khi chuyển sang React/Vue, giữ nguyên tên class và cấu trúc HTML trong `examples/`.
- **Màu hồng đậm `--pink-600` chỉ dùng cho hành động mua hàng** (Mua ngay, Thêm vào giỏ, Thanh toán). Mỗi màn hình một nút primary.
- **Nghĩa màu cố định**: Người mới = xanh, Trung bình = cam (pop) / vàng (pastel), Nâng cao = tím, Bán chạy & Mẹo nhỏ = vàng, lỗi = `--danger`.
- **Tương phản**: trên nền màu bậc -300/-400 chỉ đặt chữ `--ink`; chữ trắng chỉ trên `--pink-600`; `--ink-muted` chỉ trên nền trắng, nền giấy và nền -100.
- **Cỡ chữ**: nội dung 18px, không chữ nào dưới 14px; vùng bấm tối thiểu 44px. Dùng class `.text-*` trong `tokens.css` hoặc đúng giá trị của nó.
- **Mỗi video hướng dẫn phải kèm nút "Mua nguyên liệu làm [Tên sản phẩm]"**.
- **Giọng văn**: tiếng Việt, thân mật, xưng "bạn"; nút = động từ + đối tượng, viết hoa chữ đầu; giá dạng `149.000₫`.
- **Ảnh/video thật là trung tâm**; SVG minh hoạ trong `examples/` chỉ là placeholder.
- Font Google: Baloo 2 / Quicksand, Nunito, Mali — đều có dấu tiếng Việt; không đổi font.

## Sửa design system

Nguồn gốc là `tokens.json`. `tokens.css` sinh từ đó — nếu đổi token, sửa cả hai cho khớp (hoặc viết script sinh lại). Component nằm trong `components.css`; thêm component mới thì thêm cả `components/<Tên>.md` và `examples/<Tên>.html`.
