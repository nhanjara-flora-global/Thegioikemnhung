import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { seedChannels, type Channel } from "./channels";
import { supabaseUrl } from "./supabase/env";

// Kho kênh — cùng cách lưu với tutorials-data.ts: bảng `channels` trên Supabase, hoặc file data/channels.json.

export const CHANNELS_TAG = "channels";

const secretKey = process.env.SUPABASE_SECRET_KEY ?? "";
const FILE = path.join(process.cwd(), "data", "channels.json");

let db: SupabaseClient | null = null;
function supabase() {
  if (!supabaseUrl || !secretKey) return null;
  db ??= createClient(supabaseUrl, secretKey, { auth: { persistSession: false } });
  return db;
}

async function readAll(): Promise<Channel[]> {
  const sb = supabase();
  if (sb) {
    const { data, error } = await sb.from("channels").select("id, data").order("created_at");
    if (error) throw new Error(`Không đọc được kênh: ${error.message}`);
    if (data.length) return data.map((r) => ({ ...(r.data as Channel), id: r.id as string }));
    await Promise.all(seedChannels.map(writeOne));
    return seedChannels;
  }
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Channel[];
  } catch {
    await writeFileAll(seedChannels);
    return seedChannels;
  }
}

async function writeFileAll(rows: Channel[]) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(rows, null, 2));
}

async function writeOne(c: Channel) {
  const sb = supabase();
  if (sb) {
    const { id, ...data } = c;
    const { error } = await sb.from("channels").upsert({ id, data });
    if (error) throw new Error(error.message);
    return;
  }
  const rows = await readAll();
  const i = rows.findIndex((r) => r.id === c.id);
  if (i >= 0) rows[i] = c;
  else rows.push(c);
  await writeFileAll(rows);
}

export async function getChannels(): Promise<Channel[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CHANNELS_TAG);
  return readAll();
}

export async function getChannel(id: string) {
  "use cache";
  cacheLife("max");
  cacheTag(CHANNELS_TAG);
  return (await readAll()).find((c) => c.id === id);
}

/** Trang quản trị: đọc thẳng, không qua bộ nhớ đệm. */
export const listAllChannels = readAll;

export async function saveChannel(c: Channel, isNew: boolean) {
  const all = await readAll();
  if (isNew && all.some((x) => x.id === c.id)) throw new Error("Mã kênh này đã có");
  if (all.some((x) => x.handle === c.handle && x.id !== c.id)) throw new Error(`@${c.handle} đã có kênh khác dùng`);
  await writeOne(c);
}

export async function deleteChannel(id: string) {
  const sb = supabase();
  if (sb) {
    const { error } = await sb.from("channels").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  await writeFileAll((await readAll()).filter((c) => c.id !== id));
}
