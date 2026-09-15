import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add an item to the cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart based on its ID
      // To ensure uniqueness across different categories, we use the name and id
      const existingItem = prevItems.find((item) => item._id === product._id && item.name === product.name);
      
      if (existingItem) {
        // If it exists, increase quantity
        return prevItems.map((item) =>
          item._id === product._id && item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If it's new, add to array with quantity 1 and generate a unique cartId
        return [...prevItems, { ...product, quantity: 1, cartId: Date.now() + Math.random() }];
      }
    });
    
    // Optional: Could add a toast notification here
    // alert(`${product.name} added to cart!`);
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
  };

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 15 : 0;
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
