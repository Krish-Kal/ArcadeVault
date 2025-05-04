import React, { useEffect, useState } from 'react';
import './GamesList.css';
import { gamesList } from './Gamedata';

function GamesList({ addToWishlist, searchQuery, wishlist }) {
  const [addedGames, setAddedGames] = useState([]);

  // Sync addedGames with actual wishlist on mount or when wishlist changes
  useEffect(() => {
    const wishlistIds = wishlist.map((game) => game.id);
    setAddedGames(wishlistIds);
  }, [wishlist]);

  const handleAddToWishlist = (game) => {
    addToWishlist(game);
    setAddedGames((prevAdded) => [...prevAdded, game.id]);
  };

  const filteredGames = gamesList.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="games-list-container">
      <div className="games-grid">
        {filteredGames.length === 0 ? (
          <p>No games found for "{searchQuery}". Try another search.</p>
        ) : (
          filteredGames.map((game) => (
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

export default GamesList;
