import { useState, useEffect } from 'react'
import GameCard from './components/GameCard'
import AddGameButton from './components/AddGameButton'
import GameSelectionModal from './components/GameSelectionModal'
import { fetchLiveGames } from './services/espnApi'

function App() {
  const [selectedGames, setSelectedGames] = useState(() => {
    // Initialize state from localStorage
    try {
      const savedGames = localStorage.getItem('selectedGames')
      if (savedGames) {
        const parsedGames = JSON.parse(savedGames)
        // Convert startTime strings back to Date objects
        return parsedGames.map(game => ({
          ...game,
          startTime: new Date(game.startTime)
        }))
      }
    } catch (error) {
      console.error('Error loading saved games:', error)
    }
    return []
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Save selected games to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('selectedGames', JSON.stringify(selectedGames))
    } catch (error) {
      console.error('Error saving games:', error)
    }
  }, [selectedGames])

  // Auto-refresh live scores every 30 seconds
  useEffect(() => {
    if (selectedGames.length === 0) return

    const interval = setInterval(async () => {
      try {
        const allGames = await fetchLiveGames()
        setSelectedGames(prevGames => {
          return prevGames.map(prevGame => {
            const updatedGame = allGames.find(g => g.id === prevGame.id)
            return updatedGame || prevGame
          })
        })
        setLastRefresh(new Date())
      } catch (error) {
        console.error('Error refreshing scores:', error)
      }
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [selectedGames.length])

  const handleAddGame = (game) => {
    if (!selectedGames.find(g => g.id === game.id)) {
      setSelectedGames([...selectedGames, game])
    }
  }

  const handleRemoveGame = (gameId) => {
    setSelectedGames(selectedGames.filter(g => g.id !== gameId))
  }

  const selectedGameIds = selectedGames.map(g => g.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Live Sports Dashboard</h1>
            {selectedGames.length > 0 && (
              <div className="text-sm text-gray-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {selectedGames.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Welcome to your Sports Dashboard
              </h2>
              <p className="text-gray-500">
                Click the button below to add live games and upcoming matches
              </p>
            </div>
            <div className="max-w-sm mx-auto flex justify-center">
              <AddGameButton onClick={() => setIsModalOpen(true)} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onRemove={handleRemoveGame}
              />
            ))}
            <AddGameButton onClick={() => setIsModalOpen(true)} />
          </div>
        )}
      </main>

      <GameSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectGame={handleAddGame}
        selectedGameIds={selectedGameIds}
      />
    </div>
  )
}

export default App
