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
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

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
      setSelectedAnswer(null);
    }
  }, [index, quizQuestions]);

  const q = quizQuestions[index];

  if (!q) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-300 animate-pulse">Loading…</div>
      </main>
    );
  }

  function handleAnswer(isCorrect: boolean, answerIndex: number) {
    if (answered) return;

    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setSelectedAnswer(answerIndex);
    setAnswered(true);
  }

  function nextQuestion() {
    if (index + 1 < quizQuestions.length) {
      setIndex((i) => i + 1);
    } else {
      router.push(`/result?score=${score + (selectedAnswer !== null && answers[selectedAnswer]?.isCorrect ? 1 : 0)}&mode=daily`);
    }
  }

  const progress = ((index) / quizQuestions.length) * 100;

  return (
    <main className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="mb-8 animate-[fadeIn_0.5s_ease-out]">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white transition-colors mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Daily Challenge
            </h1>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{score}</div>
              <div className="text-sm text-gray-400">Score</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Question {index + 1} of {quizQuestions.length}
          </p>
        </div>

        {/* Question Card */}
        <div
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/20 mb-6"
          style={{ animation: "slideInUp 0.5s ease-out" }}
        >
          <p className="text-2xl font-semibold text-white leading-relaxed">
            {q.question}
          </p>
        </div>

        {/* Answers */}
        <div className="space-y-4">
          {answers.map((a, i) => {
            const isSelected = selectedAnswer === i;
            const showCorrect = answered && a.isCorrect;
            const showWrong = answered && isSelected && !a.isCorrect;

            let buttonClass = "w-full text-left p-6 rounded-xl font-medium transition-all duration-300 border-2 ";
            
            if (showCorrect) {
              buttonClass += "bg-green-500/20 border-green-500 text-white shadow-lg shadow-green-500/50 animate-[correctAnswer_0.5s_ease-out]";
            } else if (showWrong) {
              buttonClass += "bg-red-500/20 border-red-500 text-white shadow-lg shadow-red-500/50 animate-[wrongAnswer_0.5s_ease-out]";
            } else if (answered) {
              buttonClass += "bg-white/5 border-white/20 text-gray-400 cursor-not-allowed";
            } else {
              buttonClass += "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-indigo-500 hover:scale-102 hover:shadow-lg hover:shadow-indigo-500/30 cursor-pointer";
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(a.isCorrect, i)}
                disabled={answered}
                className={buttonClass}
                style={{ animation: `slideInUp 0.5s ease-out ${0.1 * i}s both` }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div className="flex-grow text-lg">{a.text}</div>
                  {showCorrect && (
                    <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {showWrong && (
                    <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        {answered && (
          <div className="mt-8 animate-[fadeIn_0.5s_ease-out]">
            <button
              onClick={nextQuestion}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/50"
            >
              {index + 1 < quizQuestions.length ? "Next Question →" : "See Results 🎉"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
