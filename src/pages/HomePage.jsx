import React, { useEffect, useState } from 'react';
import GameSearchResults from '../components/searchbox/GameSearchResult';
import TrendingGames from '../components/Trending/TrendingGames';
import GamingHub from '../components/Game section/GamingHub';
import './HomePage.css';

const HomePage = ({games }) => {
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
            <div className="genre-tags">
  <span>🎮 Action</span>
  <span>⚔️ RPG</span>
  <span>🌍 Open World</span>
  <span>🏎️ Racing</span>
  <span>🔫 FPS</span>
</div>
          </div>
        </div>
      </div>

      {/* 🔥 Trending Section */}
      <TrendingGames loading={loading} games={games} />

      <GamingHub />
    </>
  );
};

export default HomePage;