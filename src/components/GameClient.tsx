"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiteHeader } from "./Brand";
import type { QuizMode } from "../types/quiz";
import { buildRounds, type Round } from "../utils/rounds";
import { finishRound, getSpeedCooldown } from "../utils/roundResult";
import { createRoundClock } from "../utils/roundClock";

import type { RoundReview } from "../utils/questionBank";

const SPEED_SECONDS = 30;

export function GameClient({ mode }: { mode: QuizMode }) {
  const router = useRouter();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(SPEED_SECONDS);
  const [cooldown, setCooldown] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [utcDate, setUtcDate] = useState("");
  const review = useRef<RoundReview[]>([]);
  const finished = useRef(false);
  const answerLocked = useRef(false);
  const scoreValue = useRef(0);
  const answeredValue = useRef(0);
  const indexValue = useRef(0);
  const clock = useRef<ReturnType<typeof createRoundClock> | null>(null);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Generate browser-only rounds so the server and hydrated page agree.
    const setup = setTimeout(() => {
      const date = new Date().toISOString().slice(0, 10);
      setUtcDate(date);
      setRounds(buildRounds(mode, date));
      if (mode === "speed") setCooldown(getSpeedCooldown());
      setReady(true);
    }, 0);
    return () => clearTimeout(setup);
  }, [mode]);

  const end = useCallback((finalScore: number, total: number) => {
    if (finished.current) return;
    finished.current = true;
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    const items = [...review.current];
    const current = rounds[indexValue.current];
    if (mode === "speed" && current && !items.some(item => item.questionId === current.question.id)) {
      items.push({ questionId: current.question.id, selected: null });
    }
    finishRound(mode, finalScore, total, { utcDate, review: items });
    router.replace("/result");
  }, [mode, router, rounds, utcDate]);

  useEffect(() => {
    if (!ready || !started || mode !== "speed" || cooldown !== 0 || finished.current) return;
    const tick = () => {
      if (finished.current || !clock.current) return;
      setSeconds(clock.current.secondsLeft());
      if (clock.current.expired()) end(scoreValue.current, answeredValue.current);
    };
    const timer = setInterval(tick, 250);
    tick();
    window.addEventListener("focus", tick);
    window.addEventListener("pageshow", tick);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", tick);
      window.removeEventListener("pageshow", tick);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [ready, started, mode, cooldown, end]);

  useEffect(() => {
    if (cooldown === null || cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(getSpeedCooldown()), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const next = useCallback(() => {
    if (selected === null || finished.current || indexValue.current !== index) return;
    if (index + 1 >= rounds.length) {
      end(scoreValue.current, answeredValue.current);
      return;
    }
    indexValue.current += 1;
    setIndex(indexValue.current);
    answerLocked.current = false;
    setSelected(null);
  }, [selected, index, rounds.length, end]);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  useEffect(() => {
    if (!ready || (mode === "speed" && !started)) return;
    const frame = requestAnimationFrame(() => questionHeading.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [ready, mode, started, index]);

  const answer = useCallback((option: number) => {
    if (answerLocked.current || selected !== null || finished.current || indexValue.current !== index || !rounds[index]) return;
    if (mode === "speed") {
      if (cooldown !== 0 || !clock.current) return;
      if (clock.current.expired()) { end(scoreValue.current, answeredValue.current); return; }
    }
    const correct = rounds[index].choices[option]?.isCorrect;
    if (correct === undefined) return;
    answerLocked.current = true;
    setSelected(option);
    review.current.push({ questionId: rounds[index].question.id, selected: rounds[index].question.choices.indexOf(rounds[index].choices[option].text) });
    answeredValue.current += 1;
    setAnsweredCount(answeredValue.current);
    if (correct) {
      scoreValue.current += 1;
      setScore(scoreValue.current);
    }
    if (mode === "speed") {
      advanceTimer.current = setTimeout(() => {
        if (finished.current) return;
        if (clock.current?.expired()) { end(scoreValue.current, answeredValue.current); return; }
        if (indexValue.current !== index) return;
        if (index + 1 >= rounds.length) end(scoreValue.current, answeredValue.current);
        else {
          indexValue.current += 1;
          setIndex(indexValue.current);
          answerLocked.current = false;
          setSelected(null);
        }
      }, 950);
    }
  }, [selected, rounds, index, mode, cooldown, end]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
      if (event.target instanceof HTMLElement && event.target.closest("a,input,textarea,select,[contenteditable='true']")) return;
      if (event.key === "Enter" && mode === "daily" && selected !== null) {
        if (event.target instanceof HTMLElement && event.target.closest("button")) return;
        event.preventDefault();
        next();
      } else if (/^[1-4]$/.test(event.key) && selected === null) {
        answer(Number(event.key) - 1);
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [answer, next, mode, selected]);

  if (!ready) return <main className="loading-shell" aria-live="polite">Preparing your round…</main>;

  if (mode === "speed" && cooldown !== null && cooldown > 0) {
    return <><SiteHeader /><main className="game-shell shell"><div className="game-panel cooldown-panel"><span className="eyebrow">A little breathing room</span><h1>Back in {cooldown}s.</h1><p>Speed Round is ready again after a short break. Daily Challenge is always open.</p><Link className="button button-primary" href="/daily">Play the daily instead ↗</Link></div></main></>;
  }

  if (mode === "speed" && !started) {
    return <><SiteHeader /><main className="game-shell shell"><Link href="/" className="back-link">← Back to Mini</Link><section className="game-panel start-panel" aria-labelledby="start-title"><span className="eyebrow">GEEK // MINI · SPEED ROUND</span><h1 id="start-title">Ready when you are.</h1><p>Up to ten Kaspa questions in 30 seconds. The clock starts only when you press Start.</p><ul><li>Choose with a tap or keys 1–4.</li><li>Each answer advances automatically after a brief reveal.</li><li>Review your answers and sources after the round.</li><li>The clock keeps running if you leave the tab.</li></ul><button type="button" className="button button-primary" onClick={() => { if (clock.current || cooldown !== 0) return; clock.current = createRoundClock(SPEED_SECONDS * 1000); setStarted(true); }}>Start Speed Round ↗</button><p className="game-footnote">Free practice. No wallet or rewards.</p></section></main></>;
  }

  const current = rounds[index];
  if (!current) return <main className="loading-shell">Preparing your round…</main>;
  const last = index + 1 === rounds.length;
  const title = mode === "daily" ? "Daily Challenge" : "Speed Round";

  return (
    <><SiteHeader /><main className="game-shell shell">
      <div className="game-top"><Link href="/" className="back-link">← Back to Mini</Link><span className="game-kind">{mode === "daily" ? `${utcDate} UTC · FIVE QUESTIONS` : "TEN QUESTIONS · 30 SECONDS"}</span></div>
      <div className="game-heading"><div><span className="eyebrow">GEEK // MINI</span><h1>{title}</h1></div><div className="game-numbers"><span>{mode === "speed" ? "TIME LEFT" : "YOUR SCORE"}</span><strong aria-live="off">{mode === "speed" ? `${seconds}s` : `${score} / ${rounds.length}`}</strong></div></div>
      <div className="progress-track" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={rounds.length} aria-label="Question progress"><div style={{ width: `${((index + 1) / rounds.length) * 100}%` }} /></div>
      <div className="game-subline"><span>QUESTION {String(index + 1).padStart(2, "0")} / {String(rounds.length).padStart(2, "0")}</span><span>{mode === "speed" ? `${answeredCount} answered · ${score} correct` : "Use keys 1–4 to answer"}</span></div>
      <section className="question-panel" aria-labelledby="question-title"><div className="question-label">{current.question.topic}</div><h2 id="question-title" ref={questionHeading} tabIndex={-1}>{current.question.question}</h2></section>
      <div className="answers-grid">{current.choices.map((choice, option) => {
        const status = selected === null ? "" : choice.isCorrect ? " answer-correct" : selected === option ? " answer-wrong" : " answer-muted";
        return <button className={`answer-option${status}`} key={`${current.question.id}:${option}`} type="button" disabled={selected !== null || seconds <= 0 && mode === "speed"} onClick={() => answer(option)}><span className="option-number">{option + 1}</span><span>{choice.text}</span><span className="option-mark" aria-hidden="true">{selected !== null && choice.isCorrect ? "✓" : selected === option ? "×" : "↗"}</span></button>;
      })}</div>
      {selected !== null && <div className="explanation" role="status"><strong>{current.choices[selected].isCorrect ? "That’s right." : "Good try."}</strong><span>{current.question.explain}</span>{mode === "daily" && <><a className="source-link" href={current.question.source.url} target="_blank" rel="noopener noreferrer">{current.question.source.label} ↗</a><button type="button" className="button button-primary" onClick={next}>{last ? "See your results" : "Next question"} ↗</button></>}</div>}
      <p className="game-footnote">Free practice. Scores stay in this browser and are not ranked or rewarded. <a href="https://kaspa.org/lore" target="_blank" rel="noopener noreferrer">Learn about Kaspa ↗</a></p>
    </main></>
  );
}
