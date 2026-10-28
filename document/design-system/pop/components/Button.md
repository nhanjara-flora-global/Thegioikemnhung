# Button

Nút bo tròn dạng viên thuốc cho mọi hành động; mỗi màn hình chỉ có một nút `primary`.

## Biến thể
| Class | Khi nào dùng |
|---|---|
| `kn-btn--primary` | Hành động ra tiền: **Mua ngay nguyên liệu**, **Thêm vào giỏ**, **Thanh toán**. Nền `pink-600`, chữ `surface` (5.1:1). |
| `kn-btn--soft` | Hành động phụ cạnh primary: Xem hướng dẫn, Lưu mẫu. |
| `kn-btn--mint` | Lối vào cho người mới: **Bắt đầu ngay**, Đăng ảnh khoe. |
| `kn-btn--ghost` | Điều hướng nhẹ: Xem tất cả, Huỷ. Viền `border` 3:1. |

Kích thước: mặc định cao 52px, chữ 17px; `kn-btn--sm` cao 44px (vùng chạm tối thiểu), chữ 16px, dùng trong thẻ. `kn-btn--block` cho nút full-width trên mobile.

## Dùng
```html
<button class="kn-btn kn-btn--primary">Mua ngay nguyên liệu</button>
```
- Nhãn là động từ + đối tượng, viết hoa chữ đầu: "Thêm vào giỏ", không "THÊM VÀO GIỎ".
- Trạng thái hết hàng: thuộc tính `disabled` và đổi nhãn thành "Hết hàng".
- Bọc trong phần tử có class `kn` để có font và màu chữ.
