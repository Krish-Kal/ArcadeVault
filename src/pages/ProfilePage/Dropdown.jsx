import React from "react";
import { Link } from "react-router-dom";
import "./Dropdown.css";

function Dropdown({ toggleDropdown, handleLogoutClick }) {
  return (
    <div className="dropdown-menu">

      <Link
        to="/profile"
        className="dropdown-item"
        onClick={toggleDropdown}
      >
         Profile Vault
      </Link>

      <Link
        to="/wishlist"
        className="dropdown-item"
        onClick={toggleDropdown}
      >
         Wishlist
      </Link>

      <div className="dropdown-divider"></div>

      <button
        className="dropdown-item logout"
        onClick={() => handleLogoutClick?.()}
      >
        🚪 Logout
      </button>

    </div>
  );
}

export default Dropdown;