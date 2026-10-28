import type { Metadata } from "next";
import { Baloo_2, Mali, Nunito } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/site";
import "@/styles/kn/tokens.css";
import "@/styles/kn/components.css";
import "./globals.css";

// Font theo design system pop; tokens.css đọc qua --font-baloo / --font-nunito / --font-mali.
const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
});
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800"],
});
const mali = Mali({
  variable: "--font-mali",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: "Kẽm nhung đủ màu, dụng cụ và phụ kiện làm đồ handmade.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${baloo.variable} ${nunito.variable} ${mali.variable}`}>
      <body className="kn">
        <SiteHeader />
        <main className="site-main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
