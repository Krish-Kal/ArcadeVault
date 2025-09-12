import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ setIsLoggedIn, loadUserWishlist }) => {
  const canvasRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState(''); // Updated state for handling success/error messages
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 75 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: 1.5 + Math.random() * 1.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffe7';
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 255, 231, ${1 - dist / 100})`;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://arcadevault-4.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email);
        loadUserWishlist(); // <-- fetch wishlist from DB
        setIsLoggedIn(true);
        setLoginMessage('Login successful!');
        setTimeout(() => {
          navigate('/profile');
          setLoginMessage('');
        }, 2000);
      } else {
        setLoginMessage(data.message || 'Login failed! Incorrect email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginMessage('Something went wrong! Please try again later.');
    }
  };

  return (
    <div className="login-page">
      <canvas ref={canvasRef} className="bg-canvas"></canvas>
      <div className="login-box">
        <h2 className="login-title">Access Your Vault</h2>
        <p className="login-subtitle">Enter your credentials</p>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="signup">
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>

        </div>

        {/* Display the login message (success or error) */}
        {loginMessage && (
          <div className={`login-message ${loginMessage === 'Login successful!' ? 'success' : 'error'}`}>
            {loginMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
