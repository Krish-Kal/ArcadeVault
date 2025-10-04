import React, { useEffect, useState, useMemo } from 'react';
import './GameSearchResult.css';
import { gamesList } from '../../pages/GamesPage/Gamedata';

// Debounce hook
function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const GameSearchResults = ({ searchQuery, addToWishlist, wishlist = [] }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Load local games data
  useEffect(() => {
    try {
      const preparedGames = gamesList.map((g) => ({
        ...g,
        website: g.website || g.link || g.metacritic || '#',
        background_image: g.background_image || g.imageUrl || '',
      }));
      setGames(preparedGames);
      try {
        sessionStorage.setItem('popularGames', JSON.stringify(preparedGames));
      } catch {}
    } catch (err) {
      console.error('Error loading games:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter games based on search query
  const filteredGames = useMemo(() => {
    const query = (debouncedSearchQuery || '').trim().toLowerCase();
    if (!query) return [];
    return games.filter((game) =>
      (game.name || '').toLowerCase().includes(query)
    );
  }, [games, debouncedSearchQuery]);

  if (!debouncedSearchQuery.trim()) return null;

  return (
    <div className="search-results-section">
      <h2>Search Results for "{debouncedSearchQuery.trim()}"</h2>

      {loading ? (
        <p className="loading-text">Loading games...</p>
      ) : filteredGames.length > 0 ? (
        <div className="search-results-grid">
          {filteredGames.map((game) => {
            const inWishlist = wishlist.some((g) => g.id === game.id);
            return (
              <div className="game-card" key={game.id}>
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="game-image"
                />
                <h3 className="game-name">{game.name}</h3>
                <p className="genre">
                  {game.genres?.map((g) => g.name).join(', ') || game.genre || 'Unknown Genre'}
                </p>
                <div className="button-container">
                  <button
                    onClick={() => window.open(game.website, '_blank')}
                    className="go-to-game-btn"
                  >
                    Go to Game
                  </button>
                  <button
                    onClick={() => addToWishlist(game)}
                    className="wishlist-btn"
                    disabled={inWishlist}
                  >
                    {inWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-results">No games found for "{debouncedSearchQuery.trim()}".</p>
      )}
    </div>
  );
};

export default GameSearchResults;
