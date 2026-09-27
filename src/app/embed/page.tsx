"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function EmbedCard() {
  const params = useSearchParams();
  const mode = params.get("mode") === "speed" ? "speed" : "daily";
  return <main className="embed-page"><div className="embed-card"><span className="embed-card-brand">GEEK<span>{"//"}</span>MINI <small>BY GEEK PROTOCOL</small></span><div className="embed-card-content"><span className="eyebrow">KASPA KNOWLEDGE</span><h1>Know Kaspa?<br />Show us.</h1><p>{mode === "daily" ? "Five questions. One quick challenge." : "Ten questions. Thirty seconds."}</p></div><div className="embed-card-footer"><Link href={`/${mode}`} target="_blank" rel="noopener noreferrer" className="button button-primary">Play {mode === "daily" ? "the daily" : "speed round"} ↗</Link><a href="https://www.geekprotocol.xyz/" target="_blank" rel="noopener noreferrer">Discover Geek Protocol ↗</a></div></div></main>;
}

export default function EmbedPage() {
  return <Suspense fallback={<main className="embed-page">Loading Geek Mini…</main>}><EmbedCard /></Suspense>;
}
