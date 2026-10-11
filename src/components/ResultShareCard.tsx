"use client";

import { useEffect, useRef, useState } from "react";
import type { RoundResult } from "../utils/roundResult";
import { challengeShare } from "../utils/share";

function drawCard(canvas: HTMLCanvasElement, result: RoundResult) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image export unavailable");
  canvas.width = 1200; canvas.height = 630;
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, "#0b1014"); gradient.addColorStop(1, "#194c42");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1200, 630);
  ctx.strokeStyle = "#83e5d824"; ctx.lineWidth = 1;
  for (let x = 0; x < 1200; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 630); ctx.stroke(); }
  for (let y = 0; y < 630; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1200, y); ctx.stroke(); }
  ctx.fillStyle = "#83e5d8"; ctx.font = "bold 30px Arial";
  ctx.fillText("GEEK // MINI", 70, 90);
  ctx.fillStyle = "#c8ddd7"; ctx.font = "24px Arial";
  ctx.fillText(result.mode === "daily" ? "DAILY CHALLENGE" : "30-SECOND SPEED ROUND", 70, 155);
  ctx.fillStyle = "#f0f6f3"; ctx.font = "bold 150px Arial";
  ctx.fillText(`${result.score} / ${result.total}`, 65, 330);
  ctx.fillStyle = "#83e5d8"; ctx.font = "bold 45px Arial";
  ctx.fillText("Your turn. What do you know about Kaspa?", 70, 417);
  ctx.fillStyle = "#c8ddd7"; ctx.font = "24px Arial";
  ctx.fillText(result.utcDate ? `${result.utcDate} UTC · Personal practice score` : "Personal practice score · Free to play", 70, 468);
  ctx.strokeStyle = "#639f8e"; ctx.beginPath(); ctx.moveTo(70, 512); ctx.lineTo(1130, 512); ctx.stroke();
  ctx.fillStyle = "#f0f6f3"; ctx.font = "bold 26px Arial";
  ctx.fillText(`geek-mini.vercel.app/${result.mode}`, 70, 568);
  ctx.textAlign = "right"; ctx.fillStyle = "#a9c5bd"; ctx.font = "22px Arial";
  ctx.fillText("BY GEEK PROTOCOL", 1130, 568);
  ctx.textAlign = "left";
}

export function ResultShareCard({ result }: { result: RoundResult }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { if (canvas.current) drawCard(canvas.current, result); }
      catch { setStatus("Image preview unavailable. You can still share the challenge link above."); }
    });
    return () => cancelAnimationFrame(frame);
  }, [result]);

  async function exportCard(share: boolean) {
    if (!canvas.current || busy) return;
    setBusy(true); setStatus("");
    try {
      drawCard(canvas.current, result);
      const blob = await new Promise<Blob>((resolve, reject) => canvas.current!.toBlob(value => value ? resolve(value) : reject(new Error("Image unavailable")), "image/png"));
      const file = new File([blob], `geek-mini-${result.mode}.png`, { type: "image/png" });
      const data = challengeShare(result.mode, window.location.origin, result);
      if (share && navigator.canShare?.({ files: [file] }) && navigator.share) {
        try { await navigator.share({ files: [file], ...data }); setStatus("Card shared."); return; }
        catch (error) { if (error instanceof DOMException && error.name === "AbortError") return; }
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = file.name; document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(share ? "Image sharing is unavailable here. Your card download is ready to attach to a post." : "Card download ready. Attach it to a post with your challenge link.");
    } catch { setStatus("Couldn’t create the image here. Use Share this challenge above to share the text and link."); }
    finally { setBusy(false); }
  }

  return <section className="result-share-card" aria-labelledby="share-card-title">
    <span className="eyebrow">Made to pass on</span><h2 id="share-card-title">Take your result with you.</h2>
    <p>A card for your group chat or timeline. Scores are personal practice, not verified rankings.</p>
    <canvas ref={canvas} width="1200" height="630" role="img" aria-label={`Geek Mini ${result.mode} challenge card: ${result.score} correct out of ${result.total}. Personal practice score.`} />
    <div className="result-actions"><button className="button button-primary" type="button" disabled={busy} onClick={() => exportCard(true)}>Share result card ↗</button><button className="button button-outline" type="button" disabled={busy} onClick={() => exportCard(false)}>Download card ↓</button></div>
    <p className="action-status" role="status">{status}</p>
  </section>;
}
