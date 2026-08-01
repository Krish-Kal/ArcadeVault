import React from "react";
import "./Gamesearch.css";

function Searchbox({ searchQuery, setSearchQuery }) {
  return (
    <div className="searchbox-container">
      <input
        type="text"
        className="searchbox-input"
        placeholder="🔍 Search games, genres..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {searchQuery && (
        <button
          type="button"
          className="search-clear"
          onClick={() => setSearchQuery("")}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default Searchbox;