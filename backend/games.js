const mongoose = require('mongoose');
const axios = require('axios');
const Game = require('./models/Game'); // Adjust path if needed

const RAWG_API_KEY = 'dbdfb4c288374e7b8e71571677db40fa';
const RAWG_URL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=40`;
const CHEAPSHARK_URL = 'https://www.cheapshark.com/api/1.0/games?title=';

// Helper to avoid rate limits
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchRAWGGames(page = 1) {
  try {
    const res = await axios.get(`${RAWG_URL}&page=${page}`);
    return res.data.results;
  } catch (err) {
    console.error(`RAWG error on page ${page}: ${err.message}`);
    return [];
  }
}

async function fetchCheapSharkPrice(title) {
  let attempts = 0;
  while (attempts < 5) {
    try {
      const res = await axios.get(`${CHEAPSHARK_URL}${encodeURIComponent(title)}`);
      let prices = { steam: null, epic: null, rockstar: null };
      let urls = { steam: null, epic: null, rockstar: null };
      if (Array.isArray(res.data)) {
        res.data.forEach(game => {
          if (game.steamAppID) {
            prices.steam = game.cheapest ? Number(game.cheapest) : null;
            urls.steam = `https://store.steampowered.com/app/${game.steamAppID}`;
          }
        });
      }
      return { prices, urls };
    } catch (err) {
      if (err.response && err.response.status === 429) {
        console.warn(`429 Too Many Requests for "${title}". Retrying after 10 seconds...`);
        await sleep(10000); // Wait 10 seconds before retrying
        attempts++;
      } else {
        console.error(`CheapShark error for "${title}": ${err.message}`);
        return {
          prices: { steam: null, epic: null, rockstar: null },
          urls: { steam: null, epic: null, rockstar: null }
        };
      }
    }
  }
  // If all retries fail
  return {
    prices: { steam: null, epic: null, rockstar: null },
    urls: { steam: null, epic: null, rockstar: null }
  };
}

async function main() {
  await mongoose.connect('mongodb://localhost:27017/arcadevault');
  let allGames = [];
  for (let page = 1; page <= 3; page++) { // 3 pages = 120 games
    const games = await fetchRAWGGames(page);
    allGames = allGames.concat(games);
  }
  for (const rawgGame of allGames) {
    const { prices, urls } = await fetchCheapSharkPrice(rawgGame.name);
    const gameDoc = {
      title: rawgGame.name,
      genre: rawgGame.genres && rawgGame.genres[0] ? rawgGame.genres[0].name : '',
      description: rawgGame.slug,
      image: rawgGame.background_image,
      platforms: rawgGame.platforms ? rawgGame.platforms.map(p => p.platform.name) : [],
      prices,
      urls,
      popularity: rawgGame.rating || 0,
      downloads: rawgGame.added || 0,
      releaseDate: rawgGame.released ? new Date(rawgGame.released) : null,
    };
    await Game.findOneAndUpdate({ title: gameDoc.title }, gameDoc, { upsert: true, new: true });
    console.log(`Saved: ${gameDoc.title}`);
    await sleep(4000); // 4 second delay to avoid rate limits
  }
  mongoose.disconnect();
}

main();