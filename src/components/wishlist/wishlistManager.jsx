import { useState } from 'react';

const API_KEY = 'dbdfb4c288374e7b8e71571677db40fa';
const API_BASE = import.meta.env.VITE_API_BASE || 'https://arcadevault-4.onrender.com/api/users/wishlist';

const useWishlist = () => {
  // Always initialize from sessionStorage for instant guest experience
  const [wishlist, setWishlist] = useState(() => {
    const saved = sessionStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Load wishlist from MongoDB (for logged-in) or sessionStorage (for guests)
  const loadUserWishlist = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await fetch(API_BASE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setWishlist(data.wishlist || []);
        } else {
          setWishlist([]);
        }
      } catch (err) {
        setWishlist([]);
      }
    } else {
      const saved = sessionStorage.getItem('wishlist');
      setWishlist(saved ? JSON.parse(saved) : []);
    }
  };

  // Save wishlist to MongoDB (for logged-in) or sessionStorage (for guests)
  const saveToStorage = async (list) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(API_BASE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ wishlist: list }),
        });
      } catch (err) {
        // Optionally handle error
      }
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
        await saveToStorage(updated);
      }
    }
  };

  // Remove game from wishlist
  const removeFromWishlist = async (id) => {
    const updated = wishlist.filter((g) => g.id !== id);
    setWishlist(updated);
    await saveToStorage(updated);
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    setWishlist([]);
    const token = localStorage.getItem('token');
    if (!token) {
      sessionStorage.removeItem('wishlist');
    }
    // Optionally, clear on server for logged-in users if needed
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    loadUserWishlist,
  };
};

export default useWishlist;
