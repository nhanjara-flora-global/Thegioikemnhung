-- Bài hướng dẫn (video + bước làm + nguyên liệu). Trang quản trị ghi bằng SUPABASE_SECRET_KEY.
create table if not exists public.tutorials (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  data jsonb not null,
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

alter table public.tutorials enable row level security;

-- Khách (publishable key) chỉ đọc được bài đã đăng.
create policy "Đọc bài đã đăng" on public.tutorials
  for select using (status = 'published');
