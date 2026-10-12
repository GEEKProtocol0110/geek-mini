"use client";

import Link from "next/link";
import { usePracticeHistory } from "./usePracticeHistory";
import { practiceSummary } from "../utils/storage";

export function DailyReturn() {
  const history = usePracticeHistory();
  if (!history.loaded || !history.available || !history.scores.length) return null;
  const summary = practiceSummary(history.scores, history.utcDate);
  return <aside className="daily-return" aria-label="Your saved practice">
    <div><span className="eyebrow">Welcome back</span><p>{summary.todayDaily ?
      <>Today’s saved Daily best: <strong>{summary.todayDaily.score} / 5</strong>. Replay for practice whenever you like.</> :
      <>Your recent rounds are saved here. Today’s five are ready when you are.</>}</p></div>
    <Link className="button button-outline" href="/progress">Your progress ↗</Link>
  </aside>;
}
