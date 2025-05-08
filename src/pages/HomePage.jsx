import React from 'react';
import Searchbox from '../components/searchbox/Gamesearch';
import TrendingGames from '../components/Trending/TrendingGames';
import GamesList from '../components/Games/GamesList'; // Import GamesList to display search results
import './HomePage.css';
import GamingHub from '../components/Game section/GamingHub';

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

      {/* Display search results if query exists */}
      {searchQuery && (
        <div className="search-results-section">
          <h2>Search Results</h2>
          <GamesList
            searchQuery={searchQuery}
            addToWishlist={addToWishlist}
            wishlist={wishlist}
          />
        </div>
      )}

      {/* 🔥 Trending Section */}
      <TrendingGames />

      
      <GamingHub/>
    </>
  );
};

export default HomePage;
