import React, { useEffect, useState } from 'react';
import './footer.css';

function Footer() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 Arcade Vault. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="/terms-of-service" className="footer-link">Terms of Service</a>
          <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
          <a href="/contact-us" className="footer-link">Contact Us</a>
        </div>
        <div className="social-links">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://github.com/Krish-Kal" target="_blank" rel="noopener noreferrer" aria-label="github">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/krishna-kalvakolanu/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
        
        </div>
      </div>

      {showButton && (
  <button className="go-to-top" onClick={scrollToTop} aria-label="Go to top">
    Go to Top
  </button>
)}


    </footer>
  );
}

export default Footer;
