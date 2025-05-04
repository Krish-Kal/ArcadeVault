import React from 'react';
import './Gamesearch.css'; // Import the specific CSS for Searchbox

function Searchbox({ searchQuery, setSearchQuery }) {
  return (
    <div className="searchbox-container">
      <input
        type="text"
        className="searchbox-input"
        placeholder="Search for a game..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update the search query
      />
    </div>
  );
}

export default Searchbox;
