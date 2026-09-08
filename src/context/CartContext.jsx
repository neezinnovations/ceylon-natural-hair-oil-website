import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "ceylon-natural-care-cart";

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  function addItem(item, quantity = 1) {
    setCartItems((current) => {
      const existing = current.find((row) => row.productId === item.productId);
      if (existing) {
        return current.map((row) =>
          row.productId === item.productId
            ? { ...row, quantity: row.quantity + quantity }
            : row
        );
      }
      return [...current, { ...item, quantity }];
    });
  }

  function updateQuantity(productId, quantity) {
    const qty = Math.max(1, Number(quantity) || 1);
    setCartItems((current) =>
      current.map((row) => (row.productId === productId ? { ...row, quantity: qty } : row))
    );
  }

  function removeItem(productId) {
    setCartItems((current) => current.filter((row) => row.productId !== productId));
  }

  function clearCart() {
    setCartItems([]);
  }

  const summary = useMemo(() => {
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { cartCount, subtotal, deliveryFee: 0, total: subtotal };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{ cartItems, addItem, updateQuantity, removeItem, clearCart, ...summary }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider.");
  return value;
}
