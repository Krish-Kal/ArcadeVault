import { useEffect, useState } from 'react';

const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [userKey, setUserKey] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail'); // uniquely identify user
    if (token && email) {
      const key = `userWishlist_${email}`;
      setUserKey(key);
      const saved = localStorage.getItem(key);
      if (saved) setWishlist(JSON.parse(saved));
    } else {
      const sessionList = sessionStorage.getItem('wishlist');
      if (sessionList) setWishlist(JSON.parse(sessionList));
    }
  }, []);

  const saveToStorage = (list) => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    if (token && email) {
      const key = `userWishlist_${email}`;
      localStorage.setItem(key, JSON.stringify(list));
    } else {
      sessionStorage.setItem('wishlist', JSON.stringify(list));
    }
  };

  const addToWishlist = (game) => {
    const updated = [...wishlist, game];
    setWishlist(updated);
    saveToStorage(updated);
  };

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((game) => game.id !== id);
    setWishlist(updated);
    saveToStorage(updated);
  };

  const clearWishlist = () => {
    setWishlist([]);
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    if (token && email) {
      const key = `userWishlist_${email}`;
      localStorage.removeItem(key); // Remove specific user wishlist
    } else {
      sessionStorage.removeItem('wishlist'); // Remove guest wishlist
    }
  };

  const loadUserWishlist = () => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      const key = `userWishlist_${email}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    }
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
