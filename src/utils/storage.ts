export interface GameScore {
  mode: "daily" | "speed";
  score: number;
  total: number;
  accuracy: number;
  timestamp: number;
}

export const saveScore = (gameScore: GameScore) => {
  try {
    const scores = getScoreHistory();
    scores.unshift(gameScore);
    // Keep only last 20 scores
    const trimmed = scores.slice(0, 20);
    localStorage.setItem("geek_mini_scores", JSON.stringify(trimmed));
  } catch (e) {
    console.error("Failed to save score:", e);
  }
};

export const getScoreHistory = (): GameScore[] => {
  try {
    const data = localStorage.getItem("geek_mini_scores");
    if (!data) return [];
    const parsed: unknown = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is GameScore =>
      value !== null && typeof value === "object" &&
      (value.mode === "daily" || value.mode === "speed") &&
      Number.isInteger(value.score) && Number.isInteger(value.total) &&
      value.score >= 0 && value.total >= value.score &&
      Number.isFinite(value.accuracy) && Number.isFinite(value.timestamp)
    ).slice(0, 20);
  } catch {
    return [];
  }
};

export const getBestScore = (mode: "daily" | "speed"): GameScore | null => {
  const scores = getScoreHistory().filter((s) => s.mode === mode);
  if (scores.length === 0) return null;
  return scores.reduce((best, current) =>
    current.accuracy > best.accuracy ? current : best
  );
};

export const getStats = () => {
  const scores = getScoreHistory();
  const dailyScores = scores.filter((s) => s.mode === "daily");
  const speedScores = scores.filter((s) => s.mode === "speed");

  return {
    totalGames: scores.length,
    dailyGames: dailyScores.length,
    speedGames: speedScores.length,
    avgAccuracy: scores.length
      ? Math.round(
          scores.reduce((sum, s) => sum + s.accuracy, 0) / scores.length
        )
      : 0,
    bestDaily: getBestScore("daily"),
    bestSpeed: getBestScore("speed"),
  };
};
