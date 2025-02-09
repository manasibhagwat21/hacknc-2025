import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';
import signup from './images/signup.png';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profile_pic: "",    
    bio: "",
    communities: [],
    preferences: [],
    servicesOffer: [],
    servicesNeed: [] 
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Fix: Import useNavigate for redirection

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

//comment out the following code to prevent the error while doing frontend

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/auth/signup', formData);
      setMessage(response.data.message);
      // Redirect to Preferences Page after successful signup
      if(response.data){
        navigate('/profilesetup');
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Error signing up');
    }
  };

  //comment out the following code to prevent the error while doing frontend

  return (
    
    <div className='container'>
      <nav className="navb">
          <div className="logo">
            <img src="https://png.pngtree.com/png-clipart/20221029/original/pngtree-shake-hands-png-image_8742463.png" alt="Handshake" className="logo-img" /> {/* Add your placeholder image here */}
          </div>
          <Link to="/login" className="login-btn">Log In </Link>
      </nav>
      <div className="sign-up-container">
        <div className="left">
          <img src="https://static.vecteezy.com/system/resources/previews/013/899/829/non_2x/girl-with-pointing-finger-vector.jpg" alt="Sign Up" className="sign-up-image" />
        </div>
        <div className="right">
        <div className="sign-up">
          <h2>Create an Account</h2>
          {message && <p className="message">{message}</p>}
          {/* <form> */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Link to="/profilesetup"> 
            {/* have to remove this link */}
            <button type="submit" className="btn">Sign Up</button>
            </Link>
          </form>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default SignUp;
