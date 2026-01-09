"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import questions from "../../data/questions/kaspa.daily.json";

type Answer = {
  text: string;
  isCorrect: boolean;
};

function shuffleAnswers(question: any): Answer[] {
  const entries = question.choices.map((text: string, index: number) => ({
    text,
    isCorrect: index === question.answer
  }));
  return [...entries].sort(() => Math.random() - 0.5);
}

export default function SpeedPage() {
  const router = useRouter();

  /* ---------------- STATE ---------------- */
  const [cooldownLeft, setCooldownLeft] = useState<number | null>(null);

  const [quizQuestions, setQuizQuestions] = useState<typeof questions>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedCorrect, setSelectedCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);

  /* ---------------- COOLDOWN CHECK ---------------- */
  useEffect(() => {
    const last = localStorage.getItem("speed_last_play");
    if (!last) return;

    const elapsed = Date.now() - Number(last);
    const remaining = 30000 - elapsed;

    if (remaining > 0) {
      setCooldownLeft(Math.ceil(remaining / 1000));

      const interval = setInterval(() => {
        const nowElapsed = Date.now() - Number(last);
        const nowRemaining = 30000 - nowElapsed;

        if (nowRemaining <= 0) {
          clearInterval(interval);
          setCooldownLeft(null);
        } else {
          setCooldownLeft(Math.ceil(nowRemaining / 1000));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  /* ---------------- SHUFFLE QUESTIONS ---------------- */
  useEffect(() => {
    if (cooldownLeft !== null) return;

    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuizQuestions(shuffled.slice(0, 10));
  }, [cooldownLeft]);

  /* ---------------- SHUFFLE ANSWERS ---------------- */
  useEffect(() => {
    if (cooldownLeft !== null) return;

    if (quizQuestions[index]) {
      setAnswers(shuffleAnswers(quizQuestions[index]));
      setAnswered(false);
      setSelectedCorrect(null);
    }
  }, [index, quizQuestions, cooldownLeft]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (cooldownLeft !== null) return;

    if (timeLeft <= 0) {
      router.push(
        `/result?score=${score}&mode=speed&answered=${answeredCount}`
      );
      return;
    }

    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, score, answeredCount, router, cooldownLeft]);

  /* ---------------- GAME LOGIC ---------------- */
  const q = quizQuestions[index];

  function handleAnswer(isCorrect: boolean) {
    if (answered) return;

    setAnswered(true);
    setAnsweredCount((c) => c + 1);
    setSelectedCorrect(isCorrect);

    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (index + 1 < quizQuestions.length) {
        setIndex((i) => i + 1);
      } else {
        router.push(
          `/result?score=${score + (isCorrect ? 1 : 0)}&mode=speed&answered=${answeredCount + 1}`
        );
      }
    }, 300);
  }

  /* ---------------- RENDER ---------------- */
  if (cooldownLeft !== null) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Geek Mini – Speed</h1>
        <p>⏳ Speed mode cooldown</p>
        <p>Please wait {cooldownLeft}s before playing again.</p>
        <button onClick={() => router.push("/")}>Go Home</button>
      </main>
    );
  }

  if (!q) {
    return <main style={{ padding: 24 }}>Loading…</main>;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Geek Mini – Speed</h1>

      <p>⏱ {timeLeft}s</p>
      <p>
        Question {index + 1} / {quizQuestions.length}
      </p>

      <p>{q.question}</p>

      <ul>
        {answers.map((a, i) => (
          <li key={i}>
            <button
              onClick={() => handleAnswer(a.isCorrect)}
              disabled={answered}
              style={{
                background:
                  selectedCorrect === null
                    ? ""
                    : a.isCorrect
                    ? "#16a34a"
                    : "#dc2626",
                color: selectedCorrect === null ? "" : "white",
                marginBottom: 6
              }}
            >
              {a.text}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
