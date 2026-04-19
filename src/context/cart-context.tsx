"use client";

import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "@/sanity/lib/queries";

export type CartLine = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  addItem: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeLine: (productId: string) => void;
  clear: () => void;
  totalQuantity: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "tienda-nba-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartLine[];
      if (!Array.isArray(parsed)) return;
      const safeLines = parsed.filter(
        (line) =>
          line &&
          typeof line === "object" &&
          line.product &&
          typeof line.product._id === "string" &&
          typeof line.quantity === "number" &&
          Number.isInteger(line.quantity) &&
          line.quantity > 0
      );
      setLines(safeLines);
    } catch {
      // Si el storage está corrupto, ignoramos y seguimos con carrito vacío.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Ignora error si el navegador bloquea storage.
    }
  }, [lines]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    if (!product.inStock) return;
    const safeQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
    setLines((prev) => {
      const i = prev.findIndex((l) => l.product._id === product._id);
      if (i === -1) {
        return [...prev, { product, quantity: safeQuantity }];
      }
      const next = [...prev];
      next[i] = {
        ...next[i],
        quantity: next[i].quantity + safeQuantity,
      };
      return next;
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setLines((prev) => prev.filter((l) => l.product._id !== productId));
      return;
    }
    setLines((prev) =>
      prev.map((l) =>
        l.product._id === productId ? { ...l, quantity } : l
      )
    );
  }, []);

  const removeLine = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.product._id !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = lines.reduce((a, l) => a + l.quantity, 0);
    const subtotal = lines.reduce(
      (a, l) => a + l.product.price * l.quantity,
      0
    );
    return {
      lines,
      addItem,
      setQuantity,
      removeLine,
      clear,
      totalQuantity,
      subtotal,
    };
  }, [lines, addItem, setQuantity, removeLine, clear]);

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}
