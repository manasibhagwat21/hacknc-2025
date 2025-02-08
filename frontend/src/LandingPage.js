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
      <nav className="navbar">
        <div className="logo">
          <img src="handshake-placeholder.png" alt="Handshake" className="logo-img" /> {/* Add your placeholder image here */}
        </div>
        <Link to="/login">
        <div className="login">
          <button className="login-btn">Log In</button>
        </div>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="tagline">{tagline}</h1>
        <Link to="/signup">
        <button className="cta-btn">Join the Movement!</button>
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
