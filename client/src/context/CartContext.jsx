import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const addToCart = (pizza) => {
    const existing = cartItems.find((i) => i._id === pizza._id);
    let updated;
    if (existing) {
      updated = cartItems.map((i) =>
        i._id === pizza._id ? { ...i, qty: i.qty + 1 } : i
      );
    } else {
      updated = [...cartItems, { ...pizza, qty: 1 }];
    }
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter((i) => i._id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    const updated = cartItems.map((i) =>
      i._id === id ? { ...i, qty } : i
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}