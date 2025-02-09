import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const CommunityPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 🔹 Get communityId and communityName from query params
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const communityId = queryParams.get("communityId");
    const communityName = queryParams.get("communityName");

    // 🔹 Fetch posts when component mounts or communityId changes
    useEffect(() => {
        if (communityId) {
            fetchCommunityPosts();
        }
    }, [communityId]);

    // 🔹 Function to fetch posts from API
    const fetchCommunityPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8000/community/posts/${communityId}`);
            setPosts(response.data.posts);
        } catch (err) {
            setError("Failed to load posts.");
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Posts in {communityName}</h2>

            {loading && <p>Loading posts...</p>}

            {posts.length === 0 && !loading && <p>No posts available.</p>}

            <ul>
                {posts.map((post) => (
                    <li key={post._id}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <small>Posted by User {post.author_id} on {new Date(post.created_at).toLocaleString()}</small>

                        {post.comments && post.comments.length > 0 && (
                            <div>
                                <h4>Comments:</h4>
                                <ul>
                                    {post.comments.map((comment, index) => (
                                        <li key={index}>
                                            <strong>User {comment.author_id}:</strong> {comment.content}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommunityPosts;
