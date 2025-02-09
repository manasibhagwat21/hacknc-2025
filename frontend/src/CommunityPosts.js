import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const CommunityPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 🔹 Get communityId and communityName from query params
    // const location = useLocation();
    // const queryParams = new URLSearchParams(location.search);
    const communityId = "adw"
    const communityName = "adda"

    // 🔹 Fetch posts when component mounts or communityId changes
    useEffect(() => {
            fetchCommunityPosts();
    }, []);

    // 🔹 Function to fetch posts from API
    const fetchCommunityPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8000/posts`);
            setPosts(response.data.posts);
        } catch (err) {
            setError("Failed to load posts.");
        }
        setLoading(false);
    };

    return (
        <div>
           <div>
           {posts && posts.length > 0 ? (
  posts.map(post => (
    <div key={post.id}>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p>Author ID: {post.author_id}</p>
      <p>Created At: {new Date(post.created_at).toLocaleString()}</p>

      <h3>Comments:</h3>
      <ul>
        {post.comments.map(commentId => (
          <li key={commentId}>Comment ID: {commentId}</li>
        ))}
      </ul>
    </div>
  ))
) : (
  <p>No posts available</p>
)}

    </div>
        </div>
    );
};

export default CommunityPosts;
