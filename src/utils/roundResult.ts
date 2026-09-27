import type { QuizMode } from "../types/quiz";
import { saveScore } from "./storage";

const RESULT_KEY = "geek_mini_last_result";
const SPEED_KEY = "speed_last_play";

export interface RoundResult {
  mode: QuizMode;
  score: number;
  total: number;
  timestamp: number;
}

export function finishRound(mode: QuizMode, score: number, total: number): void {
  const timestamp = Date.now();
  const result: RoundResult = {
    mode,
    score,
    total,
    timestamp,
  };
  try {
    sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
    if (mode === "speed") localStorage.setItem(SPEED_KEY, String(timestamp));
    saveScore({ mode, score, total, accuracy: total ? Math.round(score / total * 100) : 0, timestamp });
  } catch {
    // Storage may be disabled. The quiz still works, but no local result can be kept.
  }
}

export function getLastResult(): RoundResult | null {
  try {
    const raw = sessionStorage.getItem(RESULT_KEY);
    if (!raw) return null;
    const result = JSON.parse(raw) as RoundResult;
    if (
      (result.mode !== "daily" && result.mode !== "speed") ||
      !Number.isInteger(result.score) ||
      !Number.isInteger(result.total) ||
      result.score < 0 || result.total < 0 || result.score > result.total
    ) return null;
    return result;
  } catch {
    return null;
  }
}

export function getSpeedCooldown(): number {
  try {
    const lastPlay = Number(localStorage.getItem(SPEED_KEY));
    if (!lastPlay || !Number.isFinite(lastPlay)) return 0;
    return Math.max(0, Math.ceil((30000 - (Date.now() - lastPlay)) / 1000));
  } catch {
    return 0;
  }
}
