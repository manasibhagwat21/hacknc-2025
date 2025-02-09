import React, { useState, useEffect } from 'react';
import './LandingPage.css'; 
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [tagline, setTagline] = useState('Join the Deep Loop of Good Deeds!');
  const taglines = [
    'Join the Deep Loop of Good Deeds!',
    'A community where every good action creates a ripple of positive change.',
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTagline(prevTagline => 
        prevTagline === taglines[0] ? taglines[1] : taglines[0]
      );
    }, 4000); // Switch every 4 seconds
    
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);
  
  return (
    <div className="LandingPage">
      {/* Navbar */}
      <nav className="navb">
        <div className="logo">
          <img src="https://png.pngtree.com/png-clipart/20221029/original/pngtree-shake-hands-png-image_8742463.png" alt="Handshake" className="logo-img" /> {/* Add your placeholder image here */}
        </div>
        <Link to="/login" className="login-btn">Log In </Link>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="overlay"></div> {/* Overlay for text readability */}
        <div className="hero-text">
        <h1 className="title">DeedL<span>∞</span>p</h1>
        <h2 className="tagline">{tagline}</h2>
        <Link to="/signup">
          <button className="cta-btn">Join the Movement!</button>
        </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
