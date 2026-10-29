-- Kênh đăng bài hướng dẫn. Trang quản trị ghi bằng SUPABASE_SECRET_KEY.
create table if not exists public.channels (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.channels enable row level security;

create policy "Ai cũng xem được kênh" on public.channels for select using (true);
