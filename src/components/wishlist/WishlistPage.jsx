import React from 'react';
import './WishlistPage.css';

function Wishlist({ wishlist, removeFromWishlist }) {
  return (
    <div className="wishlist-wrapper">
      <h1 className="wishlist-title">✨ My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <h2>No games added yet...</h2>
          <p>Start exploring and add your favorite games!</p>
        </div>
      ) : (
        <>
          {/* ✅ Total Price Display */}
          <div className="wishlist-total">
            <h2>
              Total Price: <span>${wishlist.reduce((acc, game) => acc + game.price, 0).toFixed(2)}</span>
            </h2>
          </div>

          {/* ✅ Wishlist Cards Grid */}
          <div className="wishlist-grid">
            {wishlist.map((game) => (
              <div key={game.id} className="wishlist-card">
                <img src={game.imageUrl} alt={game.name} className="game-cover" />
                <div className="game-info">
                  <h3>{game.name}</h3>
                  <p>{game.genre}</p>
                  <span>${game.price}</span>
                </div>
                <div className="wishlist-buttons">
                  <button
                    onClick={() => window.open(game.link, "_blank")}
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
        </>
      )}
    </div>
  );
}

export default Wishlist;
