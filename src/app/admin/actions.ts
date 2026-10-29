"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { checkLogin, endSession, requireAdmin, startSession } from "@/lib/admin-auth";
import { getProduct } from "@/lib/catalog";
import { channelColors, SHOP_CHANNEL, type Channel } from "@/lib/channels";
import { CHANNELS_TAG, deleteChannel, listAllChannels, saveChannel } from "@/lib/channels-data";
import { levels, slugify, tutorialChecks, type Tutorial, type TutorialStatus } from "@/lib/tutorials";
import { deleteTutorial, listAllTutorials, saveTutorial, TUTORIALS_TAG } from "@/lib/tutorials-data";
import { parseVideo } from "@/lib/video";

export type LoginState = { error: string; username: string };

export async function loginAction(_: LoginState, form: FormData): Promise<LoginState> {
  const username = String(form.get("username") ?? "");
  if (!checkLogin(username, String(form.get("password") ?? ""))) {
    // Trả lại tên đăng nhập: form tự xoá ô sau mỗi lần gửi.
    return { error: "Sai tên đăng nhập hoặc mật khẩu", username };
  }
  await startSession();
  redirect("/admin/bai-viet");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/dang-nhap");
}

export type SaveInput = Tutorial & { id?: string; status: TutorialStatus };
export type SaveResult = { ok: true; id: string; updatedAt: string; publishedAt?: string } | { ok: false; error: string };

const text = (v: unknown, max = 500) => String(v ?? "").trim().slice(0, max);

/** Làm sạch dữ liệu từ trình soạn bài — không tin dữ liệu gửi lên. */
async function clean(input: SaveInput): Promise<SaveInput> {
  const materials: Tutorial["materials"] = [];
  for (const m of input.materials ?? []) {
    if (!(await getProduct(String(m.product)))) continue;
    const note = text(m.note, 120) || undefined;
    if ("perFlower" in m) materials.push({ product: m.product, note, perFlower: Math.max(1, Math.min(99, Math.round(Number(m.perFlower)) || 1)) });
    else materials.push({ product: m.product, note, fixed: Math.max(1, Math.min(99, Math.round(Number(m.fixed)) || 1)) });
  }
  const steps = (input.steps ?? []).map((s) => text(s, 600)).filter(Boolean);
  return {
    id: input.id ? text(input.id, 64) : undefined,
    status: input.status === "published" ? "published" : "draft",
    slug: text(input.slug, 80),
    title: text(input.title, 120),
    channel: (await listAllChannels()).some((c) => c.id === input.channel) ? input.channel : SHOP_CHANNEL,
    flowerName: text(input.flowerName, 60),
    level: levels.some((l) => l.id === input.level) ? input.level : "beginner",
    videoUrl: text(input.videoUrl, 300) || undefined,
    thumbnailUrl: text(input.thumbnailUrl, 500) || undefined,
    duration: text(input.duration, 10) || undefined,
    makeTime: text(input.makeTime, 40),
    defaultFlowers: Math.max(1, Math.min(99, Math.round(Number(input.defaultFlowers)) || 1)),
    summary: text(input.summary, 600),
    steps,
    tips: (input.tips ?? [])
      .map((t) => ({ afterStep: Math.round(Number(t.afterStep)), text: text(t.text, 300) }))
      .filter((t) => t.text && t.afterStep >= 1 && t.afterStep <= steps.length)
      .slice(0, 3),
    materials,
  };
}

export async function saveTutorialAction(input: SaveInput): Promise<SaveResult> {
  await requireAdmin();
  const t = await clean(input);
  if (t.status === "published") {
    const missing = tutorialChecks(t, Boolean(parseVideo(t.videoUrl))).filter((c) => c.required && !c.ok);
    if (missing.length) return { ok: false, error: `Chưa đăng được: ${missing.map((c) => c.label).join("; ")}` };
  } else if (!t.slug) {
    return { ok: false, error: "Cần tiêu đề hoặc đường dẫn để lưu nháp" };
  }
  try {
    const row = await saveTutorial(t);
    updateTag(TUTORIALS_TAG);
    return { ok: true, id: row.id, updatedAt: row.updatedAt, publishedAt: row.publishedAt };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Lưu không được" };
  }
}

export async function deleteTutorialAction(id: string) {
  await requireAdmin();
  await deleteTutorial(id);
  updateTag(TUTORIALS_TAG);
  redirect("/admin/bai-viet");
}

export async function saveChannelAction(input: Channel & { isNew?: boolean }): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  await requireAdmin();
  const name = text(input.name, 60);
  if (!name) return { ok: false, error: "Cần tên kênh" };
  const id = input.isNew ? slugify(text(input.id) || name) : text(input.id, 80);
  const c: Channel = {
    id,
    name,
    handle: slugify(text(input.handle) || name).replace(/-/g, ""),
    description: text(input.description, 300),
    color: channelColors.includes(input.color) ? input.color : "pink",
  };
  if (!c.id || !c.handle) return { ok: false, error: "Tên kênh cần có chữ hoặc số" };
  try {
    await saveChannel(c, Boolean(input.isNew));
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Lưu không được" };
  }
  updateTag(CHANNELS_TAG);
  return { ok: true, id: c.id };
}

export async function deleteChannelAction(id: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  if (id === SHOP_CHANNEL) return { ok: false, error: "Không xoá được kênh chính của shop" };
  const used = (await listAllTutorials()).filter((t) => t.channel === id).length;
  if (used) return { ok: false, error: `Kênh còn ${used} bài — chuyển bài sang kênh khác trước` };
  await deleteChannel(id);
  updateTag(CHANNELS_TAG);
  return { ok: true };
}
