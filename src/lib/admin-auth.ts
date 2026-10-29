import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

// Đăng nhập trang quản trị bằng 1 tài khoản đặt trong .env.local
// (ADMIN_USERNAME / ADMIN_PASSWORD, mặc định admin / admin — nhớ đổi trước khi chạy thật).

const COOKIE = "kn_admin";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 ngày

const username = process.env.ADMIN_USERNAME || "admin";
const password = process.env.ADMIN_PASSWORD || "admin";
const secret = process.env.ADMIN_SECRET || `kn:${username}:${password}`;

const sign = (value: string) => createHmac("sha256", secret).update(value).digest("base64url");

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkLogin(user: string, pass: string) {
  // So cả hai để không lộ là sai tên hay sai mật khẩu.
  return same(user.trim(), username) && same(pass, password);
}

export async function startSession() {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  await connection(); // luôn kiểm lúc có request, không dựng sẵn
  const [exp, sig] = (await cookies()).get(COOKIE)?.value.split(".") ?? [];
  return Boolean(exp && sig && same(sig, sign(exp)) && Number(exp) * 1000 > Date.now());
}

/** Gọi đầu mỗi trang / action quản trị. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/dang-nhap");
}
