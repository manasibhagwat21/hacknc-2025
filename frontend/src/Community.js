import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Community.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Community = () => {
    const [joinedCommunities, setJoinedCommunities] = useState([]);
    const [availableCommunities, setAvailableCommunities] = useState([]);
    const userId = 6; // Replace with actual user ID
    const [currentIndex, setCurrentIndex] = useState(0);
    const communityContainerRef = useRef(null);
    const navigate = useNavigate(); 

    const fetchAvailableCommunities = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/community/available-communities/${userId}`);
            setAvailableCommunities(response.data.available_communities);
        } catch (error) {
            console.error('Error fetching available communities:', error);
        }
    };

    const fetchJoinedCommunities = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/community/joined-communities/${userId}`);
            setJoinedCommunities(response.data.joined_communities);
        } catch (error) {
            console.error('Error fetching joined communities:', error);
        }
    };

    useEffect(() => {
        fetchAvailableCommunities();
        fetchJoinedCommunities();
    }, [userId]);

    const joinCommunity = async (communityName) => {
        try {
            console.log("Joining community:", communityName);
            const response = await axios.post("http://localhost:8000/community/join", {
                user_id: userId,
                community_name: communityName.toString()
            }, {
                headers: { "Content-Type": "application/json" }
            });

            console.log(response.data.message);
            setJoinedCommunities([...joinedCommunities, communityName]);
            fetchAvailableCommunities();
            fetchJoinedCommunities();
        } catch (error) {
            console.error("Error joining community:", error.response?.data?.detail || error.message);
        }
    };

    const handleNext = () => {
        if (currentIndex < availableCommunities.length - 1) {
            setCurrentIndex(currentIndex + 1);
            communityContainerRef.current.scrollLeft += 250; // Scroll by one card width
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            communityContainerRef.current.scrollLeft -= 250; // Scroll by one card width
        }
    };

    const navigateToCommunityPosts = (communityId, communityName) => {
        // Use navigate to go to the community posts page with communityId and communityName as query params
        navigate(`/communityposts?communityId=${communityId}&communityName=${communityName}`);
    };

    if (availableCommunities.length === 0 && joinedCommunities.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <nav className="navb">
                <div className="logo">
                    <img src="https://png.pngtree.com/png-clipart/20221029/original/pngtree-shake-hands-png-image_8742463.png" alt="Handshake" className="logo-img" />
                </div>
                
                    <Link to="/Serviceshare" className="serviceshare-link">SwapServe</Link>
        
                <div className="profile">
                    <Link to="/profile" >
                    <img src="https://thumbs.dreamstime.com/b/female-user-profile-avatar-woman-character-screen-saver-emotions-website-mobile-app-design-vector-199086515.jpg" alt="Profile Avatar" className="profile-avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid black' }} />
                    </Link>
                    <span className="username">username</span>
                </div>
                <Link to="/" className="lo">Log Out </Link>
            </nav>

            {/* Available Communities Section */}
            <div className="available-communities-container">
                <div className="available-communities" ref={communityContainerRef}>
                    {availableCommunities.map((community) => (
                        <div key={community.id} className="available-community-card">
                            <div className="card-header">
                                <h3>{community.name}</h3>
                            </div>
                            <div className="card-description">
                                <p>{community.description}</p>
                            </div>
                            <button className="card-button" onClick={() => joinCommunity(community.name)}>Join+</button>
                        </div>
                    ))}
                </div>
            </div>

            <img className="community-image" src="https://images.squarespace-cdn.com/content/v1/535e680de4b0eea56c05a375/1626429807994-WVLUZ8JPBFNQJLFARUYL/New_Characters.gif" alt="Community" />

            <div className="your-communities">
                <h2>Your Communities</h2>
                {joinedCommunities.map((community, index) => (
                    <div key={index} className="your-community-card" onClick={() => navigateToCommunityPosts(community.id, community.name)}>
                        <h3>{community.name}</h3>
                        <p>{community.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
