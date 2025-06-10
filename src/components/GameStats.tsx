import React from 'react';
import { Clock, RotateCcw, Trophy, Zap } from 'lucide-react';
import { formatTime, getBestScore } from '../utils/gameLogic';
import { Difficulty } from '../types/game';

interface GameStatsProps {
  moves: number;
  time: number;
  matches: number;
  totalPairs: number;
  difficulty: Difficulty;
  onReset: () => void;
}

export default function GameStats({ 
  moves, 
  time, 
  matches, 
  totalPairs, 
  difficulty,
  onReset 
}: GameStatsProps) {
  const bestScore = getBestScore(difficulty);
  const progress = (matches / totalPairs) * 100;

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-2">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{moves}</div>
          <div className="text-sm text-gray-600">Moves</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-2">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{formatTime(time)}</div>
          <div className="text-sm text-gray-600">Time</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-2">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{matches}/{totalPairs}</div>
          <div className="text-sm text-gray-600">Matches</div>
        </div>

        <div className="text-center">
          <button
            onClick={onReset}
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-2 hover:scale-110 transition-transform duration-200 shadow-lg"
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </button>
          <div className="text-xs text-gray-600">Reset Game</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Best Score */}
      {bestScore && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-gray-800">Best Score</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-800">{bestScore.moves} moves</div>
              <div className="text-sm text-gray-600">{formatTime(bestScore.time)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}