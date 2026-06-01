'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItem {
  bookId: string;
  title: string;
  author: string;
  mrp: number; // paise
  quantity: number;
  coverImageUrl: string | null;
  bookType: 'PAPERBACK' | 'EBOOK';
  genre: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (bookId: string, bookType: string) => void;
  updateQuantity: (bookId: string, bookType: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.bookId === item.bookId && i.bookType === item.bookType,
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.bookId === item.bookId && i.bookType === item.bookType
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }

          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (bookId, bookType) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.bookId === bookId && i.bookType === bookType),
          ),
        }));
      },

      updateQuantity: (bookId, bookType, quantity) => {
        if (quantity < 1) {
          get().removeItem(bookId, bookType);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.bookId === bookId && i.bookType === bookType
              ? { ...i, quantity }
              : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'bookleaf-cart',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
    },
  ),
);
