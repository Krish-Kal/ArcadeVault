import React, { useEffect } from "react";
import "./AboutPage.css";

const About = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll(".feature-card, .about-me-card, .footer-section");
    elements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="hero-section">
        <h1>ArcadeVault</h1>
        <p>
          Step into ArcadeVault — your Ultimate Gaming Hub. Discover, compare, and explore games across various websites and platforms, all in one smooth, immersive platform designed for the modern gamer.
        </p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <h3>Unified Game Library</h3>
          <p>
            Access all your favorite games from multiple platforms in one sleek interface — no switching, no clutter.
          </p>
        </div>
        <div className="feature-card">
           <h3>Wishlist & Favorites</h3>
    <p>
      Save your favorite games, build wishlists, and track releases easily — your Vault keeps your gaming world organized.
    </p>
        </div>
        <div className="feature-card">
           <h3>Vault Access</h3>
    <p>
      Secure and personalized user authentication — your gaming preferences and activity are safely stored in your personal Vault.
    </p>
        </div>
        <div className="feature-card">
           <h3>Seamless Experience</h3>
    <p>
      Smooth, immersive, and responsive design ensures a gaming browsing experience that’s fast, intuitive, and enjoyable.
    </p>
        </div>
      </section>

      {/* About Me Section */}
      <section className="about-me-section">
        <div className="about-me-card">
          <img src="/DP.jpg" alt="Krishna Kalvakolanu" />
          <div className="about-text">
            <h2>About Me</h2>
            <p>
              I'm Krishna Kalvakolanu, the mind behind ArcadeVault. I blend creativity, technology, and a love for gaming to build smooth, engaging, and slightly quirky experiences that gamers actually enjoy.
            </p>
            <div className="social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://github.com/Krish-Kal" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/krishna-kalvakolanu/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="footer-section">
        <h2>Ready to Level Up?</h2>
        <p>Explore ArcadeVault, discover your next favorite game, and join a community of passionate gamers worldwide.</p>
        <a className="footer-cta" href="/">Start Exploring</a>
      </section>

    </div>
  );
};

export default About;
