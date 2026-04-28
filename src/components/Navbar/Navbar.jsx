import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import user from '/user.png';
import Dropdown from '../../pages/ProfilePage/Dropdown';
import { emitUserUpdated, resolveAvatarSrc } from '../../utils/avatar';


function Navbar({ wishlistCount, isLoggedIn, handleLogout }) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const API = import.meta.env.VITE_API_URL || "https://arcadevault-4.onrender.com";

  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);
  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  const handleLogoutClick = () => {
    handleLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    emitUserUpdated();
    navigate('/');
  };

  // 🔥 LOAD USER (IMPORTANT FOR AVATAR)
useEffect(() => {
  const syncUser = () => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUserData(JSON.parse(stored));
      return;
    }

    setUserData(null);
  };



  // 🔥 listen both (cross-tab + same-tab)
  window.addEventListener("storage", syncUser);
  window.addEventListener("userUpdated", syncUser);

  syncUser();

  return () => {
    window.removeEventListener("storage", syncUser);
    window.removeEventListener("userUpdated", syncUser);
  };
}, []);

  // scroll hide/show navbar
  useEffect(() => {
    const scrollThreshold = 2;
    let lastScroll = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll <= scrollThreshold) {
        setIsNavbarVisible(true);
        setMobileMenuOpen(false);
      } else if (currentScroll - lastScroll > scrollThreshold) {
        setIsNavbarVisible(false);
        setMobileMenuOpen(false);
      } else if (lastScroll - currentScroll > scrollThreshold) {
        setIsNavbarVisible(true);
      }

      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
useEffect(() => {
  setDropdownVisible(false);
  setMobileMenuOpen(false); // also good UX
}, [location]);

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
        <li><Link to="/" className="navbar-link">Home</Link></li>
        <li><Link to="/about" className="navbar-link">About</Link></li>
        <li><Link to="/games" className="navbar-link">Games</Link></li>
        <li>
          <Link to="/wishlist" className="navbar-link">
            Wishlist ({wishlistCount})
          </Link>
        </li>
      </ul>

      {/* Avatar / Login */}
      <div className="navbar-login">

        {isLoggedIn ? (
          <>
            <img
              src={resolveAvatarSrc(userData?.avatar, API)}
              onError={(e) => (e.target.src = user)}
              alt="User Avatar"
              className="navbar-avatar-img"
              onClick={toggleDropdown}
            />

            {isDropdownVisible && (
              <Dropdown
                toggleDropdown={toggleDropdown}
                handleLogoutClick={handleLogoutClick}
              />
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
