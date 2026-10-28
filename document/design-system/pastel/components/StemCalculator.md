# StemCalculator

Bộ tính số lượng: khách chọn số bông, hệ thống nhân định mức vật liệu và làm tròn lên theo bó bán.

## Cấu trúc
- Chọn nhanh: `kn-seg` (nút viên thuốc, `aria-pressed` cho lựa chọn hiện tại) với 3 / 9 / 20 / 99 bông — các số người Việt hay tặng.
- Tự chọn: `kn-stepper` (1–199), số hiển thị trong `<output aria-live="polite">`.
- Kết quả: khối `mint-100`, mỗi dòng "định mức → số sợi → số bó".
- CTA primary nêu số lượng: "Thêm nguyên liệu cho 9 bông".

## Người dùng cung cấp
- Định mức mỗi bông cho từng vật liệu (từ dữ liệu bài hướng dẫn) và quy cách bó bán (mặc định 10 sợi/bó).
- Số lượng tính xong đổ vào MaterialList.
