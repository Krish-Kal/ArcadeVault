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

  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);
  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

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
    const scrollThreshold = 2; // very sensitive scroll detection
    let lastScroll = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll <= scrollThreshold) {
        // Always show navbar at the very top
        setIsNavbarVisible(true);
        setMobileMenuOpen(false);
      } else if (currentScroll - lastScroll > scrollThreshold) {
        // scrolling down
        setIsNavbarVisible(false);
        setMobileMenuOpen(false);
      } else if (lastScroll - currentScroll > scrollThreshold) {
        // scrolling up
        setIsNavbarVisible(true);
      }

      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isNavbarVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <Link to="/" className="logo_link">
        <img src="/AV.png" alt="ArcadeVault Logo" className="logo" />
      </Link>

      {/* Hamburger */}
      <div className="hamburger" onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Nav list */}
      <ul className={`navbar-list ${isMobileMenuOpen ? 'open' : ''}`}>
        <li><Link to="/" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
        <li><Link to="/about" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>About</Link></li>
        <li><Link to="/games" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Games</Link></li>
        <li><Link to="/wishlist" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Wishlist ({wishlistCount})</Link></li>
      </ul>

      {/* Avatar / Login */}
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
