"use client";

import { useState } from "react";
import { shareChallenge } from "../utils/share";

export function SupporterTools() {
  const [message, setMessage] = useState("");

  async function share() {
    const result = await shareChallenge("daily");
    setMessage(result === "copied" ? "Challenge link copied." : result === "shared" ? "Share ready." : "Could not share. Copy the page URL instead.");
  }

  async function copyEmbed() {
    const source = `${window.location.origin}/embed?mode=daily`;
    const markup = `<iframe src="${source}" title="Geek Mini Kaspa challenge" width="420" height="280" style="max-width:100%;border:0;border-radius:18px" loading="lazy"></iframe>`;
    try {
      await navigator.clipboard.writeText(markup);
      setMessage("Embed code copied. Paste it into your site’s HTML.");
    } catch {
      setMessage("Clipboard unavailable. Open /embed?mode=daily and copy its URL.");
    }
  }

  return (
    <div className="supporter-actions">
      <button className="button button-primary" type="button" onClick={share}>Share the challenge <span aria-hidden="true">↗</span></button>
      <button className="button button-outline" type="button" onClick={copyEmbed}>Copy website embed <span aria-hidden="true">⌁</span></button>
      <p className="action-status" role="status" aria-live="polite">{message}</p>
    </div>
  );
}
