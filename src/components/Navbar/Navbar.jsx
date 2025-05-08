import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import user from '/user.png'; // Adjusted to the correct path relative to the public folder

function Navbar({ wishlistCount, isLoggedIn, handleLogout, userAvatar = user }) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const navigate = useNavigate();
  let lastScrollY = window.scrollY;

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleLogoutClick = () => {
    setLoggingOut(true);
    handleLogout();
    setDropdownVisible(false);

    setTimeout(() => {
      setLoggingOut(false);
      navigate('/');
    }, 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if screen size is larger than 768px (desktop)
      if (window.innerWidth > 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setIsNavbarVisible(false); // scroll down = hide navbar
        } else {
          setIsNavbarVisible(true); // scroll up = show navbar
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isNavbarVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <Link to="/" className="logo_link">
        <img src="/AV.png" alt="ArcadeVault Logo" className="logo" />
      </Link>

      <ul className="navbar-list">
        <li><Link to="/" className="navbar-link">Home</Link></li>
        <li><Link to="/about" className="navbar-link">About</Link></li>
        <li><Link to="/games" className="navbar-link">Games</Link></li> {/* ✅ NEW GAMES LINK */}
        <li><Link to="/wishlist" className="navbar-link">Wishlist ({wishlistCount})</Link></li>
      </ul>

      <div className="navbar-login">
        {loggingOut ? (
          <div className="navbar-logout-message">Logging Out...</div>
        ) : isLoggedIn ? (
          <>
            <img
              src={userAvatar}
              alt="User Avatar"
              className="navbar-avatar-img"
              onClick={toggleDropdown}
            />
            {isDropdownVisible && (
              <div className="navbar-dropdown">
                <Link to="/profile" className="navbar-dropdown-item" onClick={toggleDropdown}>Visit Profile</Link>
                <button onClick={handleLogoutClick} className="navbar-dropdown-item">Logout</button>
              </div>
            )}
          </>
        ) : (
          <Link to="/login" className="navbar-link">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
