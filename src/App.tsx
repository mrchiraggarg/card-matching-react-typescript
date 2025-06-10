import React, { useState } from 'react';
import { Brain, Github, Heart } from 'lucide-react';
import GameBoard from './components/GameBoard';
import { Difficulty } from './types/game';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-400 to-red-500 rounded-full filter blur-3xl animate-bounce" 
               style={{ animationDelay: '2s', animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full filter blur-3xl animate-bounce" 
               style={{ animationDelay: '1s', animationDuration: '3s' }} />
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="text-center py-8 px-4">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Memory Master
              </h1>
              <p className="text-lg md:text-xl text-white/80 font-medium">
                Test your memory with this beautiful card matching game
              </p>
            </div>
          </div>
        </header>

        {/* Game */}
        <main className="px-4 pb-8">
          <GameBoard 
            difficulty={difficulty} 
            onDifficultyChange={setDifficulty}
          />
        </main>

        {/* Footer */}
        <footer className="text-center py-8 px-4 border-t border-white/10">
          <div className="flex items-center justify-center space-x-2 text-white/70">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400 animate-pulse" />
            <span>using React & TypeScript</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;