import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import Card from './Card';
import GameStats from './GameStats';
import { createDeck, saveScore, DIFFICULTY_CONFIGS } from '../utils/gameLogic';
import { GameState, Difficulty } from '../types/game';

interface GameBoardProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export default function GameBoard({ difficulty, onDifficultyChange }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState>(() => ({
    cards: createDeck(difficulty),
    flippedCards: [],
    moves: 0,
    matches: 0,
    isWon: false,
    startTime: null,
    endTime: null
  }));

  const [time, setTime] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const config = DIFFICULTY_CONFIGS[difficulty];
  const totalPairs = (config.rows * config.cols) / 2;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.startTime && !gameState.endTime) {
      interval = setInterval(() => {
        setTime(Math.floor((Date.now() - gameState.startTime!) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.startTime, gameState.endTime]);

  // Win condition check
  useEffect(() => {
    if (gameState.matches === totalPairs && gameState.matches > 0) {
      const endTime = Date.now();
      const finalTime = Math.floor((endTime - gameState.startTime!) / 1000);
      
      setGameState(prev => ({ ...prev, isWon: true, endTime }));
      setTime(finalTime);
      setShowCelebration(true);
      
      // Save score
      saveScore(difficulty, gameState.moves, finalTime);
      
      // Hide celebration after 3 seconds
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [gameState.matches, totalPairs, gameState.startTime, difficulty, gameState.moves]);

  const handleCardClick = useCallback((cardId: number) => {
    setGameState(prev => {
      // Start timer on first move
      if (!prev.startTime) {
        prev = { ...prev, startTime: Date.now() };
      }

      const newCards = [...prev.cards];
      const clickedCard = newCards[cardId];
      
      if (clickedCard.isFlipped || clickedCard.isMatched || prev.flippedCards.length >= 2) {
        return prev;
      }

      clickedCard.isFlipped = true;
      const newFlippedCards = [...prev.flippedCards, cardId];
      let newMoves = prev.moves;
      let newMatches = prev.matches;

      if (newFlippedCards.length === 2) {
        newMoves += 1;
        const [firstId, secondId] = newFlippedCards;
        const firstCard = newCards[firstId];
        const secondCard = newCards[secondId];

        if (firstCard.symbol === secondCard.symbol) {
          // Match found
          firstCard.isMatched = true;
          secondCard.isMatched = true;
          newMatches += 1;
          
          return {
            ...prev,
            cards: newCards,
            flippedCards: [],
            moves: newMoves,
            matches: newMatches
          };
        } else {
          // No match - flip back after delay
          setTimeout(() => {
            setGameState(current => ({
              ...current,
              cards: current.cards.map(card => 
                newFlippedCards.includes(card.id) && !card.isMatched
                  ? { ...card, isFlipped: false }
                  : card
              ),
              flippedCards: []
            }));
          }, 1000);
        }
      }

      return {
        ...prev,
        cards: newCards,
        flippedCards: newFlippedCards,
        moves: newMoves,
        matches: newMatches
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      cards: createDeck(difficulty),
      flippedCards: [],
      moves: 0,
      matches: 0,
      isWon: false,
      startTime: null,
      endTime: null
    });
    setTime(0);
    setShowCelebration(false);
  }, [difficulty]);

  // Reset game when difficulty changes
  useEffect(() => {
    resetGame();
  }, [difficulty, resetGame]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-center animate-bounce">
            <Sparkles className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-4xl font-bold text-white drop-shadow-lg">Congratulations!</h2>
            <p className="text-xl text-white/90 drop-shadow-md">You won in {gameState.moves} moves!</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse" />
        </div>
      )}

      {/* Difficulty Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {Object.entries(DIFFICULTY_CONFIGS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => onDifficultyChange(key as Difficulty)}
            className={`
              px-6 py-3 rounded-xl font-medium transition-all duration-200 border-2
              ${difficulty === key
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-300 shadow-lg scale-105'
                : 'bg-white/80 text-gray-700 border-gray-200 hover:border-indigo-300 hover:scale-105'
              }
            `}
          >
            {config.name}
          </button>
        ))}
      </div>

      {/* Game Stats */}
      <GameStats
        moves={gameState.moves}
        time={time}
        matches={gameState.matches}
        totalPairs={totalPairs}
        difficulty={difficulty}
        onReset={resetGame}
      />

      {/* Game Board */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/30">
        <div 
          className="grid gap-3 md:gap-4 w-full"
          style={{
            gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
            gridTemplateRows: `repeat(${config.rows}, 1fr)`
          }}
        >
          {gameState.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={handleCardClick}
              isDisabled={gameState.flippedCards.length >= 2 || gameState.isWon}
            />
          ))}
        </div>
      </div>

      {/* Reset Button for Mobile */}
      <div className="flex justify-center md:hidden">
        <button
          onClick={resetGame}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg"
        >
          <RefreshCw className="w-5 h-5" />
          <span>New Game</span>
        </button>
      </div>
    </div>
  );
}