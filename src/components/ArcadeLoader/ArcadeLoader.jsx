import React, { useEffect } from "react";
import "./ArcadeLoader.css";

const ArcadeLoader = ({ onComplete }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);


  const particles = Array.from({ length: 70 });

  return (
    <div className="arcade-loader">

      {/* Particle background */}
      <div className="particle-field">
        {particles.map((_, i) => {

          const style = {
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            animationDuration: 6 + Math.random() * 6 + "s",
            animationDelay: Math.random() * 5 + "s"
          };

          return <span key={i} style={style}></span>;
        })}
      </div>

      {/* Center content */}
      <div className="loader-center">

        <div className="design-ring">
          <div className="inner-ring"></div>
        </div>

        <div className="progress-wrapper">
          <div className="progress-bar"></div>
        </div>

        <p className="loader-text">
          Initializing Arcade Vault Experience
        </p>

      </div>

    </div>
  );
};

export default ArcadeLoader;