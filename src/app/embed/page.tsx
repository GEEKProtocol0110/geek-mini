"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmbedPage() {
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
    <main style={{ padding: 24 }}>
      <p>Launching Geek Mini…</p>
    </main>
  );
}
