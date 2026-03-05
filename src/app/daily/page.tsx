"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import questions from "../../data/questions/kaspa.daily.json";
import { playClickSound, playCorrectSound, playWrongSound } from "../../utils/sounds";
import type { QuizAnswerOption, QuizQuestion } from "../../types/quiz";

const DAILY_QUESTION_COUNT = 5;

interface DailyRound {
  question: QuizQuestion;
  answers: QuizAnswerOption[];
}

function shuffleAnswers(question: QuizQuestion): QuizAnswerOption[] {
  const entries = question.choices.map((text, index) => ({
    text,
    isCorrect: index === question.answer,
  }));

  return [...entries].sort(() => Math.random() - 0.5);
}

function buildDailyRounds(): DailyRound[] {
  const shuffledQuestions = [...(questions as QuizQuestion[])]
    .sort(() => Math.random() - 0.5)
    .slice(0, DAILY_QUESTION_COUNT);

  return shuffledQuestions.map((question) => ({
    question,
    answers: shuffleAnswers(question),
  }));
}

export default function DailyPage() {
  const router = useRouter();

  const [rounds] = useState<DailyRound[]>(() => buildDailyRounds());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  const currentRound = rounds[index];
  const answers = useMemo(() => currentRound?.answers ?? [], [currentRound]);

  const handleAnswer = useCallback(
    (isCorrect: boolean, answerIndex: number) => {
      if (answered) return;

      if (isCorrect) {
        setScore((value) => value + 1);
        setStreak((value) => value + 1);
        playCorrectSound();
      } else {
        setStreak(0);
        playWrongSound();
      }

      setSelectedAnswer(answerIndex);
      setAnswered(true);
    },
    [answered]
  );

  const nextQuestion = useCallback(() => {
    playClickSound();

    if (index + 1 < rounds.length) {
      setIndex((value) => value + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      return;
    }

    const selectedIsCorrect =
      selectedAnswer !== null ? Boolean(answers[selectedAnswer]?.isCorrect) : false;
    const finalScore = score + (selectedIsCorrect ? 1 : 0);

    router.push(`/result?score=${finalScore}&mode=daily`);
  }, [answers, index, rounds.length, router, score, selectedAnswer]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (answered) {
        if (event.key === "Enter") nextQuestion();
        return;
      }

      const parsed = Number.parseInt(event.key, 10);
      if (parsed >= 1 && parsed <= answers.length) {
        handleAnswer(answers[parsed - 1].isCorrect, parsed - 1);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [answered, answers, handleAnswer, nextQuestion]);

  const progress = useMemo(() => {
    if (!rounds.length) return 0;
    return (index / rounds.length) * 100;
  }, [index, rounds.length]);

  if (!currentRound) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-300 animate-pulse">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full">
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
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Daily Challenge
              </h1>
              {streak > 1 && (
                <div className="text-xs mt-2 px-2 py-1 inline-flex bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30 animate-pulse">
                  Fire streak: {streak}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{score}</div>
              <div className="text-sm text-gray-400">Score</div>
            </div>
          </div>

          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Question {index + 1} of {rounds.length}
          </p>
        </div>

        <div
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/20 mb-6 shadow-xl"
          style={{ animation: "slideInUp 0.5s ease-out" }}
        >
          <p className="text-2xl font-semibold text-white leading-relaxed">{currentRound.question.question}</p>
        </div>

        <div className="space-y-4">
          {answers.map((answer, optionIndex) => {
            const isSelected = selectedAnswer === optionIndex;
            const showCorrect = answered && answer.isCorrect;
            const showWrong = answered && isSelected && !answer.isCorrect;

            let buttonClass = "w-full text-left p-6 rounded-xl font-medium transition-all duration-300 border-2 ";

            if (showCorrect) {
              buttonClass +=
                "bg-green-500/20 border-green-500 text-white shadow-lg shadow-green-500/50 animate-[correctAnswer_0.5s_ease-out]";
            } else if (showWrong) {
              buttonClass +=
                "bg-red-500/20 border-red-500 text-white shadow-lg shadow-red-500/50 animate-[wrongAnswer_0.5s_ease-out]";
            } else if (answered) {
              buttonClass += "bg-white/5 border-white/20 text-gray-400 cursor-not-allowed";
            } else {
              buttonClass +=
                "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-indigo-500 hover:scale-102 hover:shadow-lg hover:shadow-indigo-500/30 cursor-pointer";
            }

            return (
              <button
                key={`${currentRound.question.id}-${optionIndex}`}
                onClick={() => handleAnswer(answer.isCorrect, optionIndex)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleAnswer(answer.isCorrect, optionIndex);
                  }
                }}
                disabled={answered}
                className={buttonClass}
                style={{ animation: `slideInUp 0.5s ease-out ${0.1 * optionIndex}s both` }}
                aria-label={`Answer ${optionIndex + 1}: ${answer.text}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">
                    {optionIndex + 1}
                  </div>
                  <div className="flex-grow text-lg">{answer.text}</div>
                  {showCorrect && (
                    <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {showWrong && (
                    <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-8 animate-[fadeIn_0.5s_ease-out]">
            <button
              onClick={nextQuestion}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/50"
              aria-label={index + 1 < rounds.length ? "Go to next question" : "View results"}
            >
              {index + 1 < rounds.length ? "Next Question (Press Enter)" : "See Results"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
