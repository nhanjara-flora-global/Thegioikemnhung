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
