import React, { useEffect, useMemo, useState } from "react";
import "./ProfilePage.css";
import ParticlesBackground from "../../components/ParticlesBackground";
import { emitUserUpdated, resolveAvatarSrc } from "../../utils/avatar";

const formatDateTime = (date) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium"
  }).format(date);

const getCreatedAtFromObjectId = (id) => {
  if (!id || id.length < 8) {
    return null;
  }

  const timestamp = Number.parseInt(id.slice(0, 8), 16) * 1000;

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return new Date(timestamp);
};

function Profile() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [lastSyncedAt, setLastSyncedAt] = useState(() => new Date());

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL || "https://arcadevault-4.onrender.com";

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

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
          setLastSyncedAt(new Date());
          localStorage.setItem("user", JSON.stringify(data));
          emitUserUpdated();
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

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const joinedAt = useMemo(() => getCreatedAtFromObjectId(user?._id), [user?._id]);
  const wishlistCount = user?.wishlist?.length || 0;
  const vaultId = user?._id?.slice(0, 8)?.toUpperCase() || "UNKNOWN";
  const completionScore = Math.min(100, 45 + wishlistCount * 9 + (user?.avatar ? 20 : 0));

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0];

    if (!nextFile) {
      setFile(null);
      setPreviewUrl("");
      setStatusMessage("");
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(nextFile);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(nextFile);
    setPreviewUrl(nextPreviewUrl);
    setStatusMessage("");
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStatusMessage("");

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

      if (res.ok && data?.user) {
        setUser(data.user);
        setLastSyncedAt(new Date());
        localStorage.setItem("user", JSON.stringify(data.user));
        emitUserUpdated();
        setStatusMessage("Avatar updated successfully.");
        setFile(null);

        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl("");
      } else {
        setStatusMessage(data.message || "Avatar upload failed.");
        console.error("Upload failed:", data);
      }
    } catch (err) {
      setStatusMessage("Avatar upload failed. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-wrapper">
        <ParticlesBackground />
        <div className="profile-loading-shell">
          <div className="profile-loading">Loading Vault...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <ParticlesBackground />

      <div className="profile-container">
        <section className="profile-overview">
          <div className="profile-identity-card">
            <div className="profile-identity-top">
              <div className="profile-presence">
                <span className="presence-dot" />
                <span>Session Active</span>
              </div>
            </div>

            <div className="profile-identity-main">
              <div className="avatar-section">
                <img
                  src={previewUrl || resolveAvatarSrc(user?.avatar, API)}
                  onError={(e) => {
                    e.currentTarget.src = "/user.png";
                  }}
                  alt="avatar"
                  className="profile-avatar"
                />
              </div>

              <div className="profile-copy">
                <p className="profile-eyebrow">Arcade Identity</p>
                <h1 className="profile-name">{user.username || user.email}</h1>
                <p className="profile-subtext">{user.email}</p>

                <div className="profile-tags">
                  <span className="profile-tag">ID · {vaultId}</span>
<span className="profile-tag">Library · {wishlistCount} titles</span>
<span className="profile-tag">Tier · Elite</span>
                </div>
              </div>
            </div>

            <div className="avatar-manager">
              <div className="avatar-actions">
                <label htmlFor="avatar-upload" className="modify-avatar-btn">
                  Modify Avatar
                </label>

                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="avatar-input"
                />

                <button
                  onClick={handleUpload}
                  className="upload-btn"
                  disabled={!file || uploading}
                >
                  {uploading ? "Uploading..." : file ? "Save Avatar" : "Choose an image"}
                </button>
              </div>

              <p className="avatar-hint">
                {file ? file.name : "PNG, JPG, WEBP, GIF, or AVIF up to 5 MB"}
              </p>

              {statusMessage ? (
                <p className={`avatar-status ${statusMessage.includes("successfully") ? "success" : "error"}`}>
                  {statusMessage}
                </p>
              ) : null}
            </div>
          </div>

          <div className="profile-live-grid">
            <article className="live-panel emphasis">
              <p className="panel-label">System Clock</p>
              <h2>{formatDateTime(currentTime)}</h2>
              <p className="panel-note">Local Time.</p>
            </article>

            <article className="live-panel">
              <p className="panel-label">Account Origin</p>
              <h2>{joinedAt ? formatDate(joinedAt) : "Recently"}</h2>
              <p className="panel-note">Timestamp of your entry into the Vault.</p>
            </article>

          </div>
        </section>

        <section className="profile-stats">
  <div className="stat-box">
    <div>
      <h3>Library Size</h3>
      <p>{wishlistCount}</p>
    </div>
    <span className="stat-trend">
      {wishlistCount > 0 ? "Growing" : "Empty"}
    </span>
  </div>

  <div className="stat-box">
    <div>
      <h3>Player Tier</h3>
      <p>Elite</p>
    </div>
    <span className="stat-trend">Active</span>
  </div>

  <div className="stat-box">
    <div>
      <h3>Vault Signature</h3>
      <p>{vaultId}</p>
    </div>
    <span className="stat-trend">Verified</span>
  </div>
</section>
      </div>
    </div>
  );
}

export default Profile;
