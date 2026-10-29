import type { Metadata } from "next";
import "./admin.css";

// Trang quản trị luôn đọc dữ liệu mới, không cần dựng sẵn.
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Quản trị", template: "%s · Quản trị" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="ad">{children}</div>;
}
