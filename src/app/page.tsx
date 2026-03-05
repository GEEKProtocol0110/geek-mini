"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getStats } from "../utils/storage";
import { playClickSound } from "../utils/sounds";
import type { QuizStats } from "../types/quiz";

export default function HomePage() {
  const router = useRouter();
  const [stats] = useState<QuizStats>(() => getStats());

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8 animate-[fadeIn_0.6s_ease-out]">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-block">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Geek Mini
            </h1>
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <p className="text-xl text-gray-300">
            Quick knowledge games powered by Geek Protocol
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Daily Mode */}
          <div
            onClick={() => {
              playClickSound();
              router.push("/daily");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                playClickSound();
                router.push("/daily");
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Start Daily Challenge"
            className="group relative bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/50 focus:scale-105 focus:shadow-2xl focus:shadow-indigo-500/50"
            style={{ animation: "slideInUp 0.6s ease-out 0.2s both" }}
          >
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">📅</div>
              <h2 className="text-3xl font-bold mb-3">Daily Challenge</h2>
              <p className="text-indigo-100 mb-6">
                5 questions to test your knowledge. Perfect your score!
              </p>
              <div className="inline-flex items-center text-white font-semibold">
                Start Quiz
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Speed Mode */}
          <div
            onClick={() => {
              playClickSound();
              router.push("/speed");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                playClickSound();
                router.push("/speed");
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Start Speed Round"
            className="group relative bg-gradient-to-br from-pink-600 to-red-600 p-8 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/50 focus:scale-105 focus:shadow-2xl focus:shadow-pink-500/50"
            style={{ animation: "slideInUp 0.6s ease-out 0.4s both" }}
          >
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">⚡</div>
              <h2 className="text-3xl font-bold mb-3">Speed Round</h2>
              <p className="text-pink-100 mb-6">
                Beat the clock! Answer as many as you can in 30 seconds.
              </p>
              <div className="inline-flex items-center text-white font-semibold">
                Start Challenge
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats.totalGames > 0 && (
          <div
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
            style={{ animation: "slideInUp 0.6s ease-out 0.6s both" }}
          >
            <div className="p-4 bg-white/5 backdrop-blur rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalGames}</div>
              <div className="text-xs text-gray-400 mt-1">Games Played</div>
            </div>
            <div className="p-4 bg-white/5 backdrop-blur rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-bold text-white">{stats.avgAccuracy}%</div>
              <div className="text-xs text-gray-400 mt-1">Avg Accuracy</div>
            </div>
            <div className="p-4 bg-white/5 backdrop-blur rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-bold text-indigo-400">
                {stats.bestDaily?.accuracy || 0}%
              </div>
              <div className="text-xs text-gray-400 mt-1">Best Daily</div>
            </div>
            <div className="p-4 bg-white/5 backdrop-blur rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-bold text-pink-400">
                {stats.bestSpeed?.score || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">Best Speed</div>
            </div>
          </div>
        )}

        <div
          className="mt-6 p-6 bg-white/5 backdrop-blur rounded-xl border border-white/10"
          style={{ animation: "slideInUp 0.6s ease-out 0.7s both" }}
        >
          <p className="text-sm text-gray-400 mb-2">Powered by</p>
          <p className="text-lg font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Geek Protocol
          </p>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Use keys 1-4 to answer questions quickly!
          </p>
        </div>
      </div>
    </main>
  );
}
