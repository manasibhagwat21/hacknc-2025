import React, { useState } from "react";
import "./ProfileSetup.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ProfileSetup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [bio, setBio] = useState("");
  const [previewURL, setPreviewURL] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const userId = 6; // Replace with actual user ID
  const navigate = useNavigate();

  const services = [
    "House cleaning", "Grocery shopping", "Pet sitting", "Lawn care", "Dog walking",
    "Babysitting", "Personal shopping", "Errand running", "Tutoring", "Fitness training",
    "Language lessons", "Cooking meals", "Car washing", "Handyman services", "Moving assistance",
    "Organizing closets", "Flower arrangement", "Laundry services", "Interior decorating",
    "Laundry folding", "Gardening", "Massage therapy", "Recycling pick-up", "Carpooling", "Event planning"
  ];

  // Handle selecting/unselecting services
  const handleServiceClick = (service) => {
    setSelectedServices((prevServices) =>
      prevServices.includes(service)
        ? prevServices.filter((s) => s !== service)
        : [...prevServices, service]
    );
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewURL(URL.createObjectURL(file)); // Preview image
    }
  };

  // Upload profile pic and bio
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (profilePic) {
      formData.append("profile_pic", profilePic);
    }
    if (bio) {
      formData.append("bio", bio);
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/users/profile-setup/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      console.log(response.data);
      setProfilePic(response.data.profile_pic);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  // Update services on Enter button click
  const handleUpdateServices = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/users/update-services-give",
        {
          user_id: userId,
          services: selectedServices,
        }
      );

      console.log("Services updated:", response.data);
      navigate("/preferences");
    } catch (error) {
      console.error("Error updating services:", error);
    }
  };

  return (
    <div className="profile-setup">
      {/* Left 40% - Image Display */}
      <div className="image-container">
        <img 
          style={{ borderRadius: "50%" }}
          src={previewURL || "https://cdna.artstation.com/p/assets/images/images/040/951/926/large/maddie_creates-jj-ver2.jpg?1630351796"}
          alt="Profile"
          className="profile-preview" 
        />
      </div>

      {/* Right 60% - Form */}
      <div className="form-container">
        <h1>Set Up Your Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="profilePic">Upload Profile Picture</label>
            <input
              style={{
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "white",
                border: "1px solid #ccc",
              }}
              type="file"
              id="profilePic"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Your Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              style={{
                padding: "10px",
                width: "400px",
                height: "200px",
                borderRadius: "5px",
                backgroundColor: "white",
                border: "1px solid #ccc",
              }}
            />
          </div>
          
          <button type="submit" id="save" className="form-group">
            Save
          </button>
        </form>

        <div className="service-section">
          <h2>I am looking for someone to do:</h2>
          <div className="service-bubbles">
            {services.map((service, index) => (
              <div
                key={index}
                className={`bubble ${selectedServices.includes(service) ? "selected" : ""}`}
                onClick={() => handleServiceClick(service)}
              >
                {service}
              </div>
            ))}
          </div>
          <button className="enter" onClick={handleUpdateServices}>Enter</button>
        </div>
        <button className="skip" onClick={() => navigate("/preferences")}>Skip →</button>
      </div>
    </div>
  );
};

export default ProfileSetup;