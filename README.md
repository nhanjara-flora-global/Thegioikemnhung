# Thế Giới Kem Nhung

Next.js 16 (App Router, TypeScript) + Supabase.

## Chạy

```bash
cp .env.example .env.local   # điền URL + publishable key của Supabase
npm install
npm run dev                  # http://localhost:3000
npm run build                # kiểm tra build production
```

Chưa điền `.env.local` thì web vẫn chạy, chỉ chưa nối Supabase.

## Supabase

| File | Dùng ở đâu |
|---|---|
| `src/lib/supabase/client.ts` | Client Component (`'use client'`) |
| `src/lib/supabase/server.ts` | Server Component, Server Action, Route Handler |
| `src/lib/supabase/proxy.ts` + `src/proxy.ts` | Làm mới phiên đăng nhập ở mỗi request |

Bảng mới tạo trong Supabase phải bật Row Level Security.

## Trang quản trị

`/admin` — đăng nhập bằng `ADMIN_USERNAME` / `ADMIN_PASSWORD` trong `.env.local` (chưa đặt thì là `admin` / `admin`; nhớ đổi và đặt `ADMIN_SECRET` trước khi chạy thật).

- **Bài hướng dẫn** (`/admin/bai-viet`): viết / sửa / đăng / gỡ / xoá bài — video, bước làm + mẹo, nguyên liệu lấy từ cửa hàng, danh sách kiểm tra trước khi đăng.
- Nơi lưu bài: có `SUPABASE_SECRET_KEY` → bảng `tutorials` (chạy `supabase/migrations/0001_tutorials.sql` trong SQL Editor trước); chưa có → file `data/tutorials.json` (chỉ để thử trên máy, không dùng khi deploy Vercel). Kho trống thì tự nạp 3 bài mẫu.
