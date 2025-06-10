import { Card, Difficulty, DifficultyConfig, GameStats } from '../types/game';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: { rows: 4, cols: 4, name: 'Easy (4×4)' },
  medium: { rows: 4, cols: 6, name: 'Medium (4×6)' },
  hard: { rows: 6, cols: 6, name: 'Hard (6×6)' }
};

export const CARD_SYMBOLS = [
  '🌟', '🎈', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸',
  '🌈', '🌺', '🌸', '🌼', '🍀', '🍎', '🍊', '🍋',
  '🦄', '🦋', '🐙', '🐠', '🐢', '🦜', '🦚', '🦊',
  '💎', '💫', '⭐', '🔥', '❄️', '🌙', '☀️', '🌊',
  '🎃', '🎄', '🎆', '🎇', '✨', '💖', '💜', '💙'
];

export function createDeck(difficulty: Difficulty): Card[] {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const totalCards = config.rows * config.cols;
  const pairCount = totalCards / 2;
  
  const selectedSymbols = CARD_SYMBOLS.slice(0, pairCount);
  const cardPairs = [...selectedSymbols, ...selectedSymbols];
  
  return shuffleArray(cardPairs).map((symbol, index) => ({
    id: index,
    symbol,
    isFlipped: false,
    isMatched: false
  }));
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function saveScore(difficulty: Difficulty, moves: number, time: number): void {
  const scores = getScores(difficulty);
  const newScore: GameStats = {
    difficulty: DIFFICULTY_CONFIGS[difficulty].name,
    moves,
    time,
    date: new Date().toISOString()
  };
  
  scores.push(newScore);
  scores.sort((a, b) => {
    // First sort by moves (fewer is better)
    if (a.moves !== b.moves) return a.moves - b.moves;
    // Then by time (faster is better)
    return a.time - b.time;
  });
  
  // Keep only top 5 scores
  const topScores = scores.slice(0, 5);
  localStorage.setItem(`memoryGame_${difficulty}`, JSON.stringify(topScores));
}

export function getScores(difficulty: Difficulty): GameStats[] {
  const stored = localStorage.getItem(`memoryGame_${difficulty}`);
  return stored ? JSON.parse(stored) : [];
}

export function getBestScore(difficulty: Difficulty): GameStats | null {
  const scores = getScores(difficulty);
  return scores.length > 0 ? scores[0] : null;
}