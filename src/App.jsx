import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/footer/footer';
import HomePage from './pages/HomePage';
import Wishlist from './components/wishlist/WishlistPage';
import NotFound from './pages/404/404';
import useWishlist from './components/wishlist/wishlistManager';
import About from './pages/About/AboutPage';
import LoginPage from './pages/Login/Login';
import SignupPage from './pages/Login/SignupPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import GamesPage from './pages/GamesPage/GamesPage';
import ArcadeLoader from './components/ArcadeLoader/ArcadeLoader';
import './App.css';

function App() {
  const { wishlist, addToWishlist, removeFromWishlist, clearWishlist, loadUserWishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      loadUserWishlist();
    }
    // eslint-disable-next-line
  }, [isLoggedIn]);

  /* LOADER LOGIC */

  useEffect(() => {

    const MIN_LOAD_TIME = 2000;
    const startTime = Date.now();

    const handlePageLoaded = () => {

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);

      setTimeout(() => {
        setLoading(false);
      }, remaining);

    };

    if (document.readyState === "complete") {
      handlePageLoaded();
    } else {
      window.addEventListener("load", handlePageLoaded);
    }

    return () => {
      window.removeEventListener("load", handlePageLoaded);
    };

  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    clearWishlist();
    setIsLoggedIn(false);
  };

  const navigateToProfile = () => {
    window.location.href = '/profile';
  };

  if (loading) {
    return <ArcadeLoader />;
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar
          wishlistCount={wishlist.length}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          navigateToProfile={navigateToProfile}
        />

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                addToWishlist={addToWishlist}
                wishlist={wishlist}
              />
            }
          />

          <Route
            path="/wishlist"
            element={<Wishlist wishlist={wishlist} removeFromWishlist={removeFromWishlist} />}
          />

          <Route path="/about" element={<About />} />

          <Route
            path="/login"
            element={<LoginPage setIsLoggedIn={setIsLoggedIn} loadUserWishlist={loadUserWishlist} />}
          />

          <Route
            path="/games"
            element={<GamesPage addToWishlist={addToWishlist} wishlist={wishlist} />}
          />

          <Route path="/signup" element={<SignupPage />} />

          <Route path="/profile" element={<ProfilePage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;