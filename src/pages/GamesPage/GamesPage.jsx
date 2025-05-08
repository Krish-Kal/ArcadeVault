import React, { useEffect, useState } from 'react';
import { gamesList } from '../../components/Games/Gamedata'; // Import your games data
import '../../components/Games/GamesList.css'; // Keep the existing styles

function GamesPage({ addToWishlist, wishlist }) {
  const [addedGames, setAddedGames] = useState([]);
  const [sortedGames, setSortedGames] = useState(gamesList);
  const [sortBy, setSortBy] = useState('name'); // Default sort by 'name'

  // Sync addedGames with actual wishlist on mount or when wishlist changes
  useEffect(() => {
    const wishlistIds = wishlist.map((game) => game.id);
    setAddedGames(wishlistIds);
  }, [wishlist]);

  const handleAddToWishlist = (game) => {
    addToWishlist(game);
    setAddedGames((prevAdded) => [...prevAdded, game.id]);
  };

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortBy(selectedSort);
    
    let sortedArray = [...gamesList];
    
    switch (selectedSort) {
      case 'name':
        sortedArray.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'genre':
        sortedArray.sort((a, b) => a.genre.localeCompare(b.genre));
        break;
      case 'latest':
        sortedArray.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        break;
      case 'popular':
        sortedArray.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'mostDownloaded':
        sortedArray.sort((a, b) => b.downloads - a.downloads);
        break;
      default:
        sortedArray = gamesList;
        break;
    }
    setSortedGames(sortedArray);
  };

  // Scroll to top when navigating to the GamesPage
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top of the page
  }, []);

  return (
    <div className="games-page">
      <h1 className="games-page-title">Explore Trending Games</h1>

      {/* Sort By Dropdown */}
      <div className="sort-by-container">
        <label htmlFor="sort-by" className="sort-by-label">Sort by: </label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={handleSortChange}
          className="sort-by-dropdown"
        >
          <option value="name">Alphabetical</option>
          <option value="genre">Genre</option>
          <option value="latest">Latest Release</option>
          <option value="popular">Popularity</option>
          <option value="mostDownloaded">Most Downloaded</option>
        </select>
      </div>

      <div className="games-grid">
        {sortedGames.length === 0 ? (
          <p>No games available at the moment.</p>
        ) : (
          sortedGames.map((game) => (
            <div className="game-card" key={game.id}>
              <img src={game.imageUrl} alt={game.name} className="game-image" />
              <h2>{game.name}</h2>
              <p className="genre">{game.genre}</p>
              <p className="description">{game.description}</p>
              <p className="price">
                <strong>Price: <span>${game.price}</span></strong>
              </p>
              <div className="button-container">
                <button
                  onClick={() => window.open(game.link, "_blank")}
                  className="go-to-game-btn"
                >
                  Go to Game
                </button>
                <button
                  onClick={() => handleAddToWishlist(game)}
                  className="wishlist-btn"
                  disabled={addedGames.includes(game.id)}
                >
                  {addedGames.includes(game.id) ? 'Added to Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GamesPage;
