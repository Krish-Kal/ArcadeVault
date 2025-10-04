import { useState, useEffect, useCallback } from 'react';
import { gamesList } from '../../pages/GamesPage/Gamedata';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://arcadevault-4.onrender.com/api/users/wishlist';

const useWishlist = () => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = sessionStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch wishlist from server if logged-in
  const loadUserWishlist = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(API_BASE, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok && Array.isArray(data.wishlist)) {
        setWishlist(data.wishlist);
        sessionStorage.setItem('wishlist', JSON.stringify(data.wishlist));
      }
    } catch (err) {
      console.warn('Failed to load wishlist from server:', err);
    }
  }, []);

  // Save wishlist: server if logged-in, sessionStorage otherwise
  const saveToStorage = useCallback(async (list) => {
    const token = localStorage.getItem('token');
    setWishlist(list);

    try {
      if (token) {
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ wishlist: list }),
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.wishlist)) {
          setWishlist(data.wishlist);
          sessionStorage.setItem('wishlist', JSON.stringify(data.wishlist));
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to save wishlist to server, saving locally:', err);
    }

    // Fallback: always save locally
    sessionStorage.setItem('wishlist', JSON.stringify(list));
  }, []);

  // Normalize game details from local JSON
  const fetchGameDetails = useCallback(async (gameInput) => {
    if (!gameInput) return null;

    let game = typeof gameInput === 'object' ? gameInput : null;

    if (!game) {
      const key = String(gameInput).toLowerCase();
      game = gamesList.find((g) => String(g.id) === key || String(g.slug).toLowerCase() === key || String(g.name).toLowerCase() === key);
    }

    if (!game) return { id: gameInput, name: `Game ${gameInput}`, imageUrl: '', genre: '', link: '#' };

    return {
      id: game.id,
      name: game.name || `Game ${game.id}`,
      imageUrl: game.background_image || game.imageUrl || '',
      genre: game.genres?.map((x) => x.name).join(', ') || game.genre || '',
      link: game.website || game.link || game.metacritic || `/games/${game.id}` || '#',
    };
  }, []);

  // Add game to wishlist
  const addToWishlist = useCallback(async (game) => {
    if (wishlist.some((g) => String(g.id) === String(game.id))) return;
    const details = await fetchGameDetails(game);
    if (!details) return;
    const updated = [...wishlist, details];
    await saveToStorage(updated);
  }, [wishlist, fetchGameDetails, saveToStorage]);

  // Remove game from wishlist
  const removeFromWishlist = useCallback(async (id) => {
    const updated = wishlist.filter((g) => String(g.id) !== String(id));
    await saveToStorage(updated);
  }, [wishlist, saveToStorage]);

  // Clear entire wishlist
  const clearWishlist = useCallback(async () => {
    setWishlist([]);
    const token = localStorage.getItem('token');
    try {
      if (token) {
        await fetch(`${API_BASE}/clear`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ wishlist: [] }),
        });
      }
    } catch {}
    sessionStorage.removeItem('wishlist');
  }, []);

  // Initialize wishlist on mount and watch for token changes
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (token) await loadUserWishlist();
      else {
        const saved = sessionStorage.getItem('wishlist');
        setWishlist(saved ? JSON.parse(saved) : []);
      }
    };
    init();

    const onStorage = (e) => {
      if (e.key === 'token') {
        const token = localStorage.getItem('token');
        if (token) loadUserWishlist();
        else setWishlist(JSON.parse(sessionStorage.getItem('wishlist') || '[]'));
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [loadUserWishlist]);

  return { wishlist, addToWishlist, removeFromWishlist, clearWishlist, loadUserWishlist };
};

export default useWishlist;
