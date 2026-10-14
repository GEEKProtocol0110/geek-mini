"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SiteFooter, SiteHeader } from "./Brand";
import { usePracticeHistory } from "./usePracticeHistory";
import { practiceSummary } from "../utils/storage";
import { clearPracticeData } from "../utils/roundResult";
import { speedFocusLabel } from "../utils/speedFocus";
import type { QuizMode } from "../types/quiz";

export function PracticeProgress() {
  const history = usePracticeHistory();
  const [filter, setFilter] = useState<QuizMode | "all">("all");
  const [confirmClear, setConfirmClear] = useState(false);
  const [message, setMessage] = useState("");
  const clearButton = useRef<HTMLButtonElement>(null);
  const confirmation = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (confirmClear) confirmation.current?.focus(); }, [confirmClear]);
  const summary = practiceSummary(history.scores, history.utcDate);
  const visible = history.scores.filter(score => filter === "all" || score.mode === filter);

  function clear() {
    const complete = clearPracticeData();
    history.reload(); setConfirmClear(false);
    setMessage(complete ? "Mini’s saved scores and Speed cooldown were cleared. This tab’s last result was cleared too." :
      "Some Mini records could not be cleared because browser storage is unavailable. Clear this site’s data in your browser settings to finish.");
    clearButton.current?.focus();
  }

  return <><SiteHeader /><main className="progress-shell shell">
    <Link href="/" className="back-link">← Back to Mini</Link>
    <header className="progress-heading"><span className="eyebrow">Your practice, your pace</span><h1>Your progress.</h1>
      <p>The last 20 saved rounds in this browser. Best scores refer to these rounds, and Daily replays count as practice.</p></header>
    {!history.loaded ? <p role="status">Loading your saved rounds…</p> : !history.available ?
      <section className="progress-empty"><h2>Saved scores couldn’t be read.</h2><p>Your browser may be blocking storage, or a saved record may be unreadable. You can still play; results may last only for that visit.</p><button className="button button-outline" type="button" onClick={history.reload}>Try loading again</button></section> : <>
      <section className="practice-today" aria-labelledby="today-title"><div><span className="eyebrow">{history.utcDate} UTC</span><h2 id="today-title">Today’s Daily.</h2><p>{summary.todayDaily ? <>Saved best <strong>{summary.todayDaily.score} / 5</strong> across {summary.todayAttempts} saved {summary.todayAttempts === 1 ? "attempt" : "attempts"}.</> : "No saved round for today’s set yet."}</p></div><Link className="button button-primary" href="/daily">{summary.todayDaily ? "Replay today’s five" : "Play today’s five"} ↗</Link></section>
      {history.scores.length ? <>
        <dl className="progress-stats"><div><dt>Saved rounds</dt><dd>{summary.totalGames}<small>{summary.dailyGames} Daily · {summary.speedGames} Speed</small></dd></div><div><dt>Daily best</dt><dd>{summary.bestDaily ? `${summary.bestDaily.score} / 5` : "—"}<small>Five questions, no timer</small></dd></div><div><dt>Speed best</dt><dd>{summary.bestSpeed ? `${summary.bestSpeed.score} correct` : "—"}<small>Most correct across all saved Speed topics</small></dd></div></dl>
        <section className="progress-history" aria-labelledby="history-title"><h2 id="history-title">Recent rounds.</h2><div className="review-filters" role="group" aria-label="Saved round filter">{(["all", "daily", "speed"] as const).map(mode => <button key={mode} type="button" aria-pressed={filter === mode} onClick={() => setFilter(mode)}>{mode === "all" ? "All rounds" : mode === "daily" ? "Daily" : "Speed"}</button>)}</div>
          <p className="subtle-note" role="status">{visible.length} saved {visible.length === 1 ? "round" : "rounds"} shown.</p>
          {!visible.length ? <p>No saved {filter === "daily" ? "Daily" : "Speed"} rounds yet.</p> : <ol className="history-list">{visible.map((score, index) => <li key={`${score.timestamp}:${index}`}><div><strong>{score.mode === "daily" ? "Daily Challenge" : "Speed Round"}</strong><time dateTime={new Date(score.timestamp).toISOString()}>{new Date(score.timestamp).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</time>{score.mode === "speed" && <span className="history-date">{score.focus ? speedFocusLabel(score.focus) : "Topic not recorded"}</span>}{score.utcDate && <span className="history-date">Daily set: {score.utcDate} UTC</span>}</div><div className="history-score"><strong>{score.score} / {score.total}</strong><span>{score.total ? `${score.accuracy}% correct` : "No answers reached"}</span></div></li>)}</ol>}
        </section>
      </> : <section className="progress-empty"><h2>Your first round starts the record.</h2><p>Complete Daily or Speed to save a score here. Mini uses this browser’s storage; it doesn’t sync between devices.</p><Link className="button button-outline" href="/speed">Try Speed Round ↗</Link></section>}
    </>}
    <section className="progress-privacy" aria-labelledby="privacy-title"><h2 id="privacy-title">You control this record.</h2><p>Mini sends no score history to HQ. Clearing removes this browser’s saved scores and Speed cooldown, plus this tab’s last result. It does not change your Geek Protocol account. Other open Mini tabs may still hold a result; close them to end those sessions.</p>
      <button ref={clearButton} className="button button-outline" type="button" onClick={() => { setMessage(""); setConfirmClear(true); }}>Clear Mini records</button>
      {confirmClear && <div className="clear-confirm"><h3 ref={confirmation} tabIndex={-1}>Clear this browser’s Mini records?</h3><p>These saved records cannot be restored by Mini.</p><div className="result-actions"><button className="button button-outline" type="button" onClick={() => { setConfirmClear(false); clearButton.current?.focus(); }}>Keep my records</button><button className="button button-primary" type="button" onClick={clear}>Clear records</button></div></div>}
      <p className="action-status" role="status" aria-live="polite">{message}</p></section>
    <p className="game-footnote">Personal practice only. Browser records can be edited. No leaderboard, wallet, tokens or payouts.</p>
  </main><SiteFooter /></>;
}
