import React, { useState } from 'react';
import './ProfileDropdown.css'; // Make sure to create the corresponding CSS for dropdown styling

function ProfileDropdown({ handleLogout, navigateToProfile }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="profile-dropdown">
      <div className="avatar-container" onClick={toggleDropdown}>
        <img
          src="/default-avatar.png" // Use a default avatar image or dynamic user avatar
          alt="User Avatar"
          className="avatar"
        />
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={navigateToProfile} className="dropdown-item">Visit Profile</button>
          <button onClick={handleLogout} className="dropdown-item">Logout</button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
