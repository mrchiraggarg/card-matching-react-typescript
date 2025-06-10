export interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: Card[];
  flippedCards: number[];
  moves: number;
  matches: number;
  isWon: boolean;
  startTime: number | null;
  endTime: number | null;
}

export interface GameStats {
  difficulty: string;
  moves: number;
  time: number;
  date: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  rows: number;
  cols: number;
  name: string;
}