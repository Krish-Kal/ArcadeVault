import React, { useEffect, useState } from "react";
import "./GamesPage.css";

function GamesPage({ addToWishlist, wishlist = [], searchQuery }) {
  const [games, setGames] = useState([]);
  const [addedGames, setAddedGames] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState(null);
  const pageSize = 20;
  const totalGames = 300; // extend to 300 relevant games

  // Sync wishlist
  useEffect(() => {
    const wishlistIds = (wishlist || []).map((game) => game.id);
    setAddedGames(wishlistIds);
  }, [wishlist]);

  // Prefetch helper to warm up images before showing
  const preloadImages = (urls) => {
    urls.forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  };

  // Load local sample fallback
  const loadSample = async (cacheKey, reason) => {
    try {
      const res = await fetch("/sample-games.json");
      if (!res.ok) throw new Error("Sample fetch failed");
      const json = await res.json();
      const results = Array.isArray(json.results) ? json.results : [];
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), results }));
      } catch {}
      preloadImages(results.map((g) => g.background_image).filter(Boolean));
      setGames(results);
      setStatusMsg(reason || "Using sample game data.");
      setLoading(false);
    } catch (e) {
      setGames([]);
      setStatusMsg("Unable to load games.");
      setLoading(false);
    }
  };

  // Fetch games via same-origin proxy (no CORS)
  useEffect(() => {
    let isMounted = true;
    const cacheKey = `arcade_games_p${page}`;

    const fetchGames = async () => {
      setLoading(true);
      setStatusMsg(null);

      const url = `/api/rawg/games?page_size=${pageSize}&page=${page}&ordering=-rating,-added`;

      try {
        const response = await fetch(url);
        const text = await response.text();
        // try parse JSON
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          // non-JSON returned (HTML error page?) -> try cache or sample
          const cached = sessionStorage.getItem(cacheKey);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (isMounted) {
              preloadImages((parsed.results || []).map((g) => g.background_image).filter(Boolean));
              setGames(parsed.results || []);
              setStatusMsg("Showing cached results due to proxy/API issue.");
              setLoading(false);
              return;
            }
          }
          await loadSample(cacheKey, "Proxy returned non-JSON — showing sample data.");
          return;
        }

        // handle non-ok forwarded responses
        if (!response.ok) {
          const errStr = JSON.stringify(data).toLowerCase();
          if (errStr.includes("monthly api limit") || errStr.includes("quota") || errStr.includes("limit")) {
            await loadSample(cacheKey, "RAWG quota reached — showing sample data.");
            return;
          }
          throw new Error(`RAWG/proxy error ${response.status}: ${JSON.stringify(data).slice(0, 200)}`);
        }

        const results = Array.isArray(data.results) ? data.results : [];
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), results }));
        } catch {}

        if (isMounted) {
          preloadImages(results.map((g) => g.background_image).filter(Boolean));
          // use rAF to avoid jank
          requestAnimationFrame(() => {
            setGames(results);
            setLoading(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
        }
      } catch (error) {
        console.error("Error fetching games:", error);
        // try cache then sample
        try {
          const cached = sessionStorage.getItem(cacheKey);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (isMounted) {
              preloadImages((parsed.results || []).map((g) => g.background_image).filter(Boolean));
              setGames(parsed.results || []);
              setStatusMsg("Showing cached results due to network/API issue.");
              setLoading(false);
              return;
            }
          }
        } catch {}
        await loadSample(cacheKey, "Network or proxy error — showing sample data.");
      }
    };

    fetchGames();
    return () => {
      isMounted = false;
    };
  }, [page]);

  // Add to wishlist
  const handleAddToWishlist = (game) => {
    addToWishlist(game);
    setAddedGames((prev) => (prev.includes(game.id) ? prev : [...prev, game.id]));
  };

  // Go to game - use proxy for details
  const handleGoToGame = (gameId) => {
    const newTab = window.open("", "_blank");
    fetch(`/api/rawg/games/${gameId}`)
      .then((res) => res.json())
      .then((data) => {
        const url = data.website || data.metacritic || "#";
        newTab.location.href = url;
      })
      .catch((err) => {
        console.error("Error fetching game URL:", err);
        newTab.location.href = "#";
      });
  };

  // Sorting function
  const sortGames = (gamesArray) => {
    let sorted = [...gamesArray];
    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "released":
        sorted.sort((a, b) => new Date(b.released || 0) - new Date(a.released || 0));
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popularity":
        sorted.sort((a, b) => (b.added || 0) - (a.added || 0));
        break;
      case "platform":
        sorted.sort((a, b) =>
          (a.platforms?.[0]?.platform.name || "").localeCompare(b.platforms?.[0]?.platform.name || "")
        );
        break;
      default:
        break;
    }
    return sorted;
  };

  // Filtered games based on searchQuery
  const filteredGames = searchQuery
    ? games.filter((game) => (game.name || "").toLowerCase().includes(searchQuery.toLowerCase()))
    : games;

  return (
    <div className="games-page">
      <h1 className="games-page-title">Explore Trending Games</h1>

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

      {statusMsg && <p className="games-error">{statusMsg}</p>}

      <div className="games-grid">
        {loading ? (
          Array.from({ length: pageSize }).map((_, idx) => (
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
        ) : filteredGames.length === 0 ? (
          <p>No games found.</p>
        ) : (
          sortGames(filteredGames).map((game) => (
            <div className="game-card" key={game.id}>
              <img
                src={game.background_image || "/placeholder.png"}
                alt={game.name}
                className="game-image"
                loading="lazy"
                decoding="async"
              />
              <h2>{game.name}</h2>
              <p className="genre">{(game.genres || []).map((g) => g.name).join(", ") || "Unknown Genre"}</p>
              <div className="button-container">
                <button onClick={() => handleGoToGame(game.id)} className="go-to-game-btn">
                  Go to Game
                </button>
                <button
                  onClick={() => handleAddToWishlist(game)}
                  className="wishlist-btn"
                  disabled={addedGames.includes(game.id)}
                >
                  {addedGames.includes(game.id) ? "Added to Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!searchQuery && (
        <div className="pagination">
          <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
            Previous
          </button>
          <span> Page {page} </span>
          <button
            onClick={() => setPage((prev) => (prev * pageSize < totalGames ? prev + 1 : prev))}
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
