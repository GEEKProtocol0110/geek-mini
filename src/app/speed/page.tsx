import type { Metadata } from "next";
import { GameClient } from "../../components/GameClient";

export const metadata: Metadata = { title: "Speed Round", description: "Start when ready: ten Kaspa questions in 30 seconds. Review your answers and share a free Speed Round.", alternates: { canonical: "/speed" }, openGraph: { title: "Geek Mini · Speed Round", description: "Start when ready: ten Kaspa questions in 30 seconds. Review your answers and share a free Speed Round.", url: "/speed", type: "website", siteName: "Geek Mini", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Geek Mini · Learn Kaspa. Pass it on." }] }, twitter: { title: "Geek Mini · Speed Round", description: "Start when ready: ten Kaspa questions in 30 seconds. Review your answers and share a free Speed Round.", card: "summary_large_image", images: ["/opengraph-image"] } };

export default function SpeedPage() {
  return <GameClient mode="speed" />;
}
