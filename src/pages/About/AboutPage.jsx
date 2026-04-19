import React, { useEffect } from "react";
import "./AboutPage.css";
import ParticlesBackground from "../../components/ParticlesBackground";

const About = () => {
  
  useEffect(() => {
  // disable global background ONLY on About page
  document.body.classList.add("no-global-bg");

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

  const elements = document.querySelectorAll(
    ".feature-card, .about-me-card, .footer-section"
  );

  elements.forEach((el) => observer.observe(el));

  return () => {
    document.body.classList.remove("no-global-bg");
    observer.disconnect(); // 🔥 better than unobserve loop
  };
}, []);

  return (
    <div className="about-page">
       <ParticlesBackground />
      {/* Hero Section */}
      <section className="hero-section">
        <h1>ArcadeVault</h1>
        <p>
          Welcome to <strong>ArcadeVault</strong> — the ultimate gaming hub.
          Track your collection, explore game stats, manage wishlists, and
          enjoy a seamless gaming experience.
        </p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card highlight">
          <h3>Vault Access</h3>
          <p>
            Securely log in to your personal Vault to manage your game
            collection, wishlists, and preferences — keeping your gaming data
            safe, organized, and accessible anytime.
          </p>
        </div>

        <div className="feature-card highlight">
          <h3>Wishlist</h3>
          <p>
            Create and manage wishlists to never miss upcoming releases or
            updates for your favorite games.
          </p>
        </div>

        <div className="feature-card">
          <h3>Ultimate Gaming Hub</h3>
          <p>
            Access pro tips, track your gaming stats, read legendary quotes,
            and explore top game stores — all in one hub.
          </p>
        </div>

        <div className="feature-card">
          <h3>Multi-Platform Hub</h3>
          <p>
            Access and manage games from various platforms in a single
            streamlined interface.
          </p>
        </div>
      </section>

      {/* About Me Section */}
      <section className="about-me-section">
        <div className="about-me-card">
          <div className="about-text">
            <h2>About Me</h2>
            <p>
              I'm <strong>Krishna Kalvakolanu</strong>, the brain behind
              ArcadeVault. Born out of my love for gaming and technology, I
              built this hub to create experiences that gamers actually enjoy —
              fun, intuitive, and a little quirky, just like the games
              themselves.
            </p>

            {/* Social Links */}
            <div className="social-links">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>

              <a
                href="https://github.com/Krish-Kal"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-github"></i>
              </a>

              <a
                href="https://www.linkedin.com/in/krishna-kalvakolanu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="footer-section">
        <h2>Ready to Level Up?</h2>
        <p>Join ArcadeVault today and elevate your gaming experience.</p>
        <a className="footer-cta" href="/">
          Start Exploring
        </a>
      </section>
    </div>
  );
};

export default About;