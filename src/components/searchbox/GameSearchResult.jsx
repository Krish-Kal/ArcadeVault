import React, { useEffect, useState } from 'react';
import Searchbox from './Gamesearch';
import './GameSearchResult.css';

// Debounce hook
function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const GameSearchResults = ({ searchQuery, addToWishlist, wishlist }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Fetch popular games with website URLs once
  useEffect(() => {
    const cachedGames = JSON.parse(sessionStorage.getItem('popularGames') || '[]');

    if (cachedGames.length > 0) {
      setGames(cachedGames);
      return;
    }

    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games/lists/popular?key=dbdfb4c288374e7b8e71571677db40fa&page_size=50`
        );
        const data = await response.json();
        // Enrich games with website URLs
        const enrichedGames = await Promise.all(
          data.results.map(async (game) => {
            try {
              const res = await fetch(
                `https://api.rawg.io/api/games/${game.id}?key=dbdfb4c288374e7b8e71571677db40fa`
              );
              const details = await res.json();
              return { ...game, website: details.website || details.metacritic || "#" };
            } catch {
              return { ...game, website: "#" };
            }
          })
        );
        setGames(enrichedGames);
        sessionStorage.setItem('popularGames', JSON.stringify(enrichedGames));
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Filter games based on debounced search
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  if (!debouncedSearchQuery) return null;

  return (
    <div className="search-results-section">
      <h2>Search Results for "{debouncedSearchQuery}"</h2>

      {loading ? (
        <p className="loading-text">Loading games...</p>
      ) : filteredGames.length > 0 ? (
        <div className="search-results-grid">
          {filteredGames.map((game) => (
            <div className="game-card" key={game.id}>
              <img
                src={game.background_image}
                alt={game.name}
                className="game-image"
              />
              <h2 className="game-name">{game.name}</h2>
              <p className="genre">
                {game.genres?.map((g) => g.name).join(", ") || "Unknown Genre"}
              </p>
              <div className="button-container">
                <button
                  onClick={() => window.open(game.website, "_blank")}
                  className="go-to-game-btn"
                >
                  Go to Game
                </button>
                <button
                  onClick={() => addToWishlist(game)}
                  className="wishlist-btn"
                  disabled={wishlist.some((g) => g.id === game.id)}
                >
                  {wishlist.some((g) => g.id === game.id)
                    ? "Added to Wishlist"
                    : "Add to Wishlist"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results">No games found for "{debouncedSearchQuery}".</p>
      )}
    </div>
  );
};

export default GameSearchResults; 