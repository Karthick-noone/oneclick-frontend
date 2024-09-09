import React from 'react';
import './css/ProfileCard.css'; // Ensure you create this CSS file

const ProfileCard = ({ username }) => {
  return (
    <div className="profile-card-container">
      <img
        src="https://via.placeholder.com/100"
        alt="Profile"
        className="profile-image"
      />
      <h3 className="profile-username">{username}</h3>
    </div>
  );
};

export default ProfileCard;
