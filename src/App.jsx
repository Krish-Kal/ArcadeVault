import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/footer/footer';
import HomePage from './pages/HomePage';
import Wishlist from './pages/Wishlist';
import NotFound from './components/404/NotFound';
import useWishlist from './components/wishlist/wishlistManager';
import './App.css';
import About from './pages/About/AboutPage';
import LoginPage from './pages/Login/Login';
import SignupPage from './pages/Login/SignupPage';
import ProfilePage from './pages/ProfilePage/ProfilePage'; // Import ProfilePage
import GamesPage from './pages/GamesPage/GamesPage';

function App() {
  const { wishlist, addToWishlist, removeFromWishlist, clearWishlist, loadUserWishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Load user's wishlist on login
  useEffect(() => {
    if (isLoggedIn) {
      loadUserWishlist();
    }
  }, [isLoggedIn]);

  // Handle logout behavior
  const handleLogout = () => {
    localStorage.removeItem('token'); // Only remove token when logout is triggered
    sessionStorage.removeItem('wishlist');
    clearWishlist(); // Clear wishlist state
    setIsLoggedIn(false);
  };

  // Navigate to Profile Page
  const navigateToProfile = () => {
    window.location.href = '/profile'; // Redirect to profile page
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar
          wishlistCount={wishlist.length}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          navigateToProfile={navigateToProfile} // Pass the function to navigate to profile
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
            element={
              <Wishlist
                wishlist={wishlist}
                removeFromWishlist={removeFromWishlist}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/login"
            element={
              <LoginPage setIsLoggedIn={setIsLoggedIn} loadUserWishlist={loadUserWishlist} />
            }
          />
          <Route
            path="/games"
            element={
              <GamesPage
                addToWishlist={addToWishlist}
                searchQuery={searchQuery}
                wishlist={wishlist}
              />
            }
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* Add route for ProfilePage */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
