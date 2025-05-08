import React from "react";
import "./AboutPage.css"; // Ensure the CSS from above is imported

const About = () => {
  return (
    <div className="about-page">
      {/* === Header Section === */}
      <section className="header">
        <h1>ArcadeVault</h1>
        <p>
          Welcome to ArcadeVault, your one-stop destination for all things gaming. Explore the future of gaming with a seamless experience across multiple platforms.
        </p>
      </section>

      {/* === About Me Section === */}
      <section className="about-me">
        <img
          src="/DP.jpg" // Corrected image path to be relative to the public folder
          alt="Creator"
          className="creator-photo"
        />
        <h2>About the Creator</h2>
        <p>
          Hello, I'm the creator behind ArcadeVault. With a passion for gaming and technology, I've created a platform to bring gamers closer to their favorite games from Epic Games, Steam, and Rockstar Games. My goal is to combine convenience and innovation in one powerful platform.
        </p>
        <div className="social-links">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="github">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </section>

      {/* === Project Overview Section === */}
      <section className="project-overview">
        <h2>About the Project</h2>
        <p>
          ArcadeVault is built with cutting-edge technology and a vision to revolutionize how gamers discover and purchase games. This platform will allow users to explore games from various major platforms, all in one seamless experience. The goal is to create a community of gamers who can easily browse, buy, and enjoy their favorite titles.
        </p>
      </section>

      {/* === Call to Action (CTA) Section === */}
      <section className="cta">
        <h2>Join Us on This Journey</h2>
        <p>Be part of the future of gaming. Explore our collection of games and join a community of like-minded gamers.</p>
        <a className="cta-button" href="/">Explore ArcadeVault</a>
      </section>
    </div>
  );
};

export default About;
