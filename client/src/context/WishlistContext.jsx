import { createContext, useContext, useState, useEffect, useRef } from "react";

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

// Helper: Extract unique identifier for the currently logged in user
const getCurrentUserKey = () => {
  try {
    const userStr = localStorage.getItem("chronoscent_user");
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?.email ? user.email.toLowerCase().trim() : user?._id || user?.id || null;
  } catch {
    return null;
  }
};

const getWishlistStorageKey = (userKey) => {
  return userKey ? `chronoscent_wishlist_user_${userKey}` : `chronoscent_wishlist_guest`;
};

// Helper: Load wishlist with fallback to legacy 'chronoscent_wishlist'
const loadInitialWishlist = (userKey) => {
  try {
    if (userKey) {
      const userSaved = localStorage.getItem(getWishlistStorageKey(userKey));
      if (userSaved) return JSON.parse(userSaved);
      // Legacy fallback
      const legacy = localStorage.getItem("chronoscent_wishlist");
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localStorage.setItem(getWishlistStorageKey(userKey), legacy);
          return parsed;
        }
      }
      return [];
    } else {
      const guestSaved = localStorage.getItem(getWishlistStorageKey(null));
      if (guestSaved) return JSON.parse(guestSaved);
      const legacy = localStorage.getItem("chronoscent_wishlist");
      if (legacy) return JSON.parse(legacy);
      return [];
    }
  } catch {
    return [];
  }
};

// Helper: Merge guest wishlist into user wishlist without duplicates
const mergeWishlists = (userList, guestList) => {
  const merged = [...userList];
  guestList.forEach((guestItem) => {
    const existing = merged.find(
      (item) => (item._id && item._id === guestItem._id) || item.name === guestItem.name
    );
    if (!existing) {
      merged.push({ ...guestItem });
    }
  });
  return merged;
};

export const WishlistProvider = ({ children }) => {
  const [currentUserKey, setCurrentUserKey] = useState(getCurrentUserKey);
  const [wishlistItems, setWishlistItems] = useState(() => loadInitialWishlist(getCurrentUserKey()));

  const activeKeyRef = useRef(currentUserKey);
  const wishlistItemsRef = useRef(wishlistItems);
  const isSwitchingUserRef = useRef(false);

  // Keep wishlistItemsRef updated
  useEffect(() => {
    wishlistItemsRef.current = wishlistItems;
  }, [wishlistItems]);

  // Handle Login & Logout events across components / tabs
  useEffect(() => {
    const handleAuthChange = () => {
      const nextUserKey = getCurrentUserKey();
      if (nextUserKey === activeKeyRef.current) return;

      const prevUserKey = activeKeyRef.current;

      // 1. Persist previous user's wishlist before switching
      if (prevUserKey) {
        try {
          localStorage.setItem(getWishlistStorageKey(prevUserKey), JSON.stringify(wishlistItemsRef.current));
        } catch (e) {
          console.error("Failed to persist wishlist before switch:", e);
        }
      }

      isSwitchingUserRef.current = true;
      activeKeyRef.current = nextUserKey;
      setCurrentUserKey(nextUserKey);

      // 2. Determine new items
      let newItems = [];
      if (nextUserKey) {
        // User logged in: load user's wishlist
        const saved = localStorage.getItem(getWishlistStorageKey(nextUserKey));
        const userWishlist = saved ? JSON.parse(saved) : [];

        // If guest had added items right before logging in, merge them in
        const guestWishlist = !prevUserKey && wishlistItemsRef.current.length > 0 ? wishlistItemsRef.current : [];
        if (guestWishlist.length > 0) {
          newItems = mergeWishlists(userWishlist, guestWishlist);
        } else {
          newItems = userWishlist;
        }

        // Clean up guest wishlist once logged in
        try {
          localStorage.removeItem(getWishlistStorageKey(null));
        } catch {}

        try {
          localStorage.setItem(getWishlistStorageKey(nextUserKey), JSON.stringify(newItems));
        } catch (e) {}
      } else {
        // User logged out: clear active wishlist so items disappear
        newItems = [];
        try {
          localStorage.removeItem(getWishlistStorageKey(null));
        } catch {}
      }

      wishlistItemsRef.current = newItems;
      setWishlistItems(newItems);

      setTimeout(() => {
        isSwitchingUserRef.current = false;
      }, 50);
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // Save wishlist to active user's storage key whenever items change
  useEffect(() => {
    if (isSwitchingUserRef.current) return;
    try {
      const key = activeKeyRef.current;
      localStorage.setItem(getWishlistStorageKey(key), JSON.stringify(wishlistItems));
    } catch (err) {
      console.error("Failed to save wishlist to localStorage:", err);
    }
  }, [wishlistItems]);

  // Add or toggle an item in the wishlist
  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.name === product.name);
      if (existingItem) {
        return prevItems.filter((item) => item.name !== product.name);
      } else {
        return [...prevItems, { ...product }];
      }
    });
  };

  // Remove item completely
  const removeFromWishlist = (productName) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.name !== productName));
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
    try {
      localStorage.removeItem(getWishlistStorageKey(activeKeyRef.current));
      localStorage.removeItem("chronoscent_wishlist");
    } catch {}
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
