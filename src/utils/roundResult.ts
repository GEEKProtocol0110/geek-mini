import type { QuizMode } from "../types/quiz";
import { saveScore } from "./storage";

const RESULT_KEY = "geek_mini_last_result";
const SPEED_KEY = "speed_last_play";
let memoryResult: RoundResult | null = null;
let memorySpeedAt = 0;

export interface RoundResult {
  mode: QuizMode;
  score: number;
  total: number;
  timestamp: number;
  historySaved: boolean;
}

export function finishRound(mode: QuizMode, score: number, total: number): RoundResult {
  const timestamp = Date.now();
  const result: RoundResult = {
    mode,
    score,
    total,
    timestamp,
    historySaved: saveScore({ mode, score, total, accuracy: total ? Math.round(score / total * 100) : 0, timestamp }),
  };
  memoryResult = result;
  try {
    sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
  } catch { /* Client-side navigation retains the in-memory receipt. */ }
  if (mode === "speed") {
    memorySpeedAt = timestamp;
    try { localStorage.setItem(SPEED_KEY, String(timestamp)); } catch { /* Visit-only cooldown. */ }
  }
  return result;
}

export function getLastResult(): RoundResult | null {
  if (memoryResult) return memoryResult;
  try {
    const raw = sessionStorage.getItem(RESULT_KEY);
    if (!raw) return null;
    const result = JSON.parse(raw) as RoundResult | null;
    if (
      !result || typeof result !== "object" ||
      (result.mode !== "daily" && result.mode !== "speed") ||
      !Number.isInteger(result.score) ||
      !Number.isInteger(result.total) ||
      result.score < 0 || result.total < 0 || result.score > result.total ||
      (result.mode === "daily" ? result.total !== 5 : result.total > 10) ||
      !Number.isSafeInteger(result.timestamp) || result.timestamp <= 0 ||
      result.timestamp > Date.now() ||
      (result.historySaved !== undefined && typeof result.historySaved !== "boolean")
    ) return null;
    // Older receipts have no save acknowledgement. Do not claim persistence.
    return { ...result, historySaved: result.historySaved === true };
  } catch {
    return null;
  }
}

export function getSpeedCooldown(): number {
  const now = Date.now();
  let lastPlay = memorySpeedAt > 0 && memorySpeedAt <= now ? memorySpeedAt : 0;
  try {
    const raw = localStorage.getItem(SPEED_KEY), stored = raw && /^\d{1,16}$/.test(raw) ? Number(raw) : 0;
    if (Number.isSafeInteger(stored) && stored > 0 && stored <= now) lastPlay = Math.max(lastPlay, stored);
  } catch { /* A blocked store cannot suppress the visit-only cooldown. */ }
  return lastPlay ? Math.max(0, Math.min(30, Math.ceil((30000 - (now - lastPlay)) / 1000))) : 0;
}
