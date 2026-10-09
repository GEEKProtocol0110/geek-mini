"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "../../components/Brand";
import { RoundReview } from "../../components/RoundReview";
import { challengeShare, shareChallenge } from "../../utils/share";
import { getLastResult, type RoundResult } from "../../utils/roundResult";

export default function ResultPage() {
  const [result, setResult] = useState<RoundResult | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [showShareText, setShowShareText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResult(getLastResult());
      setLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  async function share() {
    if (!result) return;
    const status = await shareChallenge(result.mode, result);
    setShareStatus(status === "shared" ? "Share ready." : status === "copied" ? "Message and challenge link copied." : status === "cancelled" ? "" : "Copy unavailable. Select the message below to share it manually.");
    setShowShareText(status === "failed");
  }

  const accuracy = result && result.total ? Math.round(result.score / result.total * 100) : 0;
  return <><SiteHeader /><main className="result-shell shell">
    {!loaded ? <div className="result-card"><p>Loading your result…</p></div> : !result ? <div className="result-card"><span className="eyebrow">GEEK // MINI</span><h1>Ready for a round?</h1><p>Play a challenge to see your result here.</p><Link href="/daily" className="button button-primary">Start Daily Challenge ↗</Link></div> :
      <div className="result-card"><span className="eyebrow">ROUND COMPLETE · {result.mode === "daily" ? "DAILY CHALLENGE" : "SPEED ROUND"}</span>{result.utcDate && <p className="round-date">{result.utcDate} UTC · Daily Challenge</p>}<div className="result-big">{result.score}<span> / {result.total}</span></div><h1>{accuracy === 100 ? "Perfect round." : accuracy >= 60 ? "Nicely done." : "Keep exploring."}</h1><p>{accuracy}% correct. Every answer is a way into something new about Kaspa.</p><div className="result-detail"><div><span>YOUR ROUND</span><strong>{result.mode === "daily" ? "Daily Challenge" : "Speed Round"}</strong></div><div><span>ACCURACY</span><strong>{accuracy}%</strong></div><div><span>RECORD</span><strong>{result.historySaved ? "Saved on this device" : "This visit only"}</strong></div></div>{!result.historySaved && <p role="status">History couldn’t be confirmed on this device. Your result is available during this visit.</p>}<div className="result-actions"><Link className="button button-primary" href={result.mode === "daily" ? "/daily" : "/speed"}>Play another round ↗</Link><button className="button button-outline" type="button" onClick={share}>Share this challenge ↗</button></div><p className="action-status" role="status" aria-live="polite">{shareStatus}</p>{showShareText && <label className="copy-field">Share message<textarea readOnly value={(() => { const data = challengeShare(result.mode, window.location.origin, result); return `${data.text} ${data.url}`; })()} onFocus={event => event.currentTarget.select()} /></label>}<RoundReview items={result.review} /><div className="result-next"><span>WHAT’S NEXT</span><p>There’s more to explore beyond this mini challenge.</p><a href="https://www.geekprotocol.xyz/" target="_blank" rel="noopener noreferrer">Visit Geek Protocol ↗</a></div><p className="result-disclaimer">Local practice score. No leaderboard, wallet connection, tokens, or payout.</p></div>}
  </main></>;
}
