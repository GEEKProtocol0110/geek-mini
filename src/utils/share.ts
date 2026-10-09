import type { QuizMode } from "../types/quiz";
import { isUtcDate } from "./questionBank";

export function challengeShare(mode: QuizMode, origin: string, result?: { score: number; total: number; utcDate?: string }) {
  const name = mode === "daily" ? "Daily Challenge" : "Speed Round";
  // Links always open today's Daily, not an archived round.
  const date = mode === "daily" ? result ? isUtcDate(result.utcDate) ? ` (${result.utcDate} UTC)` : "" : ` (${new Date().toISOString().slice(0, 10)} UTC)` : "";
  return {
    title: `Geek Mini · ${name}`,
    text: result ? `I got ${result.score}/${result.total} on Geek Mini’s ${name}${date}. Try a free Kaspa knowledge round!` : `Try Geek Mini’s ${name}${date}. Free Kaspa knowledge practice by Geek Protocol.`,
    url: `${origin}/${mode}`,
  };
}

export function embedMarkup(mode: QuizMode, origin: string) {
  const name = mode === "daily" ? "Daily Challenge" : "Speed Round";
  return `<iframe src="${origin}/embed?mode=${mode}" title="Geek Mini ${name}" width="420" height="320" style="max-width:100%;border:0;border-radius:18px" loading="lazy"></iframe>`;
}

export async function shareChallenge(mode: QuizMode, result?: { score: number; total: number; utcDate?: string }): Promise<"shared" | "copied" | "cancelled" | "failed"> {
  const data = challengeShare(mode, window.location.origin, result);
  if (navigator.share) {
    try { await navigator.share(data); return "shared"; }
    catch (error) { if (error instanceof DOMException && error.name === "AbortError") return "cancelled"; }
  }
  try { await navigator.clipboard.writeText(`${data.text} ${data.url}`); return "copied"; }
  catch { return "failed"; }
}
