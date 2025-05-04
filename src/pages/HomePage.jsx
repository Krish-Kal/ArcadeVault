import React from 'react';
import Searchbox from '../components/searchbox/Gamesearch';
import GamesList from '../components/Games/GamesList';
import './HomePage.css';

const HomePage = ({ searchQuery, setSearchQuery, addToWishlist, wishlist }) => {
  return (
    <>
      <div className="background">
        <div className="overlay" />
        <div className="content">
          <div className="welcome-box">
            <h1 className="title">Welcome to ArcadeVault</h1>
            <p className="info-text">
              Step into ArcadeVault, your ultimate online destination for everything gaming. 
              From the hottest new releases to timeless classics, we've got games for every 
              player and with every genre. ArcadeVault isn't just a store — it's your next-level 
              gaming hub. Power up your play. 🔥
            </p>
            <Searchbox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </div>
      </div>

      <h2 className="section-heading">Checkout the Top 20 Collection</h2>
      <GamesList 
        searchQuery={searchQuery} 
        addToWishlist={addToWishlist} 
        wishlist={wishlist}  // Pass wishlist here
      />
    </>
  );
};

export default HomePage;
