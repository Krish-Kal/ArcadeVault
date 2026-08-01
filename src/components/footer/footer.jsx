import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const downloadArcadeOS = () => {
    window.location.href =
      'https://github.com/Krish-Kal/Arcade-OS/releases/latest/download/Arcade-Kernel-Setup.exe';
  };

  return (
    <footer className="footer">
      <div className="footer-content">

        <p>&copy; 2025 Arcade Vault. All Rights Reserved.</p>

        <div className="footer-links">
          <a href="/terms-of-service" className="footer-link">
            Terms of Service
          </a>

          <a
            href="https://krish-cyber-lab.vercel.app/"
            className="footer-link"
          >
            Contact Us
          </a>
        </div>

        {/* Arcade Kernel Download */}
        <button
          className="arcade-os-download"
          onClick={downloadArcadeOS}
          type="button"
        >
          Download Arcade Kernel
        </button>

        <div className="social-links">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </a>

          <a
            href="https://github.com/Krish-Kal"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <i className="fab fa-github"></i>
          </a>

          <a
            href="https://www.linkedin.com/in/krishna-kalvakolanu/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>

      {showButton && (
        <button
          className="go-to-top"
          onClick={scrollToTop}
          aria-label="Go to top"
          title="Back to top"
        >
          <ArrowUp size={20} strokeWidth={2.2} />
        </button>
      )}
    </footer>
  );
}

export default Footer;

