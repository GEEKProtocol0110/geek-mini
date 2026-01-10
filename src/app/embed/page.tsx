"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function EmbedContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const mode = params.get("mode");

    if (mode === "daily") {
      router.replace("/daily");
    } else if (mode === "speed") {
      router.replace("/speed");
    } else {
      router.replace("/");
    }
  }, [params, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-2xl text-gray-300 animate-pulse">Launching Geek Mini…</div>
    </main>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-300 animate-pulse">Loading…</div>
      </main>
    }>
      <EmbedContent />
    </Suspense>
  );
}
