import "./yt.css";
import { SiteShell } from "@/components/yt/SiteShell";
import { getChannels } from "@/lib/channels-data";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteShell channels={await getChannels()}>{children}</SiteShell>;
}
