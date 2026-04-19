import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import ParticlesBackground from "../../components/ParticlesBackground";

function Profile() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");
  
  const API = import.meta.env.VITE_API_URL;

  // 🔥 FETCH PROFILE (SAFE + CLEAN)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (res.ok && data?.email) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          console.error("Invalid user response:", data);
          setUser(null);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setUser(null);
      }
    };

    fetchProfile();
  }, [API, token]);

  // 🔥 AVATAR UPLOAD (PRO VERSION)
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(`${API}/api/users/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

if (res.ok) {
  const updatedUser = {
    ...user,
    avatar: data.avatar
  };

  setUser(updatedUser);

  // 🔥 sync with navbar
  localStorage.setItem("user", JSON.stringify(updatedUser));

  // 🔥 force navbar refresh (same tab)
  window.dispatchEvent(new Event("userUpdated"));

  setFile(null);
} else {
        console.error("Upload failed:", data);
      }

    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  // 🔥 LOADING STATE
  if (!user) {
    return <div className="profile-loading">Loading Vault...</div>;
  }

return (
  <div className="profile-wrapper">

    {/* BACKGROUND LAYER */}
    <ParticlesBackground />

    {/* MAIN CONTENT */}
    <div className="profile-container">

      {/* LEFT PANEL */}
      <div className="profile-card">

        <div className="avatar-section">
          <img
            src={
              user?.avatar
                ? `${API}${user.avatar}`
                : "/user.png"
            }
            alt="avatar"
            className="profile-avatar"
          />
        </div>

        <h2 className="profile-email">{user.username || user.email}</h2>
        <p className="profile-subtext">{user.email}</p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="avatar-input"
        />

        <button
          onClick={handleUpload}
          className="upload-btn"
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : "Upload Avatar"}
        </button>

      </div>

      {/* RIGHT PANEL */}
      <div className="profile-stats">

        <div className="stat-box">
          <h3>Wishlist Items</h3>
          <p>{user.wishlist?.length || 0}</p>
        </div>

        <div className="stat-box">
          <h3>Account Status</h3>
          <p>Premium Gamer</p>
        </div>

        <div className="stat-box">
          <h3>Vault ID</h3>
          <p>{user._id?.slice(0, 8)}</p>
        </div>

      </div>

    </div>
  </div>
);
}

export default Profile;