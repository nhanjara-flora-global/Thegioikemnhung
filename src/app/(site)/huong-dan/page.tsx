import { permanentRedirect } from "next/navigation";

// Danh sách hướng dẫn nay nằm ở trang chủ.
export default function TutorialsPage() {
  permanentRedirect("/");
}
