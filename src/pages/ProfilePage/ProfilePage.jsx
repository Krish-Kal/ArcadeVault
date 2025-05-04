import React, { useEffect, useRef, useState } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  const [lastLogin, setLastLogin] = useState(null);
  const [memberSince, setMemberSince] = useState(null);
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [avatar, setAvatar] = useState('https://placekitten.com/200/200'); // Default avatar

  const canvasRef = useRef(null);

  useEffect(() => {
    // Get last login date
    const storedLastLogin = localStorage.getItem('lastLogin');
    if (storedLastLogin) {
      setLastLogin(storedLastLogin);
    } else {
      setLastLogin('First login');
    }

    // Set the member since date (only on the first login)
    const storedMemberSince = localStorage.getItem('memberSince');
    if (!storedMemberSince) {
      const currentDate = new Date().toLocaleDateString();
      localStorage.setItem('memberSince', currentDate);
      setMemberSince(currentDate);
    } else {
      setMemberSince(storedMemberSince);
    }

    // You can replace this email with the actual email from user data
    const storedUserEmail = localStorage.getItem('userEmail') || 'user@example.com';
    setUserEmail(storedUserEmail);

    // Set avatar (replace with real avatar if available)
    const storedAvatar = localStorage.getItem('userAvatar') || 'public/user.png';
    setAvatar(storedAvatar);

    // Particle effect based on mouse movement (Canvas Animation)
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

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="profile-page">
      <canvas ref={canvasRef} className="bg-canvas"></canvas>

      <div className="profile-box">
        <div className="profile-header">
          <div className="avatar">
            <img src={avatar} alt="User Avatar" />
          </div>
          <h2 className="user-name">Your Name</h2>
        </div>
        <div className="user-info">
          <p><strong>Email:</strong> {userEmail}</p>
          <p><strong>Last Login:</strong> {lastLogin}</p>
          <p><strong>Member Since:</strong> {memberSince}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
