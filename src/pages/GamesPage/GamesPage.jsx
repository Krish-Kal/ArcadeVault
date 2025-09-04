import React, { useEffect, useState } from "react";
import "../../components/Games/GamesList.css";

function GamesPage({ addToWishlist, wishlist, searchQuery }) {
  const [games, setGames] = useState([]);
  const [addedGames, setAddedGames] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1); // track page number
  const [loading, setLoading] = useState(true); // <-- new loading state
  const pageSize = 20; // 20 games per page
  const totalGames = 200; // limit to 200 games

  // Sync wishlist
  useEffect(() => {
    const wishlistIds = wishlist.map((game) => game.id);
    setAddedGames(wishlistIds);
  }, [wishlist]);

  // Fetch games from RAWG API
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games/lists/popular?key=dbdfb4c288374e7b8e71571677db40fa&page_size=${pageSize}&page=${page}`
        );
        const data = await response.json();
        setGames(data.results || []);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
      setLoading(false);
      window.scrollTo(0, 0); // scroll to top on page change
    };

    fetchGames();
  }, [page]);

  // Add to wishlist
  const handleAddToWishlist = (game) => {
    addToWishlist(game);
    setAddedGames((prev) => [...prev, game.id]);
  };

  // Fetch actual game website
  const handleGoToGame = async (gameId) => {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games/${gameId}?key=dbdfb4c288374e7b8e71571677db40fa`
      );
      const data = await response.json();
      const url = data.website || data.metacritic || "#";
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error fetching game URL:", err);
      window.open("#", "_blank");
    }
  };

  // Sorting function
  const sortGames = (gamesArray) => {
    let sorted = [...gamesArray];
    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "released":
        sorted.sort((a, b) => new Date(b.released) - new Date(a.released));
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "popularity":
        sorted.sort((a, b) => b.added - a.added);
        break;
      case "platform":
        sorted.sort((a, b) =>
          (a.platforms?.[0]?.platform.name || "").localeCompare(
            b.platforms?.[0]?.platform.name || ""
          )
        );
        break;
      default:
        break;
    }
    return sorted;
  };

  // Filtered games based on searchQuery
  const filteredGames = searchQuery
    ? games.filter((game) =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : games;

  return (
    <div className="games-page">
      <h1 className="games-page-title">Explore Trending Games</h1>

      {/* Sort By Dropdown */}
      <div className="sort-by-container">
        <label htmlFor="sort-by" className="sort-by-label">
          Sort by:
        </label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-by-dropdown"
        >
          <option value="name">Alphabetical</option>
          <option value="released">Release Date</option>
          <option value="rating">Rating</option>
          <option value="popularity">Popularity</option>
          <option value="platform">Platform</option>
        </select>
      </div>

      {/* Games Grid */}
      <div className="games-grid">
        {loading
          ? Array.from({ length: pageSize }).map((_, idx) => (
              <div className="game-card skeleton" key={idx}>
                <div className="game-image skeleton-box"></div>
                <div className="game-title skeleton-box"></div>
                <div className="game-genre skeleton-box"></div>
                <div className="button-container">
                  <div className="skeleton-btn skeleton-box"></div>
                  <div className="skeleton-btn skeleton-box"></div>
                </div>
              </div>
            ))
          : filteredGames.length === 0
          ? <p>No games found.</p>
          : sortGames(filteredGames).map((game) => (
              <div className="game-card" key={game.id}>
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="game-image"
                />
                <h2>{game.name}</h2>
                <p className="genre">
                  {game.genres?.map((g) => g.name).join(", ") || "Unknown Genre"}
                </p>
                <div className="button-container">
                  <button
                    onClick={() => handleGoToGame(game.id)}
                    className="go-to-game-btn"
                  >
                    Go to Game
                  </button>
                  <button
                    onClick={() => handleAddToWishlist(game)}
                    className="wishlist-btn"
                    disabled={addedGames.includes(game.id)}
                  >
                    {addedGames.includes(game.id)
                      ? "Added to Wishlist"
                      : "Add to Wishlist"}
                  </button>
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      {!searchQuery && (
        <div className="pagination">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span> Page {page} </span>
          <button
            onClick={() =>
              setPage((prev) => (prev * pageSize < totalGames ? prev + 1 : prev))
            }
            disabled={page * pageSize >= totalGames}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default GamesPage;
