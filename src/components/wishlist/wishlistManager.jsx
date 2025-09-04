import { useEffect, useState } from 'react';

const API_KEY = 'dbdfb4c288374e7b8e71571677db40fa';

const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [storageKey, setStorageKey] = useState(null);

  // Load wishlist from storage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    const key = token && email ? `userWishlist_${email}` : 'guestWishlist';
    setStorageKey(key);

    const saved = localStorage.getItem(key) || sessionStorage.getItem('wishlist');
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  // Save wishlist to correct storage
  const saveToStorage = (list) => {
    if (storageKey && storageKey.startsWith('userWishlist_')) {
      localStorage.setItem(storageKey, JSON.stringify(list));
    } else {
      sessionStorage.setItem('wishlist', JSON.stringify(list));
    }
  };

  // Fetch game details from RAWG
  const fetchGameDetails = async (gameId) => {
    const res = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`);
    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      imageUrl: data.background_image,
      genre: data.genres?.map((g) => g.name).join(', '),
      link: data.website || data.metacritic || `https://rawg.io/games/${data.slug}`,
    };
  };

  // Add game to wishlist
  const addToWishlist = async (game) => {
    if (!wishlist.some((g) => g.id === game.id)) {
      const details = await fetchGameDetails(game.id);
      if (details) {
        const updated = [...wishlist, details];
        setWishlist(updated);
        saveToStorage(updated);
      }
    }
  };

  // Remove game from wishlist
  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((g) => g.id !== id);
    setWishlist(updated);
    saveToStorage(updated);
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    setWishlist([]);
    if (storageKey && storageKey.startsWith('userWishlist_')) localStorage.removeItem(storageKey);
    else sessionStorage.removeItem('wishlist');
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  };
};

export default useWishlist;
