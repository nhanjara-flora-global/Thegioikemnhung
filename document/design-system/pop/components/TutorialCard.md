# TutorialCard

Thẻ video hướng dẫn dạng dọc (TikTok/Reels), luôn kèm nút mua nguyên liệu của đúng mẫu đó.

## Quy tắc bắt buộc
- **Mỗi thẻ hướng dẫn có một nút primary "Mua nguyên liệu làm [Tên sản phẩm]"** ngay dưới video, full-width. Nút dẫn tới MaterialList của bài.
- Tag cấp độ ở góc trên trái, thời lượng ở góc dưới phải trên nền `ink`.
- Nút play có `aria-label` nêu tên bài.

## Người dùng cung cấp
- Thumbnail khung dọc 3:4 (`.kn-media--video`), hoặc nhúng `<video muted playsinline>` / iframe YouTube Shorts, TikTok thay cho placeholder.
- Số bước và thời gian làm ước tính.

## Bố cục Tutorial Hub
Hàng bộ lọc cấp độ + chủ đề dùng `kn-seg` ở trên, lưới thẻ `minmax(220px, 1fr)` bên dưới; trên mobile cho cuộn ngang dạng băng chuyền.
