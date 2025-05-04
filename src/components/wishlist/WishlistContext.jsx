import React from 'react';
import './WishlistPage.css';

function WishlistPage({ wishlist, removeFromWishlist }) {
  return (
    <div className="wishlist-container">
      <h1 className="wishlist-heading">🎯 Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">Your wishlist is empty. Start adding games!</div>
      ) : (
        <div className="wishlist-cards">
          {wishlist.map((game) => (
            <div key={game.id} className="wishlist-game-card">
              <img src={game.imageUrl} alt={game.name} className="wishlist-image" />
              <div className="wishlist-details">
                <h3 className="wishlist-title">{game.name}</h3>
                <p className="wishlist-genre">{game.genre}</p>
                <p className="wishlist-description">{game.description}</p>
                <div className="wishlist-buttons">
                  <button onClick={() => window.open(game.link, '_blank')} className="visit-btn">Visit</button>
                  <button onClick={() => removeFromWishlist(game.id)} className="remove-btn">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
