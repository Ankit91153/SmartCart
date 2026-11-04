import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem } from '../types/product';

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotalDiscount: () => number;
  getFinalTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product: Product, quantity: number = 1) => {
        set(state => {
          const existingIndex = state.items.findIndex(
            item => item.product.id === product.id,
          );
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeFromCart: (productId: number) => {
        set(state => ({
          items: state.items.filter(item => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set(state => ({
          items: state.items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0,
        );
      },

      getTotalDiscount: () => {
        return get().items.reduce((acc, item) => {
          const discount =
            (item.product.price * (item.product.discountPercentage || 0)) / 100;
          return acc + discount * item.quantity;
        }, 0);
      },

      getFinalTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getTotalDiscount();
        return Math.max(0, subtotal - discount);
      },
    }),
    {
      name: 'smartcart-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
