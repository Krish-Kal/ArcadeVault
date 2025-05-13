import React from "react";
import "./AboutPage.css"; // Ensure this path is correct

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

      {/* === About Us Section (Two Creators) === */}
      <section className="about-me two-creators">
        <div className="creator-card">
          <img
            src="/DP.jpg"
            alt="Krishna Kalvakolanu"
            className="creator-photo"
          />
          <h2>Krishna Kalvakolanu</h2>
          <p>
             Hello, I'm the creator behind ArcadeVault. With a passion for gaming and technology, I've created a platform to bring gamers closer to their favorite games from Epic Games, Steam, and Rockstar Games. My goal is to combine convenience and innovation in one powerful platform.
          </p>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://github.com/Krish-Kal" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/krishna-kalvakolanu/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>

        <div className="creator-card">
          <img
            src="/DP2.jpg"
            alt="Alex Morgan"
            className="creator-photo"
          />
          <h2>Mani Shashank</h2>
          <p>
            I'm Mani Shashank, co-developer of ArcadeVault.
I focus on making the platform smoother, faster, and more enjoyable to use. I work on improving the overall experience — from how things look to how they feel — by suggesting new features, helping with layout improvements, and keeping the site responsive across devices.
          </p>
          <div className="social-links">
            <a href="https://twitter.com/alexdev" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://github.com/alexdev" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://linkedin.com/in/alexmorgan" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </section>

      {/* === Project Overview Section === */}
      <section className="project-overview">
        <h2>About the Project</h2>
        <p>
          ArcadeVault is built with cutting-edge technology and a vision to revolutionize how gamers discover and purchase games. This platform brings together games from major platforms like Epic, Steam, and Rockstar, allowing gamers to browse and compare in one unified space.
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
