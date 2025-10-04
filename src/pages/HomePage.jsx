import React, { useEffect, useState } from 'react';
import GameSearchResults from '../components/searchbox/GameSearchResult';
import TrendingGames from '../components/Trending/TrendingGames';
import GamingHub from '../components/Game section/GamingHub';
import Searchbox from '../components/searchbox/Gamesearch';
import './HomePage.css';

const HomePage = ({ searchQuery, setSearchQuery, addToWishlist, wishlist, games }) => {
  const [loading, setLoading] = useState(false); // no API, so loading can default false

  return (
    <>
      <div className="background">
        <div className="overlay" />
        <div className="content">
          <div className="welcome-box">
            <h1 className="title">Welcome to ArcadeVault</h1>
            <p className="info-text">
              Step into <strong>Arcade Vault</strong>, your ultimate gaming hub. 
              Explore curated games from multiple platforms, discover game stats and pro tips, 
              manage your wishlist, and access links to popular stores. Arcade Vault isn't just a hub — it's your next-level interactive gaming experience! 🔥 Power up your play. 🎮
            </p>

            {/* 🔍 Search bar inside welcome box */}
            <Searchbox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </div>
      </div>

      {/* 🔍 Centralized Search Results */}
      <GameSearchResults
        searchQuery={searchQuery}
        addToWishlist={addToWishlist}
        wishlist={wishlist}
        games={games}
      />

      {/* 🔥 Trending Section */}
      <TrendingGames loading={loading} games={games} />

      <GamingHub />
    </>
  );
};

export default HomePage;
