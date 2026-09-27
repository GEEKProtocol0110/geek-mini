import questions from "../data/questions/kaspa.daily.json";
import type { QuizMode, QuizQuestion } from "../types/quiz";

export interface Round {
  question: QuizQuestion;
  choices: { text: string; isCorrect: boolean }[];
}

function seedFor(value: string): number {
  let seed = 2166136261;
  for (const char of value) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
  return seed >>> 0;
}

function shuffle<T>(values: readonly T[], random: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function seededRandom(seed: number): () => number {
  let state = seed || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

export function buildRounds(mode: QuizMode, utcDate = new Date().toISOString().slice(0, 10)): Round[] {
  const random = mode === "daily" ? seededRandom(seedFor(utcDate)) : Math.random;
  const count = mode === "daily" ? 5 : 10;
  return shuffle(questions as QuizQuestion[], random).slice(0, count).map((question) => ({
    question,
    choices: shuffle(
      question.choices.map((text, index) => ({ text, isCorrect: index === question.answer })),
      mode === "daily" ? seededRandom(seedFor(`${utcDate}:${question.id}`)) : Math.random,
    ),
  }));
}
