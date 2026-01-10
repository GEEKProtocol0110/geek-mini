"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ResultContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const score = Number(params.get("score") ?? 0);
  const answered = Number(params.get("answered") ?? score);
  const mode = params.get("mode") ?? "daily";

  const accuracy =
    answered > 0 ? Math.round((score / answered) * 100) : 0;

  // ✅ Set cooldown AFTER finishing Speed
  useEffect(() => {
    if (mode === "speed") {
      localStorage.setItem("speed_last_play", Date.now().toString());
    }
    setMounted(true);
  }, [mode]);

  function handlePlayAgain() {
    if (mode === "speed") {
      const last = localStorage.getItem("speed_last_play");
      if (last && Date.now() - Number(last) < 30000) {
        alert("Speed mode cooldown: please wait a few seconds.");
        return;
      }
    }
    router.push(`/${mode}`);
  }

  const getPerformanceMessage = () => {
    if (accuracy === 100) return { emoji: "🏆", text: "Perfect Score!", color: "text-yellow-400" };
    if (accuracy >= 80) return { emoji: "🌟", text: "Excellent!", color: "text-green-400" };
    if (accuracy >= 60) return { emoji: "👍", text: "Good Job!", color: "text-blue-400" };
    if (accuracy >= 40) return { emoji: "💪", text: "Keep Practicing!", color: "text-purple-400" };
    return { emoji: "📚", text: "Keep Learning!", color: "text-pink-400" };
  };

  const performance = getPerformanceMessage();

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-300 animate-pulse">Loading results…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Header */}
        <div className="animate-[fadeIn_0.6s_ease-out]">
          <div className="text-8xl mb-4" style={{ animation: "fadeIn 0.8s ease-out 0.2s both" }}>
            {performance.emoji}
          </div>
          <h1 className={`text-5xl font-bold mb-2 ${performance.color}`} style={{ animation: "fadeIn 0.8s ease-out 0.3s both" }}>
            {performance.text}
          </h1>
          <p className="text-gray-400 text-lg" style={{ animation: "fadeIn 0.8s ease-out 0.4s both" }}>
            {mode === "daily" ? "Daily Challenge" : "Speed Round"} Results
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Score */}
          <div
            className="bg-gradient-to-br from-indigo-600/30 to-purple-600/30 backdrop-blur-lg p-6 rounded-2xl border border-indigo-500/50"
            style={{ animation: "slideInUp 0.6s ease-out 0.5s both" }}
          >
            <div className="text-6xl font-bold text-white mb-2">
              {score}
            </div>
            <div className="text-indigo-200 font-medium">Correct Answers</div>
          </div>

          {/* Total */}
          <div
            className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-lg p-6 rounded-2xl border border-purple-500/50"
            style={{ animation: "slideInUp 0.6s ease-out 0.6s both" }}
          >
            <div className="text-6xl font-bold text-white mb-2">
              {answered}
            </div>
            <div className="text-purple-200 font-medium">Questions Answered</div>
          </div>

          {/* Accuracy */}
          <div
            className="bg-gradient-to-br from-pink-600/30 to-red-600/30 backdrop-blur-lg p-6 rounded-2xl border border-pink-500/50"
            style={{ animation: "slideInUp 0.6s ease-out 0.7s both" }}
          >
            <div className="text-6xl font-bold text-white mb-2">
              {accuracy}%
            </div>
            <div className="text-pink-200 font-medium">Accuracy</div>
          </div>
        </div>

        {/* Accuracy Bar */}
        <div
          className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/20"
          style={{ animation: "slideInUp 0.6s ease-out 0.8s both" }}
        >
          <div className="text-sm text-gray-400 mb-3">Performance</div>
          <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
              style={{ 
                width: `${accuracy}%`,
                animation: "slideInUp 1s ease-out 0.9s both"
              }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="grid md:grid-cols-2 gap-4"
          style={{ animation: "fadeIn 0.6s ease-out 1s both" }}
        >
          <button
            onClick={handlePlayAgain}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/50"
          >
            🔄 Play Again
          </button>

          <button
            onClick={() => router.push("/")}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 border border-white/20"
          >
            🏠 Back to Home
          </button>
        </div>

        {/* Share Section */}
        <div
          className="text-gray-400 text-sm"
          style={{ animation: "fadeIn 0.6s ease-out 1.1s both" }}
        >
          <p>Share your score with friends! 🎉</p>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-300 animate-pulse">Loading results…</div>
      </main>
    }>
      <ResultContent />
    </Suspense>
  );
}

