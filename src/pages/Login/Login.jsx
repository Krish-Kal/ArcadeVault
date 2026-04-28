import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import ParticlesBackground from '../../components/ParticlesBackground';
import { emitUserUpdated } from '../../utils/avatar';


const LoginPage = ({ setIsLoggedIn, loadUserWishlist }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL || "https://arcadevault-4.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          emitUserUpdated();
        }
        loadUserWishlist();
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
      
      {/* ✅ NEW BACKGROUND COMPONENT */}
      <ParticlesBackground />

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
