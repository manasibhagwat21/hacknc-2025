import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import { Link } from 'react-router-dom';

const Profile = () => {
    const user = {
        name: 'John Doe',
        bio: 'A passionate developer always learning new technologies.',
        profilePic: 'https://thumbs.dreamstime.com/b/female-user-profile-avatar-woman-character-screen-saver-emotions-website-mobile-app-design-vector-199086515.jpg' // Replace with actual profile pic URL
    };

    // State to store invites
    const [invites, setInvites] = useState([]);

    // Fetch received requests (invites) when the component mounts
    useEffect(() => {
        const userId = 1; // Replace with actual user ID
        axios.get(`/requests/received-requests/${userId}`)
            .then(response => {
                setInvites(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the invites!", error);
            });
    }, []);

    // Function to handle accepting or declining invites
    const handleInviteResponse = (requestId, status) => {
        const data = {
            sender_id: 1, // Replace with actual sender ID
            receiver_id: 1, // Replace with actual receiver ID
            status: status,
        };

        axios.post('/requests/update-request', data)
            .then(response => {
                console.log(response.data.message);
                // Update the invites list to reflect the changes
                setInvites(prevInvites => prevInvites.filter(invite => invite.request_id !== requestId));
            })
            .catch(error => {
                console.error("There was an error updating the invite status!", error);
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
                        <img src={user.profilePic} alt="Profile Avatar" className="profile-avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid black' }} />
                    </Link>
                    <span className="username">username</span>
                </div>
                <Link to="/" className="lo">Log Out </Link>
            </nav>

            <div className="profile-page">
                {/* Sidebar Section */}
                <div className="sidebar">
                    <div className="profile-info">
                        <img src={user.profilePic} alt="Profile" className="profile-pic" />
                        <h2 className="usern">{user.name}</h2>
                        <p className="bio">{user.bio}</p>
                    </div>
                </div>

                {/* Main Section */}
                <div className="main-content">
                    <h2>Your Invites</h2>
                    <div className="invites">
                        {invites.length === 0 ? (
                            <p>No pending invites.</p>
                        ) : (
                            invites.map((invite) => (
                                <div key={invite.request_id} className="invite-card">
                                    <h3>{invite.community}</h3>
                                    <p>{invite.message}</p>
                                    <div className="invite-actions">
                                        <button 
                                            className="accept-btn" 
                                            onClick={() => handleInviteResponse(invite.request_id, 'accepted')}>
                                            Accept
                                        </button>
                                        <button 
                                            className="decline-btn" 
                                            onClick={() => handleInviteResponse(invite.request_id, 'declined')}>
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
