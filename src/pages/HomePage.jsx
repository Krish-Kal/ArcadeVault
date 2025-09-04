import React from 'react';
import GameSearchResults from '../components/searchbox/GameSearchResult';
import TrendingGames from '../components/Trending/TrendingGames';
import GamingHub from '../components/Game section/GamingHub';
import Searchbox from '../components/searchbox/Gamesearch';
import './HomePage.css';

const HomePage = ({ searchQuery, setSearchQuery, addToWishlist, wishlist, games }) => {
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
            
            {/* 🔍 Search bar inside welcome box */}
            <Searchbox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </div>
      </div>

      {/* 🔍 Centralized Search Results (only results grid) */}
      <GameSearchResults
        searchQuery={searchQuery}
        addToWishlist={addToWishlist}
        wishlist={wishlist}
        games={games}
      />

      {/* 🔥 Trending Section */}
      <TrendingGames />
      <GamingHub />
    </>
  );
};

export default HomePage;
