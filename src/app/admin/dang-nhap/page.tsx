import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { site } from "@/lib/site";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Đăng nhập" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin/bai-viet");
  return (
    <main className="ad-login">
      <div className="ad-card ad-login__card">
        <h1 className="kn-h3">{site.name}</h1>
        <p className="kn-muted">Đăng nhập trang quản trị</p>
        <LoginForm />
      </div>
    </main>
  );
}
