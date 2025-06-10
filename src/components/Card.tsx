import React from 'react';
import { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType;
  onClick: (id: number) => void;
  isDisabled: boolean;
}

export default function Card({ card, onClick, isDisabled }: CardProps) {
  const handleClick = () => {
    if (!isDisabled && !card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  return (
    <div
      className={`
        relative w-full aspect-square cursor-pointer transition-all duration-300
        ${card.isMatched ? 'scale-105' : 'hover:scale-105'}
        ${isDisabled || card.isFlipped || card.isMatched ? '' : 'hover:shadow-lg'}
      `}
      onClick={handleClick}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`
          relative w-full h-full transition-transform duration-500 preserve-3d
          ${card.isFlipped || card.isMatched ? '[transform:rotateY(180deg)]' : ''}
        `}
      >
        {/* Card Back */}
        <div
          className={`
            absolute inset-0 w-full h-full rounded-xl flex items-center justify-center
            bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
            border-2 border-white/20 shadow-lg backdrop-blur-sm backface-hidden
            ${card.isMatched ? 'opacity-0' : ''}
          `}
        >
          <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse" />
        </div>

        {/* Card Front */}
        <div
          className={`
            absolute inset-0 w-full h-full rounded-xl flex items-center justify-center
            [transform:rotateY(180deg)] text-4xl font-bold backface-hidden
            ${
              card.isMatched
                ? 'bg-gradient-to-br from-emerald-400 to-teal-500 animate-pulse'
                : 'bg-gradient-to-br from-white to-gray-50'
            }
            border-2 border-white/20 shadow-lg backdrop-blur-sm
          `}
        >
          <span className="drop-shadow-sm">{card.symbol}</span>
        </div>
      </div>
    </div>
  );
}