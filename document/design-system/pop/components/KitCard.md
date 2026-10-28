# KitCard

Thẻ sản phẩm cho Set DIY và phụ kiện lẻ; ảnh thật là trung tâm, giá và nút mua ở đáy.

## Cấu trúc
`article.kn-card` → `.kn-media` (ảnh 4:3, huy hiệu góc trên trái) → `.kn-card__body`: tag cấp độ, tên (`kn-h3`), nội dung set (`kn-muted`), hàng giá + nút.

## Người dùng cung cấp
- Ảnh sản phẩm thật, nền sáng, chụp từ trên xuống: `<img>` trong `.kn-media` (placeholder SVG trong preview chỉ để minh hoạ).
- Nội dung set ngắn gọn một dòng, đếm số lượng cụ thể ("27 sợi kẽm"), không viết "nhiều vật liệu".

## Quy tắc
- Giá giảm: giá mới `kn-price`, giá cũ `kn-kit__old` gạch ngang.
- Lưới: `minmax(240px, 1fr)`, gutter `space-6`; 2 cột trên mobile với gutter `space-4`.
- Phụ kiện lẻ (kìm, súng keo, nhị hoa) bỏ tag cấp độ.
