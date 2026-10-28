# Kẽm Nhung

Design system cho website hướng dẫn và bán set DIY kẽm nhung handmade: pastel ngọt ngào trên nền trắng, chữ bo tròn, ảnh và video thật làm trung tâm.

> Tên "Kẽm Nhung" là tên tạm — đổi thành tên thương hiệu thật khi có. Bản đầu tiên chỉ có theme sáng, chưa có logo và icon.

## Nguyên tắc

1. **Sản phẩm là nhân vật chính.** Giao diện lùi lại bằng nền kem `cream-50` và thẻ trắng `surface`, để sắc màu rực rỡ của sợi kẽm nhung trong ảnh/video nổi lên. Không đặt hoạ tiết hay màu đậm cạnh ảnh sản phẩm.
2. **Mềm như sợi nhung.** Mọi thứ bấm được là viên thuốc (`radius-pill`); thẻ bo `radius-lg`; bóng đổ nhẹ ánh hồng (`shadow-soft`). Không góc vuông, không viền đen.
3. **Từ cảm hứng đến giỏ hàng trong một bước.** Mỗi video hướng dẫn luôn đi kèm nút mua nguyên liệu; danh sách vật liệu mua được bằng một cú bấm.
4. **Người mới cũng làm được.** Cấp độ luôn hiển thị (Người mới / Trung bình / Nâng cao); số lượng cụ thể ("27 sợi"), không mơ hồ.

## Giọng văn

Thân mật, khích lệ, ngắn gọn — như một người bạn khéo tay. Xưng "bạn", tránh thuật ngữ.

| Nên | Không nên |
|---|---|
| Bạn muốn làm bó mấy bông? | Vui lòng nhập số lượng sản phẩm |
| Mua nguyên liệu làm tulip | Đặt hàng |
| Làm xong rồi? Khoe ngay để nhận 20 điểm! | Upload ảnh để tích luỹ điểm thưởng |

Nút: động từ + đối tượng, viết hoa chữ đầu câu. Giá: `149.000₫` (dấu chấm phân cách nghìn, ₫ liền sau).

## Màu sắc

Ý tưởng: **"tiệm len sữa dâu"** — nền kem sữa ấm như giấy kraft, các khối pastel như những bó kẽm nhung xếp trên kệ, chữ nâu socola thay cho đen. Giao diện dịu để ảnh sản phẩm (vốn rất rực) là thứ rực nhất trên trang.

Bốn tông pastel theo brief — **hồng phấn, be kem (len mộc), xanh mint, vàng bơ** — thêm **tím oải hương**, màu kẽm nhung phổ biến nhất cho tulip và lan. Mỗi tông có ba bậc:

- **-100** (`pink-100`, `mint-100`, `butter-100`, `lilac-100`, `beige-200`): nền tag, nền khối thông tin. Đặt được `ink` và `ink-muted`.
- **-300** (`pink-300`, `mint-300`, `butter-300`, `lilac-300`): khối nhận diện, minh hoạ, banner. **Chỉ đặt chữ `ink`.**
- **Bậc đậm** (`pink-600`/`pink-700`, `mint-700`, `butter-800`, `lilac-700`): chữ và nút.

Mỗi màu một nghĩa, không chồng lấn:

| Màu | Nghĩa |
|---|---|
| `pink-600` dâu chín | **Chỉ** cho hành động mua hàng. Thấy màu này là biết bấm để mua. |
| mint | Người mới, thành công, còn hàng, điểm thưởng |
| vàng bơ | Trung bình, Bán chạy, Mẹo nhỏ |
| tím oải hương | Nâng cao, góc Cộng đồng |
| `danger` | Lỗi, Hết hàng |

Tương phản đã kiểm (WCAG AA): `ink` trên mọi nền ≥ 7.7:1; `ink-muted` trên `surface`/`cream-50`/nền -100 ≥ 4.6:1; chữ trắng trên `pink-600` 5:1; `border` trên `surface` 3.2:1.

## Chữ

Ý tưởng: **chữ như sợi kẽm uốn.**

- **Quicksand** (`--font-display`) — tiêu đề, đậm 700. Nét đều một độ dày, đầu nét tròn, đường cong mở — y như một sợi kẽm nhung được uốn thành chữ. Chỉ dùng từ 24px trở lên (ở cỡ nhỏ nét hơi mảnh).
- **Nunito** (`--font-sans`) — nội dung, nút, giá. Cũng bo tròn đầu nét nhưng đậm đặc hơn, rất dễ đọc ở 16–18px, số liệu rõ ràng.
- **Mali** (`--font-hand`) — điểm nhấn viết tay: Mẹo nhỏ, lời nhắn thiệp, sticker. Tối đa một câu, không bao giờ cho nút, giá hay đoạn văn dài.

Cả ba từ Google Fonts, hỗ trợ đầy đủ dấu tiếng Việt:
```html
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Nunito:wght@400;600;700;800&family=Mali:wght@500;600&display=swap" rel="stylesheet">
```
Thang chữ (cỡ lớn, dễ đọc cho mọi lứa tuổi): `display` 64 · `h1` 48 · `h2` 34 · `h3` 24 · `body` 18 · `body-sm` 16 · `label` 16 đậm · `price` 22 rất đậm · `caption` 14 · `note` 20 viết tay. Không có chữ nào dưới 14px. Trên mobile hạ `display` xuống 44px, `h1` xuống 34px, `h2` xuống 28px; `body` giữ 18px.

## Hoạ tiết: đường chỉ khâu

Viền nét đứt (`2px dashed`) màu -300 hoặc `line`, đặt lùi vào trong khối — như đường khâu trên túi vải. Dùng cho TipNote, đường kẻ tổng tiền, khung "Kéo ảnh vào đây". Không dùng cho thẻ sản phẩm.

## Khoảng cách, bo góc, bóng

Lưới 4px: `space-1` 4 → `space-16` 64. Thẻ padding `space-4`; gutter lưới `space-6` (desktop) / `space-4` (mobile); khoảng giữa các khu vực `space-16` / `space-12`.
Bo góc: `radius-sm` 8 checkbox · `radius-md` 14 ô nhập, ảnh · `radius-lg` 22 thẻ · `radius-pill` nút, tag.
Bóng: `shadow-soft` khi nghỉ, `shadow-lift` khi hover (kèm nhích lên 2px).

## Hình ảnh & video

- Ảnh sản phẩm: chụp sáng, nền trắng hoặc kem, ánh sáng tự nhiên; tỉ lệ 4:3 (thẻ), 1:1 (cộng đồng), 3:4 dọc (video).
- Banner trang chủ: video 5–10 giây, tự phát, `muted loop playsinline`, có ảnh poster; chữ tiêu đề đặt trên khối `cream-50` cạnh video, không đè lên video.
- Placeholder trong preview (cuống hình viên thuốc + đầu hoa tròn) chỉ để minh hoạ — thay bằng ảnh thật.

## Bản đồ trang → component

| Trang | Khối chính | Component |
|---|---|---|
| Trang chủ | Banner video, "Bắt đầu ngay", Set DIY bán chạy, Thành phẩm cộng đồng | Button (mint, primary), KitCard, CommunityPost |
| Tutorial Hub | Lọc theo cấp độ & chủ đề, lưới video | Tag, TutorialCard |
| Bài hướng dẫn | Video + vật liệu + tính số lượng + mẹo | TutorialCard, MaterialList, StemCalculator, TipNote |
| Cửa hàng | Set DIY, phụ kiện lẻ (kẽm, kìm, súng keo, nhị hoa, ruy băng) | KitCard, Tag |
| Góc khoe | Đăng ảnh, điểm thưởng | CommunityPost, Button (mint) |

## Dùng trong code

Component viết bằng CSS thuần (tiền tố `kn-`), không phụ thuộc framework. Nạp `tokens.css`, rồi `components/bundle.css` (đã `@import` Google Fonts), bọc trang trong `class="kn"`. Xem từng component để biết cấu trúc HTML.
