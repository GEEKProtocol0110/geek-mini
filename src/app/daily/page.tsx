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

export default function DailyPage() {
  const router = useRouter();

  const [quizQuestions, setQuizQuestions] = useState<typeof questions>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  // Shuffle questions ONCE (client only)
  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuizQuestions(shuffled.slice(0, 5));
  }, []);

  // Shuffle answers when question changes
  useEffect(() => {
    if (quizQuestions[index]) {
      setAnswers(shuffleAnswers(quizQuestions[index]));
      setAnswered(false);
    }
  }, [index, quizQuestions]);

  const q = quizQuestions[index];

  if (!q) {
    return <main style={{ padding: 24 }}>Loading…</main>;
  }

  function handleAnswer(isCorrect: boolean) {
    if (answered) return;

    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setAnswered(true);
  }

  function nextQuestion() {
    if (index + 1 < quizQuestions.length) {
      setIndex((i) => i + 1);
    } else {
      router.push(`/result?score=${score}&mode=daily`);
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
        {answers.map((a, i) => (
          <li key={i}>
            <button onClick={() => handleAnswer(a.isCorrect)}>
              {a.text}
            </button>
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
