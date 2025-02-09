import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState({});
    const [invites, setInvites] = useState([]);
    const userId = localStorage.getItem('userId');
    const user1 = {
        name: 'John Doe',
        bio: 'A passionate developer always learning new technologies.',
        profilePic: 'https://thumbs.dreamstime.com/b/female-user-profile-avatar-woman-character-screen-saver-emotions-website-mobile-app-design-vector-199086515.jpg' // Replace with actual profile pic URL
    };

    useEffect(() => {
        // Fetch user profile data
        axios.get(`/user/profile/${userId}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error("Error fetching user profile!", error);
            });
    }, [userId]);

    useEffect(() => {
        // Fetch received requests (invites)
        axios.get(`http://localhost:8000/requests/received-requests/${userId}`)
            .then(response => {
                setInvites(response.data);
            })
            .catch(error => {
                console.error("Error fetching invites!", error);
            });
    }, [userId]);

    const handleInviteResponse = (senderId, status) => {
        axios.post(`http://localhost:8000/requests/update-request`, {
            sender_id: senderId,
            receiver_id: userId,
            status: status,
        })
        .then(response => {
            console.log(response.data.message);
            setInvites(prevInvites => prevInvites.filter(invite => invite.sender_id !== senderId));
        })
        .catch(error => {
            console.error("Error updating invite status!", error);
        });
    };

    return (
        <div className="profiles">
            <nav className="navb">
                <div className="logo">
                    <img src="https://png.pngtree.com/png-clipart/20221029/original/pngtree-shake-hands-png-image_8742463.png" alt="Handshake" className="logo-img" />
                </div>
                
                <Link to="/Serviceshare" className="serviceshare-link">SwapServe</Link>

                <div className="profile">
                <Link to="/profile" >
                        <img src={user1.profilePic} alt="Profile Avatar" className="profile-avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid black' }} />
                    </Link>
                    <span className="username">{user.name || 'User'}</span>
                </div>
                <Link to="/" className="lo">Log Out </Link>
            </nav>

            <div className="profile-page">
                <div className="sidebar">
                    <div className="profile-info">
                    <img src={user1.profilePic} alt="Profile Avatar" className="profile-avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid black' }} />
                        <p className="bio">{user.bio || 'No bio available'}</p>
                    </div>
                </div>

                <div className="main-content">
                    <h2>Your Invites</h2>
                    <div className="invites">
                        {invites.length === 0 ? (
                            <p>No pending invites.</p>
                        ) : (
                            invites.map((invite) => (
                                <div className="invite-card">
                                    <h3>User Id :{invite.sender_id}  - View Profile</h3>
                                    <p>Hello, I am willing to barter my services for yours!</p>
                                    <div className="invite-actions">
                                        <button 
                                            className="accept-btn" 
                                            onClick={() => handleInviteResponse(invite.sender_id, 'accepted')}>
                                            Accept
                                        </button>
                                        <button 
                                            className="decline-btn" 
                                            onClick={() => handleInviteResponse(invite.sender_id, 'declined')}>
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>    
    );
};

export default Profile;