import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getProduct } from "./catalog";
import { SHOP_CHANNEL } from "./channels";
import { supabaseUrl } from "./supabase/env";
import type { Material, StoredTutorial, Tutorial } from "./tutorials";
import { seedTutorials } from "./tutorials-seed";

// Kho bài hướng dẫn.
// Có SUPABASE_SECRET_KEY → bảng `tutorials` trên Supabase (supabase/migrations/0001_tutorials.sql).
// Chưa có → file data/tutorials.json (chỉ để chạy thử trên máy).

const secretKey = process.env.SUPABASE_SECRET_KEY ?? "";
const FILE = path.join(process.cwd(), "data", "tutorials.json");

type Row = { id: string; slug: string; status: string; data: Tutorial; updated_at: string; published_at: string | null };

let db: SupabaseClient | null = null;
function supabase() {
  if (!supabaseUrl || !secretKey) return null;
  db ??= createClient(supabaseUrl, secretKey, { auth: { persistSession: false } });
  return db;
}

const fromRow = (r: Row): StoredTutorial => ({
  ...r.data,
  id: r.id,
  slug: r.slug,
  status: r.status === "published" ? "published" : "draft",
  updatedAt: r.updated_at,
  publishedAt: r.published_at ?? undefined,
});

function seeded(): StoredTutorial[] {
  const now = new Date().toISOString();
  return seedTutorials.map((t) => ({ ...t, id: randomUUID(), status: "published", updatedAt: now, publishedAt: now }));
}

// Bài lưu trước khi có kênh thì thuộc kênh shop.
const withChannel = (t: StoredTutorial): StoredTutorial => ({ ...t, channel: t.channel || SHOP_CHANNEL });

async function readAll(): Promise<StoredTutorial[]> {
  return (await readRaw()).map(withChannel);
}

async function readRaw(): Promise<StoredTutorial[]> {
  const sb = supabase();
  if (sb) {
    const { data, error } = await sb.from("tutorials").select("*").order("updated_at", { ascending: false });
    if (error) throw new Error(`Không đọc được bài hướng dẫn: ${error.message}`);
    if (data.length) return (data as Row[]).map(fromRow);
    const rows = seeded();
    await Promise.all(rows.map(writeOne));
    return rows;
  }
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as StoredTutorial[];
  } catch {
    const rows = seeded();
    await writeFileAll(rows);
    return rows;
  }
}

async function writeFileAll(rows: StoredTutorial[]) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(rows, null, 2));
}

async function writeOne(t: StoredTutorial) {
  const sb = supabase();
  if (sb) {
    const { id, status, updatedAt, publishedAt, ...data } = t;
    const { error } = await sb.from("tutorials").upsert({
      id, slug: t.slug, status, data, updated_at: updatedAt, published_at: publishedAt ?? null,
    });
    if (error) throw new Error(error.code === "23505" ? "Đường dẫn này đã có bài khác dùng" : error.message);
    return;
  }
  const rows = await readAll();
  const i = rows.findIndex((r) => r.id === t.id);
  if (i >= 0) rows[i] = t;
  else rows.unshift(t);
  await writeFileAll(rows);
}

// ---- Web khách: chỉ bài đã đăng ----

/** Đọc từ bộ nhớ đệm; trang quản trị gọi updateTag(TUTORIALS_TAG) sau mỗi lần lưu. */
export const TUTORIALS_TAG = "tutorials";

export async function getTutorials(): Promise<StoredTutorial[]> {
  "use cache";
  cacheLife("max");
  cacheTag(TUTORIALS_TAG);
  return (await readAll())
    .filter((t) => t.status === "published")
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

// Đọc thẳng kho, không qua getTutorials(): khung dựng sẵn của /huong-dan/[slug]
// giữ kết quả getTutorials() lúc build, bài mới đăng sẽ bị báo 404 lần đầu.
export async function getTutorial(slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag(TUTORIALS_TAG);
  return (await readAll()).find((t) => t.slug === slug && t.status === "published");
}

export async function getChannelTutorials(channel: string) {
  return (await getTutorials()).filter((t) => t.channel === channel);
}

/** Ghép vật liệu của bài với thông tin sản phẩm (giá, còn hàng…). */
export async function getMaterials(tutorial: Tutorial): Promise<Material[]> {
  const rows = await Promise.all(
    tutorial.materials.map(async (m) => {
      const item = await getProduct(m.product);
      return item ? { ...m, item } : null;
    }),
  );
  return rows.filter((m) => m !== null);
}

/** Các bài có dùng sản phẩm này — để gợi ý ở trang sản phẩm. */
export async function getTutorialsUsing(productSlug: string) {
  return (await getTutorials()).filter((t) => t.materials.some((m) => m.product === productSlug));
}

// ---- Trang quản trị: mọi bài ----

export async function listAllTutorials() {
  return (await readAll()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getTutorialById(id: string) {
  return (await readAll()).find((t) => t.id === id);
}

export async function saveTutorial(t: Tutorial & { id?: string; status: StoredTutorial["status"] }) {
  const all = await readAll();
  if (all.some((x) => x.slug === t.slug && x.id !== t.id)) throw new Error("Đường dẫn này đã có bài khác dùng");
  const old = t.id ? all.find((x) => x.id === t.id) : undefined;
  const now = new Date().toISOString();
  const row: StoredTutorial = {
    ...t,
    id: old?.id ?? randomUUID(),
    updatedAt: now,
    publishedAt: t.status === "published" ? (old?.publishedAt ?? now) : old?.publishedAt,
  };
  await writeOne(row);
  return row;
}

export async function deleteTutorial(id: string) {
  const sb = supabase();
  if (sb) {
    const { error } = await sb.from("tutorials").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  await writeFileAll((await readAll()).filter((t) => t.id !== id));
}
