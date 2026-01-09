"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ResultPage() {
  const router = useRouter();
  const params = useSearchParams();

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

  return (
    <main style={{ padding: 24 }}>
      <h1>Geek Mini – Results</h1>

      <p>Mode: {mode}</p>
      <p>Score: {score}</p>
      <p>Answered: {answered}</p>
      <p>Accuracy: {accuracy}%</p>

      <div style={{ marginTop: 24 }}>
        <button onClick={handlePlayAgain}>
          Play Again
        </button>

        <button
          onClick={() => router.push("/")}
          style={{ marginLeft: 12 }}
        >
          Home
        </button>
      </div>
    </main>
  );
}

