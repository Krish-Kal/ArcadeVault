import React from 'react';
import './NotFound.css';

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="stars"></div>
      <div className="glow-center">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-text">Oops! This page doesn't exist... 🚀</p>
        <a href="/" className="notfound-button">Back to Home</a>
      </div>
    </div>
  );
}

export default NotFound;
