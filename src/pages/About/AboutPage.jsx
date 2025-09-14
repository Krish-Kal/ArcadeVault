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

    const container = document.querySelector(".about-page");
    const canvas = document.createElement("canvas");
    canvas.classList.add("bg-canvas");
    container.prepend(canvas);
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight - document.querySelector(".footer-section").offsetHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const shapes = [];
    const colors = [
      "rgba(0,240,255,0.2)",
      "rgba(138,208,255,0.15)",
      "rgba(255,255,255,0.1)",
    ];

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    class Shape {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 30 + 10;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.sides = Math.floor(Math.random() * 3) + 3;
        this.angle = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
      }

      update() {
        this.x += this.speedX + (mouse.x - canvas.width / 2) * 0.0005;
        this.y += this.speedY + (mouse.y - canvas.height / 2) * 0.0005;
        this.angle += this.rotationSpeed;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (let i = 0; i < this.sides; i++) {
          const theta = (i / this.sides) * 2 * Math.PI;
          const x = this.size * Math.cos(theta);
          const y = this.size * Math.sin(theta);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 50; i++) shapes.push(new Shape());

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapes.forEach((shape) => {
        shape.update();
        shape.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();

    const mouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", mouseMove);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>ArcadeVault</h1>
        <p>
          Welcome to <strong>ArcadeVault</strong> — the ultimate gaming hub. Track your collection, explore game stats, manage wishlists, and enjoy a seamless gaming experience.
        </p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card highlight">
          <h3>Vault Access</h3>
          <p>Securely log in to your personal Vault to manage your game collection, wishlists, and preferences — keeping your gaming data safe, organized, and accessible anytime.</p>
          </div>
        <div className="feature-card highlight">
          <h3>Wishlist</h3>
          <p>Create and manage wishlists to never miss upcoming releases or updates for your favorite games.</p>
        </div>
        <div className="feature-card">
          <h3>Ultimate Gaming Hub</h3>
           <p>Access pro tips, track your gaming stats, read legendary quotes, and explore top game stores — all in one hub.</p>
        </div>
        <div className="feature-card">
          <h3>Multi-Platform Hub</h3>
          <p>Access and manage games from various platforms in a single streamlined interface.</p>
        </div>
      </section>

      {/* About Me Section */}
      <section className="about-me-section">
        <div className="about-me-card">
          <div className="about-text">
            <h2>About Me</h2>
            <p>
             I'm <strong>Krishna Kalvakolanu</strong>, the brain behind ArcadeVault. Born out of my love for gaming and technology, I built this hub to create experiences that gamers actually enjoy — fun, intuitive, and a little quirky, just like the games themselves.
            </p>

            {/* Social Links */}
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
        <p>Join ArcadeVault today and elevate your gaming experience.</p>
        <a className="footer-cta" href="/">Start Exploring</a>
      </section>
    </div>
  );
};

export default About;
