"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import questions from "../../data/questions/kaspa.daily.json";

export default function DailyPage() {
  const router = useRouter();

  const [quizQuestions, setQuizQuestions] = useState<typeof questions>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  // ✅ Shuffle ONLY on the client, after mount
  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuizQuestions(shuffled.slice(0, 5));
  }, []);

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
  }

  function nextQuestion() {
    if (index + 1 < quizQuestions.length) {
      setIndex((i) => i + 1);
      setAnswered(false);
    } else {
      router.push(`/result?score=${score}`);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Geek Mini – Daily</h1>

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

      {answered && (
        <button onClick={nextQuestion} style={{ marginTop: 16 }}>
          {index + 1 < quizQuestions.length ? "Next Question" : "Finish"}
        </button>
      )}
    </main>
  );
}
