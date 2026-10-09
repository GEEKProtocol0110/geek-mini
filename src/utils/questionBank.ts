import questions from "../data/questions/kaspa.daily.json";
import type { QuizQuestion } from "../types/quiz";

export const questionBank: QuizQuestion[] = questions;
// A receipt must not silently attach revised answers to an older round.
let fingerprint = 2166136261;
for (const char of JSON.stringify(questions)) {
  fingerprint = Math.imul(fingerprint ^ char.charCodeAt(0), 16777619);
}
export const bankVersion = (fingerprint >>> 0).toString(16);
export const questionById = new Map(questionBank.map(question => [question.id, question]));

export interface RoundReview { questionId: string; selected: number | null }

export function validReview(value: unknown, score: number, total: number, mode: string): value is RoundReview[] {
  if (!Array.isArray(value) || value.length > (mode === "daily" ? 5 : 10)) return false;
  const seen = new Set<string>();
  let answered = 0, correct = 0, unanswered = 0;
  for (const item of value) {
    if (!item || typeof item !== "object" || typeof item.questionId !== "string" || seen.has(item.questionId)) return false;
    const question = questionById.get(item.questionId);
    if (!question) return false;
    seen.add(item.questionId);
    if (item.selected === null) {
      unanswered += 1;
      // Only the current question can remain unanswered when Speed expires.
      if (mode !== "speed" || item !== value[value.length - 1] || unanswered > 1) return false;
    } else {
      if (!Number.isInteger(item.selected) || item.selected < 0 || item.selected >= question.choices.length) return false;
      answered += 1;
      if (item.selected === question.answer) correct += 1;
    }
  }
  return answered === total && correct === score;
}

export function isUtcDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
