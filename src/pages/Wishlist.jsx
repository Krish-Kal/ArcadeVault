import React from 'react';
import WishlistPage from '../components/wishlist/WishlistPage';

const Wishlist = ({ wishlist, removeFromWishlist }) => {
  return (
    <div className="content no-welcome">
      <WishlistPage wishlist={wishlist} removeFromWishlist={removeFromWishlist} />
    </div>
  );
};

export default Wishlist;
