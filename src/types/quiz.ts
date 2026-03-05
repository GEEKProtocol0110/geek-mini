export type QuizMode = "daily" | "speed";

export interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  answer: number;
  explain: string;
}

export interface QuizAnswerOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizStats {
  totalGames: number;
  dailyGames: number;
  speedGames: number;
  avgAccuracy: number;
  bestDaily: {
    accuracy: number;
  } | null;
  bestSpeed: {
    score: number;
  } | null;
}