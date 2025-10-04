import React, { useEffect, useState } from 'react';
import './TrendingGames.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { gamesList } from '../../pages/GamesPage/Gamedata';

const TrendingGames = () => {
  const [games, setGames] = useState([]);

  // Pick top 10 local games with images and names
  useEffect(() => {
    const topGames = (gamesList || [])
      .filter((g) => (g.background_image || g.imageUrl) && g.name)
      .slice(0, 10)
      .map((g) => ({
        ...g,
        background_image: g.background_image || g.imageUrl || '',
        website: g.website || g.link || `https://example.com/games/${g.id}`,
      }));
    setGames(topGames);
  }, []);

  return (
    <div className="trending-section">
      <h2 className="trending-heading">Featured and Recommended</h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500 }}
        loop
        spaceBetween={30}
        slidesPerView={1}
        className="trending-swiper"
      >
        {games.length === 0 ? (
          <SwiperSlide>
            <div className="trending-loading">Loading...</div>
          </SwiperSlide>
        ) : (
          games.map((game, index) => (
            <SwiperSlide key={`${game.id}-${index}`}>
              <a
                href={game.website}
                target="_blank"
                rel="noopener noreferrer"
                className="trending-card"
              >
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="trending-image"
                />
                <div className="trending-info">
                  <h3 className="game-title">{game.name}</h3>
                  <p className="game-genres">
                    {(game.genres || []).map((g) => g.name).join(', ') || game.genre || ''}
                  </p>
                </div>
              </a>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );
};

export default TrendingGames;
