import React, { useEffect, useState } from 'react';
import './GamingHub.css';
import rlogo from '../../assets/r.png'; // Adjust path as needed

const tips = [
  'Practice regularly to improve aim and reflexes.',
  'Join online communities to learn from others.',
  'Customize controls and sensitivity for better comfort.',
  'Stay hydrated and take breaks to avoid fatigue.',
  'Watch pro streams to learn new strategies.'
];

const stats = [
  { label: 'Global Gamers', value: '3.2B+' },
  { label: 'Active eSports Players', value: '45M+' },
  { label: 'Top Twitch Streamers', value: '10K+' },
  { label: 'Pro Teams Worldwide', value: '1,000+' }
];

const quotes = [
  '"Gaming world is sometimes enchanting." - Anonymous',
  '"I am a Gamer, I have many lives." - Gary Gygax',
  '"Reality is broken, video games are our fix." - Jane McGonigal'
];

const storeLinks = [
  {
    name: 'Steam',
    url: 'https://store.steampowered.com',
    image: 'https://cdn.fastly.steamstatic.com/store//about/logo_steam.svg'
  },
  {
    name: 'Rockstar Games',
    url: 'https://www.rockstargames.com',
    image: rlogo
  },
  {
    name: 'PlayStation',
    url: 'https://www.playstation.com',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/PlayStation_App_Icon.jpg/960px-PlayStation_App_Icon.jpg'
  },
  {
    name: 'Epic Games',
    url: 'https://store.epicgames.com',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg'
  }
];

const GamingHub = () => {
  const [visibleSections, setVisibleSections] = useState([]);

  // Intersection Observer callback
  const handleIntersection = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !visibleSections.includes(entry.target.id)) {
        setVisibleSections((prev) => [...prev, entry.target.id]);
      }
    });
  };

  // Set up Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3 // Trigger when 30% of the section is visible
    });

    // Observe each section
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => observer.observe(section));

    // Cleanup on component unmount
    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
    // eslint-disable-next-line
  }, [visibleSections]);

  return (
    <div className="gaming-hub">
      <h1 className="section-title">Ultimate Gaming Hub</h1>

      <div
        className={`section tips ${visibleSections.includes('tips') ? 'visible' : ''}`}
        id="tips"
      >
        <h2>🎯 Pro Tips</h2>
        <ul>
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      <div
        className={`section stats ${visibleSections.includes('stats') ? 'visible' : ''}`}
        id="stats"
      >
        <h2>📊 Gaming Stats</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`section quotes ${visibleSections.includes('quotes') ? 'visible' : ''}`}
        id="quotes"
      >
        <h2>💬 Legendary Quotes</h2>
        {quotes.map((quote, index) => (
          <blockquote key={index}>{quote}</blockquote>
        ))}
      </div>

      <div
        className={`section stores ${visibleSections.includes('stores') ? 'visible' : ''}`}
        id="stores"
      >
        <h2>🛒 Top Gaming Stores</h2>
        <div className="store-grid">
          {storeLinks.map((store, index) => (
            <a
              key={index}
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              className="store-link"
            >
              <img src={store.image} alt={store.name} className="store-logo" />
              <span>{store.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamingHub;