import React, { useEffect, useState } from "react";
import "./GamesPage.css";
import { gamesList } from "./Gamedata";

function GamesPage({ addToWishlist, wishlist = [], searchQuery }) {
  const [games, setGames] = useState([]);
  const [addedGames, setAddedGames] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 20;
  const totalGames = gamesList.length;

  useEffect(() => {
    setAddedGames((wishlist || []).map((g) => g.id));
  }, [wishlist]);

  const preloadImages = (urls) => {
    urls.filter(Boolean).forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // simulate small load delay for UX (optional)
    const t = setTimeout(() => {
      if (!mounted) return;
      // compute paginated slice from local gamesList
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const pageItems = gamesList.slice(start, end);
      preloadImages(pageItems.map((g) => g.imageUrl || g.background_image));
      setGames(pageItems);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 150);

    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [page]);

  const handleAddToWishlist = (game) => {
    addToWishlist(game);
    setAddedGames((prev) => (prev.includes(game.id) ? prev : [...prev, game.id]));
  };

  const handleGoToGame = (gameId) => {
    const g = games.find((x) => x.id === gameId) || gamesList.find((x) => x.id === gameId);
    const url = g?.link || g?.website || "#";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const sortGames = (arr) => {
    const sorted = [...arr];
    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "released":
        sorted.sort((a, b) => new Date(b.releaseDate || b.released || 0) - new Date(a.releaseDate || a.released || 0));
        break;
      case "rating":
        // local sample may not have rating; fallback to 0
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popularity":
        sorted.sort((a, b) => (b.added || 0) - (a.added || 0));
        break;
      case "platform":
        sorted.sort((a, b) =>
          ((a.platform || a.platforms?.[0]?.platform?.name) || "").toString().localeCompare(((b.platform || b.platforms?.[0]?.platform?.name) || "").toString())
        );
        break;
      default:
        break;
    }
    return sorted;
  };

  const q = (searchQuery || "").trim().toLowerCase();
  const filtered = q ? games.filter((g) => (g.name || "").toLowerCase().includes(q)) : games;

  return (
    <div className="games-page">
      <h1 className="games-page-title">Explore Trending Games</h1>

      <div className="sort-by-container">
        <label htmlFor="sort-by" className="sort-by-label">Sort by:</label>
        <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-by-dropdown">
          <option value="name">Alphabetical</option>
          <option value="released">Release Date</option>
          <option value="rating">Rating</option>
          <option value="popularity">Popularity</option>
          <option value="platform">Platform</option>
        </select>
      </div>

      <div className="games-grid">
        {loading ? (
          Array.from({ length: pageSize }).map((_, i) => (
            <div className="game-card skeleton" key={i}>
              <div className="game-image skeleton-box" />
              <div className="game-title skeleton-box" />
              <div className="game-genre skeleton-box" />
              <div className="button-container">
                <div className="skeleton-btn skeleton-box" />
                <div className="skeleton-btn skeleton-box" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <p>No games found.</p>
        ) : (
          sortGames(filtered).map((game) => (
            <div className="game-card" key={game.id}>
              <img
                src={game.imageUrl || game.background_image || "/placeholder.png"}
                alt={game.name}
                className="game-image"
                loading="lazy"
                decoding="async"
              />
              <h2>{game.name}</h2>
              <p className="genre">{(game.genre ? [game.genre] : (game.genres || []).map((g) => g.name)).join(", ") || "Unknown Genre"}</p>
              <div className="button-container">
                <button onClick={() => handleGoToGame(game.id)} className="go-to-game-btn">Go to Game</button>
                <button onClick={() => handleAddToWishlist(game)} className="wishlist-btn" disabled={addedGames.includes(game.id)}>
                  {addedGames.includes(game.id) ? "Added to Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!searchQuery && (
        <div className="pagination">
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>Previous</button>
          <span> Page {page} </span>
          <button onClick={() => setPage((p) => (p * pageSize < totalGames ? p + 1 : p))} disabled={page * pageSize >= totalGames}>Next</button>
        </div>
      )}
    </div>
  );
}

export default GamesPage;
