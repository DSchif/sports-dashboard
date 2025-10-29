import React from 'react';

function GameCard({ game, onRemove }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{game.sportIcon}</span>
          <span className="text-sm font-semibold text-gray-600">{game.sport}</span>
        </div>
        <button
          onClick={() => onRemove(game.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Remove game"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {game.awayTeam.logo && (
              <img
                src={game.awayTeam.logo}
                alt={game.awayTeam.name}
                className="w-10 h-10 object-contain"
              />
            )}
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{game.awayTeam.name}</div>
              <div className="text-xs text-gray-500">{game.awayTeam.abbreviation}</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{game.awayTeam.score}</div>
        </div>

        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {game.homeTeam.logo && (
              <img
                src={game.homeTeam.logo}
                alt={game.homeTeam.name}
                className="w-10 h-10 object-contain"
              />
            )}
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{game.homeTeam.name}</div>
              <div className="text-xs text-gray-500">{game.homeTeam.abbreviation}</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{game.homeTeam.score}</div>
        </div>
      </div>

      {/* Game Status */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2">
          {game.isLive && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
          <span className={`text-sm font-medium ${game.isLive ? 'text-red-600' : 'text-gray-600'}`}>
            {game.statusDetail}
          </span>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
