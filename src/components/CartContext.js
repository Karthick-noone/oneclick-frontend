import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

 
  const addToCart = (item) => {
    setCartItems([...cartItems, { ...item, quantity: 1 }]);
  };


  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateCartItemQuantity = (id, quantity) => {
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const addToWishlist = (item) => {
    setWishlistItems([...wishlistItems, item]);
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      wishlistItems,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      addToWishlist,
      removeFromWishlist,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

