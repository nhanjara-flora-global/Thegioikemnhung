# MaterialList

Danh sách vật liệu của một bài hướng dẫn, mua tất cả bằng một cú bấm ("Mua theo công thức").

## Hành vi
- Mọi vật liệu được chọn sẵn. Bỏ chọn món đã có ở nhà → tạm tính cập nhật, nhãn nút đổi thành "Thêm N món vào giỏ".
- Bỏ chọn hết → nút `disabled`.
- Mỗi dòng: checkbox (`kn-check`, viền `border` 3:1), mẫu màu sợi (`kn-swatch`, màu qua `color`), tên + quy cách, giá.

## Người dùng cung cấp
- Danh sách SKU của bài, số lượng đã nhân theo StemCalculator nếu có.
- Giá đã định dạng `vi-VN` với ký hiệu `₫` liền sau số.

## Vị trí
Desktop: cột phải, dính (`position: sticky`) cạnh video. Mobile: ngay dưới video, trước các bước làm.
