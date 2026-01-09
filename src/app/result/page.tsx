"use client";

import { useSearchParams } from "next/navigation";

export default function ResultPage() {
  const params = useSearchParams();
  const score = params.get("score") ?? "0";

  return (
    <main style={{ padding: 24 }}>
      <h1>Geek Mini – Results</h1>
      <p>Your score: {score}</p>
    </main>
  );
}

