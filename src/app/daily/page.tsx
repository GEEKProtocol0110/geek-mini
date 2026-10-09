import type { Metadata } from "next";
import { GameClient } from "../../components/GameClient";

export const metadata: Metadata = { title: "Daily Challenge", description: "Play five Kaspa questions shared each UTC day. Review answers and primary sources, then share your challenge.", alternates: { canonical: "/daily" }, openGraph: { title: "Geek Mini · Daily Challenge", description: "Play five Kaspa questions shared each UTC day. Review answers and primary sources, then share your challenge.", url: "/daily", type: "website", siteName: "Geek Mini", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Geek Mini · Learn Kaspa. Pass it on." }] }, twitter: { title: "Geek Mini · Daily Challenge", description: "Play five Kaspa questions shared each UTC day. Review answers and primary sources, then share your challenge.", card: "summary_large_image", images: ["/opengraph-image"] } };

export default function DailyPage() {
  return <GameClient mode="daily" />;
}
