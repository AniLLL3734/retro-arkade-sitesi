
import React from 'react';
import { Link } from 'react-router-dom';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Link to={`/game/${game.id}`} className="group block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      <div className="relative">
        <img src={game.thumbnail} alt={game.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-opacity duration-300"></div>
      </div>
      <div className="p-4">
        <h3 className="text-xl text-arkade-blue group-hover:text-arkade-orange transition-colors duration-300">{game.name}</h3>
      </div>
    </Link>
  );
};

export default GameCard;
