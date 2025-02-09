import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import LandingPage from './LandingPage'; 
import SignUp from './SignUp';
import Login from './Login';
import ProfileSetup from './ProfileSetup';
import Preferences from './Preferences';
import Home from './Home';
import Community from './Community';
import CommunityPosts from './CommunityPosts';
import Serviceshare from './Serviceshare';
import Profile from './Profile'
import ChatbotWrapper from './ChatbotWrapper';

const App = () => {
  return (
    <Router>
      <ChatbotWrapper>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/preferences" element={<Preferences />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/profilesetup" element={<ProfileSetup />} />
        <Route path='/community' element={<Community />} />
        <Route path='/community-posts' element={<CommunityPosts />} />
        <Route path='/serviceshare' element={<Serviceshare />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
      </ChatbotWrapper>
    </Router>

  );
};

export default App;
