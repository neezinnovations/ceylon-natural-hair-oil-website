import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { product } from "../data/siteData";

const CartContext = createContext(null);
const STORAGE_KEY = "ceylon-natural-care-cart";

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    const quantity = parsed.filter((item) => item?.productId === product.productId)
      .reduce((total, item) => total + (Number.isInteger(item.quantity) && item.quantity > 0 ? Math.min(item.quantity, 99) : 0), 0);
    return quantity ? [{ ...product, quantity: Math.min(quantity, 99) }] : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readStoredCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Keep the in-memory cart usable when browser storage is unavailable.
    }
  }, [cartItems]);

  function addItem(item, quantity = 1) {
    if (item?.productId !== product.productId) return;
    quantity = Math.min(99, Math.max(1, Math.floor(Number(quantity) || 1)));
    item = product;
    setCartItems((current) => {
      const existing = current.find((row) => row.productId === item.productId);
      if (existing) {
        return current.map((row) =>
          row.productId === item.productId
            ? { ...row, quantity: Math.min(99, row.quantity + quantity) }
            : row
        );
      }
      return [...current, { ...item, quantity }];
    });
  }

  function updateQuantity(productId, quantity) {
    const qty = Math.min(99, Math.max(1, Math.floor(Number(quantity) || 1)));
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
