import React from 'react';
import './WishlistPage.css';

function Wishlist({ wishlist, removeFromWishlist }) {
  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="wishlist-wrapper">
        <h1 className="wishlist-title">✨ My Wishlist</h1>
        <p>No games added yet. Start exploring and add your favorite games!</p>
      </div>
    );
  }

  return (
    <div className="wishlist-wrapper">
      <h1 className="wishlist-title">✨ My Wishlist</h1>

      <div className="wishlist-grid">
        {wishlist.map((game) => (
          <div key={game.id} className="wishlist-card">
            <img src={game.imageUrl} alt={game.name} className="game-cover" />
            <div className="game-info">
              <h3>{game.name}</h3>
              <p>{game.genre}</p>
            </div>
            <div className="wishlist-buttons">
              <button
                onClick={() => window.open(game.link, '_blank')}
                className="go-to-game"
              >
                Go to Game
              </button>
              <button
                onClick={() => removeFromWishlist(game.id)}
                className="remove-game"
              >
                ✖ Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
