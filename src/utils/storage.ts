import { isUtcDate } from "./questionBank";
import { isSpeedFocus, type SpeedFocus } from "./speedFocus";

export const SCORE_KEY = "geek_mini_scores";
export interface GameScore {
  mode: "daily" | "speed";
  score: number;
  total: number;
  accuracy: number;
  timestamp: number;
  utcDate?: string;
  focus?: SpeedFocus;
}

function validScore(value: unknown, now: number): GameScore | null {
  if (!value || typeof value !== "object") return null;
  const item = value as GameScore;
  if ((item.mode !== "daily" && item.mode !== "speed") ||
    !Number.isInteger(item.score) || !Number.isInteger(item.total) || item.score < 0 || item.score > item.total ||
    (item.mode === "daily" ? item.total !== 5 : item.total < 0 || item.total > 10) ||
    !Number.isFinite(item.accuracy) || !Number.isSafeInteger(item.timestamp) || item.timestamp <= 0 || item.timestamp > now) return null;
  const score: GameScore = { mode: item.mode, score: item.score, total: item.total,
    accuracy: item.total ? Math.round(item.score / item.total * 100) : 0, timestamp: item.timestamp };
  // Legacy scores have no generation date. A completion date cannot identify their Daily set.
  if (item.mode === "daily" && isUtcDate(item.utcDate) && item.utcDate <= new Date(item.timestamp).toISOString().slice(0, 10)) score.utcDate = item.utcDate;
  if (item.mode === "speed" && isSpeedFocus(item.focus)) score.focus = item.focus;
  return score;
}

export function readScoreHistory(): { scores: GameScore[]; available: boolean } {
  try {
    const data = localStorage.getItem(SCORE_KEY);
    if (!data) return { scores: [], available: true };
    const parsed: unknown = JSON.parse(data);
    const now = Date.now();
    const scores = Array.isArray(parsed) ? parsed.map(value => validScore(value, now)).filter((score): score is GameScore => score !== null) : [];
    return { scores: scores.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20), available: true };
  } catch { return { scores: [], available: false }; }
}

export const getScoreHistory = (): GameScore[] => readScoreHistory().scores;

export function saveScore(gameScore: GameScore): boolean {
  const score = validScore(gameScore, Date.now());
  if (!score) return false;
  try {
    localStorage.setItem(SCORE_KEY, JSON.stringify([score, ...getScoreHistory()].slice(0, 20)));
    return true;
  } catch { return false; }
}

export function bestScore(scores: GameScore[], mode: GameScore["mode"]): GameScore | null {
  return scores.filter(score => score.mode === mode).reduce<GameScore | null>((best, score) =>
    !best || score.score > best.score || (score.score === best.score && (score.accuracy > best.accuracy ||
      (score.accuracy === best.accuracy && score.timestamp > best.timestamp))) ? score : best, null);
}

export const getBestScore = (mode: GameScore["mode"]) => bestScore(getScoreHistory(), mode);

export function practiceSummary(scores: GameScore[], utcDate: string) {
  const today = scores.filter(score => score.mode === "daily" && score.utcDate === utcDate);
  return { totalGames: scores.length, dailyGames: scores.filter(score => score.mode === "daily").length,
    speedGames: scores.filter(score => score.mode === "speed").length,
    bestDaily: bestScore(scores, "daily"), bestSpeed: bestScore(scores, "speed"),
    todayDaily: bestScore(today, "daily"), todayAttempts: today.length };
}

export const getStats = () => {
  const scores = getScoreHistory();
  return { ...practiceSummary(scores, new Date().toISOString().slice(0, 10)),
    avgAccuracy: scores.length ? Math.round(scores.reduce((sum, score) => sum + score.accuracy, 0) / scores.length) : 0 };
};
