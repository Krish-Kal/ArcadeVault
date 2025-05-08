import React, { useEffect, useState } from 'react';
import './TrendingGames.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TrendingGames = () => {
  const [games, setGames] = useState([]);

  // Function to fetch the top 10 trending games from the RAWG API
  const fetchTrendingGames = async () => {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games/lists/popular?key=dbdfb4c288374e7b8e71571677db40fa&page_size=10`
      );
      const data = await response.json();
      setGames(data.results.filter((g) => g.background_image && g.slug).slice(0, 10));
    } catch (error) {
      console.error('Error fetching trending games:', error);
    }
  };

  // Fetch the data initially and refresh it every hour (3600000 ms)
  useEffect(() => {
    fetchTrendingGames();  // Initial fetch
    const intervalId = setInterval(fetchTrendingGames, 3600000);  // Refresh every hour

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="trending-section">
      <h2 className="trending-heading">Featured and Recommended</h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500 }}
        loop={true}
        spaceBetween={30}
        slidesPerView={1}
        className="trending-swiper"
      >
        {games.map((game, index) => (
          <SwiperSlide key={index}>
            <a
              href={`https://rawg.io/games/${game.slug}`}
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
                  {game.genres.map((g) => g.name).join(', ')}
                </p>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TrendingGames;
