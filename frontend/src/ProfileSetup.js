import React, { useState } from "react";
import "./ProfileSetup.css";

const ProfileSetup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [bio, setBio] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const profileData = {
      profile_pic: profilePic,
      bio,
    };
    console.log("Profile Data:", profileData);
  };

  return (
    <div className="profile-setup">
      {/* Left 40% - Image Display */}
      <div className="image-container">
        <img
          src={profilePic || "https://png.pngtree.com/element_our/20190529/ourmid/pngtree-user-cartoon-avatar-pattern-flat-avatar-image_1200091.jpg"}
          alt="Profile"
          className="profile-preview"
        />
      </div>

      {/* Right 60% - Form */}
      <div className="form-container">
        <h2>Set Up Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="profilePic">Upload Profile Picture</label>
            <input
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
            />
          </div>
          <button type="submit" className="btn">Save</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
