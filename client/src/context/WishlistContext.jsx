import React, { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Add an item to the wishlist
  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      // Check if item already exists in wishlist based on its name (simple check)
      const existingItem = prevItems.find((item) => item.name === product.name);
      
      if (existingItem) {
        // If it exists, remove it (like toggling a heart icon)
        return prevItems.filter((item) => item.name !== product.name);
      } else {
        // If it's new, add to array
        return [...prevItems, { ...product }];
      }
    });
  };

  // Remove item completely
  const removeFromWishlist = (productName) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.name !== productName));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
