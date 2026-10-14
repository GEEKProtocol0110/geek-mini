import { questionBank } from "./questionBank";
import type { QuizQuestion } from "../types/quiz";

export const speedFocuses = [
  { id: "mixed", label: "All Kaspa topics", topics: null, description: "A little of everything." },
  { id: "basics", label: "Kaspa basics", topics: ["Kaspa basics", "KAS units"], description: "Origins, core ideas and coin units." },
  { id: "network", label: "The network", topics: ["Blocks and consensus", "Network history", "Network events"], description: "Blocks, network history and accepted transactions." },
  { id: "wallets", label: "Wallets and payments", topics: ["Wallet basics", "Transactions"], description: "Wallet use, payment value and account tools." },
  { id: "builders", label: "Tokens and builders", topics: ["Builder basics", "Node basics", "Application data", "Programmability", "KRC-20"], description: "Tokens, nodes and application building blocks." },
] as const;
export type SpeedFocus = typeof speedFocuses[number]["id"];
export const isSpeedFocus = (value: unknown): value is SpeedFocus => speedFocuses.some(focus => focus.id === value);
export const speedFocusLabel = (value: unknown) => speedFocuses.find(focus => focus.id === value)?.label ?? speedFocuses[0].label;
export function questionsForFocus(value: unknown): QuizQuestion[] {
  const focus = speedFocuses.find(focus => focus.id === value) ?? speedFocuses[0];
  const topics: readonly string[] | null = focus.topics;
  return topics ? questionBank.filter(question => topics.includes(question.topic)) : questionBank;
}
export function speedLink(value: unknown) {
  return isSpeedFocus(value) && value !== "mixed" ? `/speed?focus=${value}` : "/speed";
}
