"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Artwork } from "@/lib/data";

export interface CartItem {
  artwork: Artwork;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  total: number;
  addItem: (artwork: Artwork) => void;
  removeItem: (artworkId: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((artwork: Artwork) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.artwork.id === artwork.id);
      if (exists) return prev; // Art is unique — no duplicates
      return [...prev, { artwork, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((artworkId: number) => {
    setItems((prev) => prev.filter((item) => item.artwork.id !== artworkId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((p) => !p), []);

  const itemCount = items.length;
  const total = items.reduce((sum, item) => sum + item.artwork.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        itemCount,
        total,
        addItem,
        removeItem,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
