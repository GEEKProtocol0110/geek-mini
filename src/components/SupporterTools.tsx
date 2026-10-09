"use client";

import { useEffect, useRef, useState } from "react";
import type { QuizMode } from "../types/quiz";
import { challengeShare, embedMarkup, shareChallenge } from "../utils/share";

export function SupporterTools() {
  const [mode, setMode] = useState<QuizMode>("daily");
  const [origin, setOrigin] = useState("");
  const [message, setMessage] = useState("");
  const [showShareText, setShowShareText] = useState(false);
  const request = useRef(0);
  const codeField = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const timer = setTimeout(() => setOrigin(window.location.origin), 0); return () => clearTimeout(timer); }, []);
  const code = origin ? embedMarkup(mode, origin) : "Preparing embed code…";
  const data = origin ? challengeShare(mode, origin) : null;

  async function share() {
    const token = ++request.current;
    const result = await shareChallenge(mode);
    if (token !== request.current) return;
    setMessage(result === "shared" ? "Share ready." : result === "copied" ? "Challenge message and link copied." : result === "cancelled" ? "" : "Copy unavailable. Select the share message below.");
    setShowShareText(result === "failed");
  }
  async function copyEmbed() {
    const token = ++request.current;
    try {
      await navigator.clipboard.writeText(code);
      if (token === request.current) setMessage("Embed code copied. Paste it into your website’s HTML.");
    } catch {
      if (token !== request.current) return;
      setMessage("Copy unavailable. The embed code is selected below for manual copying.");
      codeField.current?.focus(); codeField.current?.select();
    }
  }

  return <div className="supporter-workbench">
    <div className="supporter-controls">
      <label className="mode-picker">Choose a challenge<select value={mode} onChange={event => { request.current += 1; setMode(event.target.value as QuizMode); setMessage(""); setShowShareText(false); }}><option value="daily">Daily Challenge · five questions</option><option value="speed">Speed Round · 30 seconds</option></select></label>
      <div className="supporter-actions"><button className="button button-primary" type="button" disabled={!origin} onClick={share}>Share {mode === "daily" ? "Daily" : "Speed"} ↗</button><button className="button button-outline" type="button" disabled={!origin} onClick={copyEmbed}>Copy website embed ⌁</button><p className="action-status" role="status" aria-live="polite">{message}</p></div>
      {showShareText && data && <label className="copy-field">Share message<textarea readOnly value={`${data.text} ${data.url}`} onFocus={event => event.currentTarget.select()} /></label>}
      <label className="copy-field">Website embed code<textarea ref={codeField} readOnly value={code} onFocus={event => event.currentTarget.select()} spellCheck={false} /></label>
      <p className="subtle-note">The card opens the game in a new tab. Daily links always open the current UTC day’s challenge. Sharing has no referral payouts or wallet requirements.</p>
    </div>
    <div className="live-embed-preview"><span className="eyebrow">Live embed preview · {mode === "daily" ? "Daily" : "Speed"}</span><iframe src={`/embed?mode=${mode}`} title={`Geek Mini ${mode === "daily" ? "Daily Challenge" : "Speed Round"} embed preview`} width="420" height="320" loading="lazy" /></div>
  </div>;
}
