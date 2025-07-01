
import React, { useMemo } from 'react';
import { GAMES } from '../constants';
import GameCard from '../components/GameCard';
import { Game } from '../types';

const HomePage: React.FC = () => {
  const categorizedGames = useMemo(() => {
    return GAMES.reduce((acc, game) => {
      if (!acc[game.category]) {
        acc[game.category] = [];
      }
      acc[game.category].push(game);
      return acc;
    }, {} as Record<string, Game[]>);
  }, []);

  return (
    <div className="space-y-12">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-5xl md:text-6xl text-arkade-blue mb-2">Welcome to Retro Arkade!</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Your one-stop portal for the best classic Flash and HTML5 games from the golden era of web gaming. Log in to save your high scores and join the community!</p>
      </div>

      {Object.entries(categorizedGames).map(([category, games]) => (
        <div key={category}>
          <h2 className="text-4xl text-arkade-orange mb-6 border-b-4 border-arkade-orange pb-2">{category} Games</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
