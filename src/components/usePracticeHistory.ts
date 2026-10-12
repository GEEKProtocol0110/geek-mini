"use client";

import { useCallback, useEffect, useState } from "react";
import { readScoreHistory, type GameScore } from "../utils/storage";

export function usePracticeHistory() {
  const [history, setHistory] = useState<{ scores: GameScore[]; available: boolean; loaded: boolean; utcDate: string }>({ scores: [], available: true, loaded: false, utcDate: "" });
  const reload = useCallback(() => setHistory({ ...readScoreHistory(), loaded: true, utcDate: new Date().toISOString().slice(0, 10) }), []);
  useEffect(() => {
    const setup = setTimeout(reload, 0);
    const midnightCheck = setInterval(reload, 60000);
    window.addEventListener("focus", reload);
    window.addEventListener("pageshow", reload);
    window.addEventListener("storage", reload);
    document.addEventListener("visibilitychange", reload);
    return () => {
      clearTimeout(setup); clearInterval(midnightCheck);
      window.removeEventListener("focus", reload); window.removeEventListener("pageshow", reload);
      window.removeEventListener("storage", reload); document.removeEventListener("visibilitychange", reload);
    };
  }, [reload]);
  return { ...history, reload };
}
