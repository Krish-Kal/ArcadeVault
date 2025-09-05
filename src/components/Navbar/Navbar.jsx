import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import user from '/user.png';

function Navbar({ wishlistCount, isLoggedIn, handleLogout, userAvatar = user }) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const navigate = useNavigate();
  let lastScrollY = window.scrollY;

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
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

      if (window.innerWidth > 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setIsNavbarVisible(false);
        } else {
          setIsNavbarVisible(true);
        }
      } else {
        if (currentScrollY > lastScrollY) {
          setIsNavbarVisible(false); // hide on scroll down
        } else {
          setIsNavbarVisible(true);  // show on scroll up
        }
      }

      lastScrollY = currentScrollY;
    };

    const handleTap = (e) => {
      if (window.innerWidth <= 768) {
        setIsNavbarVisible(false); // hide navbar on screen tap
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleTap);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleTap);
    };
  }, []);

  return (
    <nav className={`navbar ${isNavbarVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <Link to="/" className="logo_link">
        <img src="/AV.png" alt="ArcadeVault Logo" className="logo" />
      </Link>

      {/* Hamburger Button */}
      <div className="hamburger" onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Conditionally visible nav list */}
      <ul className={`navbar-list ${isMobileMenuOpen ? 'open' : ''}`}>
        <li><Link to="/" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
        <li><Link to="/about" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>About</Link></li>
        <li><Link to="/games" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Games</Link></li>
        <li><Link to="/wishlist" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Wishlist ({wishlistCount})</Link></li>
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
          <Link to="/login" className="navbar-link">Vault</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
