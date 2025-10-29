import React, { useEffect, useState } from 'react';
import { fetchLiveGames } from '../services/espnApi';

function GameSelectionModal({ isOpen, onClose, onSelectGame, selectedGameIds }) {
  const [availableGames, setAvailableGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadGames();
    }
  }, [isOpen]);

  const loadGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const games = await fetchLiveGames();
      setAvailableGames(games);
    } catch (err) {
      setError('Failed to load games. Please try again.');
      console.error('Error loading games:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleGameSelect = (game) => {
    onSelectGame(game);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Select a Game</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
              <button
                onClick={loadGames}
                className="ml-4 text-red-600 hover:text-red-800 font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && availableGames.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No live games or upcoming games found.</p>
              <p className="text-sm mt-2">Check back later when games are in progress!</p>
            </div>
          )}

          {!loading && !error && availableGames.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableGames.map((game) => {
                const isAlreadyAdded = selectedGameIds.includes(game.id);
                return (
                  <button
                    key={game.id}
                    onClick={() => !isAlreadyAdded && handleGameSelect(game)}
                    disabled={isAlreadyAdded}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      isAlreadyAdded
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-500 hover:shadow-md cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{game.sportIcon}</span>
                      <span className="text-sm font-semibold text-gray-600">{game.sport}</span>
                      {game.isLive && (
                        <span className="ml-auto px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                          LIVE
                        </span>
                      )}
                      {isAlreadyAdded && (
                        <span className="ml-auto px-2 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded">
                          ADDED
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {game.awayTeam.logo && (
                            <img
                              src={game.awayTeam.logo}
                              alt={game.awayTeam.name}
                              className="w-8 h-8 object-contain"
                            />
                          )}
                          <span className="font-semibold text-gray-900">{game.awayTeam.abbreviation}</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{game.awayTeam.score}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {game.homeTeam.logo && (
                            <img
                              src={game.homeTeam.logo}
                              alt={game.homeTeam.name}
                              className="w-8 h-8 object-contain"
                            />
                          )}
                          <span className="font-semibold text-gray-900">{game.homeTeam.abbreviation}</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{game.homeTeam.score}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-600 text-center">
                      {game.statusDetail}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameSelectionModal;
