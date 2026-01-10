"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import questions from "../../data/questions/kaspa.daily.json";
import { playCorrectSound, playWrongSound, playClickSound } from "../../utils/sounds";

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
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

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

  /* ---------------- KEYBOARD SHORTCUTS ---------------- */
  useEffect(() => {
    if (cooldownLeft !== null || !q) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (answered) return;
      
      const key = parseInt(e.key);
      if (key >= 1 && key <= answers.length) {
        handleAnswer(answers[key - 1].isCorrect);
      }{
      setScore((s) => s + 1);
      setStreak((s) => {
        const newStreak = s + 1;
        setMaxStreak((max) => Math.max(max, newStreak));
        return newStreak;
      });
      playCorrectSound();
    } else {
      setStreak(0);
      playWrongSound();
    }

    setTimeout(() => {
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [answered, answers, q, cooldownLeft]);

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
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 animate-[fadeIn_0.5s_ease-out]">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="{
              playClickSound();
              router.push("/");
            }ld text-white mb-4">
              Speed Mode Cooldown
            </h1>
            <p className="text-gray-300 mb-6">
              Please wait before playing again
            </p>
            <div className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              {cooldownLeft}s
            </div>
          </div>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-white/20"
          >
            ← Back to Home
          </button>
        </div>
      </main>
    );
  }

  if (!q) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-300 animate-pulse">Loading…</div>
      </main>
    );
  }

  const timePercentage = (timeLeft / 30) * 100;
  const isLowTime = timeLeft <= 10;

  return (
    <main className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="mb-8 animate-[fadeIn_0.5s_ease-out]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              Speed Round
            </h1>
            
            {/* Timer */}
            <div className="relative">
              <div className="text-center">
                <div className={`text-5xl font-bold ${isLowTime ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  {timeLeft}
                </div>
                <div className="text-sm text-gray-400">seconds</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-4">
            <div
              className={`absolute h-full transition-all duration-1000 ease-linear ${
                isLowTime
                  ? 'bg-gradient-to-r from-red-600 to-red-500'
                  : 'bg-gradient-to-r from-pink-600 to-red-500'
              }`}
              style={{ width: `${timePercentage}%` }}
            ></div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              Question {index + 1} / {quizQuestions.length}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-gray-400">
                Answered: <span className="text-white font-semibold">{answeredCount}</span>
              </div>
              {streak > 1 && (
                <div className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full border border-orange-500/30 animate-pulse">
                  🔥 {streak}
                </div>
              )}
              <div className="text-gray-400">
                Score: <span className="text-white font-semibold">{score}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/20 mb-6"
          key={index}
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <p className="text-2xl font-semibold text-white leading-relaxed">
            {q.question}
          </p>
        </div>

        {/* Answers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {answers.map((a, i) => {
            const showFeedback = selectedCorrect !== null;
            const isCorrectAnswer = a.isCorrect;
            const showCorrect = showFeedback && isCorrectAnswer;
            const showWrong = showFeedback && !isCorrectAnswer;

            let buttonClass = "w-full text-left p-6 rounded-xl font-medium transition-all duration-200 border-2 ";
            
            if (showCorrect) {
              buttonClass += "bg-green-500/30 border-green-500 text-white shadow-lg shadow-green-500/50";
            } else if (showWrong) {
              buttonClass += "bg-red-500/30 border-red-500 text-white shadow-lg shadow-red-500/50";
            } else {
              buttonClass += "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-pink-500 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30 cursor-pointer active:scale-95";
            }

            return (
              <buttoni + 1
                key={i}
                onClick={() => handleAnswer(a.isCorrect)}
                disabled={answered}
                className={buttonClass}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div className="flex-grow text-lg">{a.text}</div>
                  {showCorrect && (
                    <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {showWrong && (
                    <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
