"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main style={{ padding: 24 }}>
      <h1>Geek Mini</h1>
      <p>Quick knowledge games powered by Geek Protocol.</p>

      <div style={{ marginTop: 24 }}>
        <button
          onClick={() => router.push("/daily")}
          style={{ marginRight: 12 }}
        >
          Play Daily
        </button>

        <button onClick={() => router.push("/speed")}>
          Play Speed
        </button>
      </div>
    </main>
  );
}
