"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import questions from "../../data/questions/kaspa.daily.json";

export default function SpeedPage() {
  const router = useRouter();

  const [quizQuestions, setQuizQuestions] = useState<typeof questions>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answered, setAnswered] = useState(false);

  // Shuffle + limit ONCE (client only)
  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuizQuestions(shuffled.slice(0, 5));
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      router.push(`/result?score=${score}`);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, score, router]);

  const q = quizQuestions[index];

  if (!q) {
    return <main style={{ padding: 24 }}>Loading…</main>;
  }

  function handleAnswer(choiceIndex: number) {
    if (answered) return;

    if (choiceIndex === q.answer) {
      setScore((s) => s + 1);
    }

    setAnswered(true);

    // Move quickly to next question
    setTimeout(() => {
      if (index + 1 < quizQuestions.length) {
        setIndex((i) => i + 1);
        setAnswered(false);
      } else {
        router.push(`/result?score=${score + (choiceIndex === q.answer ? 1 : 0)}`);
      }
    }, 300);
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Geek Mini – Speed</h1>

      <p>⏱ Time Left: {timeLeft}s</p>
      <p>
        Question {index + 1} of {quizQuestions.length}
      </p>

      <p>{q.question}</p>

      <ul>
        {q.choices.map((c, i) => (
          <li key={i}>
            <button onClick={() => handleAnswer(i)}>{c}</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
