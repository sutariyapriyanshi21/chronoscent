import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
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

const getStorageKey = (userKey) => {
  return userKey ? `chronoscent_cart_user_${userKey}` : `chronoscent_cart_guest`;
};

// Helper: Load cart with fallback to legacy 'chronoscent_cart'
const loadInitialCart = (userKey) => {
  try {
    if (userKey) {
      const userSaved = localStorage.getItem(getStorageKey(userKey));
      if (userSaved) return JSON.parse(userSaved);
      // Legacy fallback: if user exists but has no user key yet, migrate legacy
      const legacy = localStorage.getItem("chronoscent_cart");
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localStorage.setItem(getStorageKey(userKey), legacy);
          return parsed;
        }
      }
      return [];
    } else {
      // Guest user: check guest cart or legacy cart
      const guestSaved = localStorage.getItem(getStorageKey(null));
      if (guestSaved) return JSON.parse(guestSaved);
      const legacy = localStorage.getItem("chronoscent_cart");
      if (legacy) return JSON.parse(legacy);
      return [];
    }
  } catch {
    return [];
  }
};

// Helper: Merge guest cart into user cart without duplicating existing items
const mergeCarts = (userCart, guestCart) => {
  const merged = [...userCart];
  guestCart.forEach((guestItem) => {
    const existing = merged.find(
      (item) => (item._id && item._id === guestItem._id) || item.name === guestItem.name
    );
    if (existing) {
      existing.quantity += guestItem.quantity || 1;
    } else {
      merged.push({ ...guestItem });
    }
  });
  return merged;
};

export const CartProvider = ({ children }) => {
  const [currentUserKey, setCurrentUserKey] = useState(getCurrentUserKey);
  const [cartItems, setCartItems] = useState(() => loadInitialCart(getCurrentUserKey()));

  const activeKeyRef = useRef(currentUserKey);
  const cartItemsRef = useRef(cartItems);
  const isSwitchingUserRef = useRef(false);

  // Keep cartItemsRef updated
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  // Handle Login & Logout events across components / tabs
  useEffect(() => {
    const handleAuthChange = () => {
      const nextUserKey = getCurrentUserKey();
      if (nextUserKey === activeKeyRef.current) return;

      const prevUserKey = activeKeyRef.current;

      // 1. Persist previous user's cart before switching
      if (prevUserKey) {
        try {
          localStorage.setItem(getStorageKey(prevUserKey), JSON.stringify(cartItemsRef.current));
        } catch (e) {
          console.error("Failed to persist cart before switch:", e);
        }
      }

      isSwitchingUserRef.current = true;
      activeKeyRef.current = nextUserKey;
      setCurrentUserKey(nextUserKey);

      // 2. Determine new items
      let newItems = [];
      if (nextUserKey) {
        // User logged in: load user's cart
        const saved = localStorage.getItem(getStorageKey(nextUserKey));
        const userCart = saved ? JSON.parse(saved) : [];

        // If guest had added items right before logging in, merge them in
        const guestCart = !prevUserKey && cartItemsRef.current.length > 0 ? cartItemsRef.current : [];
        if (guestCart.length > 0) {
          newItems = mergeCarts(userCart, guestCart);
        } else {
          newItems = userCart;
        }

        // Clean up guest cart once logged in
        try {
          localStorage.removeItem(getStorageKey(null));
        } catch {}

        try {
          localStorage.setItem(getStorageKey(nextUserKey), JSON.stringify(newItems));
        } catch (e) {}
      } else {
        // User logged out: clear active cart so items disappear
        newItems = [];
        try {
          localStorage.removeItem(getStorageKey(null));
        } catch {}
      }

      cartItemsRef.current = newItems;
      setCartItems(newItems);

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

  // Save cart items to active user's storage key whenever items change
  useEffect(() => {
    if (isSwitchingUserRef.current) return;
    try {
      const key = activeKeyRef.current;
      localStorage.setItem(getStorageKey(key), JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  }, [cartItems]);

  // Add an item to the cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => (item._id && item._id === product._id) || item.name === product.name
      );

      if (existingItem) {
        return prevItems.map((item) =>
          ((item._id && item._id === product._id) || item.name === product.name)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1, cartId: Date.now() + Math.random() }];
      }
    });
  };

  // Increase item quantity
  const increaseQuantity = (cartId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease item quantity
  const decreaseQuantity = (cartId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartId === cartId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Remove item completely
  const removeItem = (cartId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(getStorageKey(activeKeyRef.current));
      localStorage.removeItem("chronoscent_cart");
    } catch {}
  };

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= 2500 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        subtotal,
        shipping,
        total,
        totalItems,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
