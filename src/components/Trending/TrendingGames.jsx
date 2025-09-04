import React, { useEffect, useState } from 'react';
import './TrendingGames.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TrendingGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch only basic info initially
  const fetchTrendingGames = async () => {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games/lists/popular?key=dbdfb4c288374e7b8e71571677db40fa&page_size=10`
      );
      const data = await response.json();
      const topGames = data.results
        .filter(g => g.background_image && g.slug)
        .slice(0, 10)
        .map(g => ({
          ...g,
          website: `https://rawg.io/games/${g.slug}`, // fallback link
          officialFetched: false, // flag to track if official site is fetched
        }));
      setGames(topGames);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trending games:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingGames();
    const intervalId = setInterval(fetchTrendingGames, 3600000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch official website when slide becomes active
  const fetchOfficialWebsite = async (index) => {
    if (!games[index] || games[index].officialFetched) return;
    try {
      const res = await fetch(
        `https://api.rawg.io/api/games/${games[index].slug}?key=dbdfb4c288374e7b8e71571677db40fa`
      );
      const details = await res.json();
      setGames(prev =>
        prev.map((g, i) =>
          i === index
            ? { ...g, website: details.website || g.website, officialFetched: true }
            : g
        )
      );
    } catch (error) {
      console.error('Error fetching official website:', error);
    }
  };



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
        onSlideChange={(swiper) => fetchOfficialWebsite(swiper.realIndex)}
        onSwiper={(swiper) => fetchOfficialWebsite(swiper.realIndex)}
      >
        {games.map((game, index) => (
          <SwiperSlide key={index}>
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
                  {game.genres.map(g => g.name).join(', ')}
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
