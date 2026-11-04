import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/product';

interface WishlistState {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],

      toggleWishlist: (product: Product) => {
        set(state => {
          const exists = state.wishlist.some(item => item.id === product.id);
          if (exists) {
            return {
              wishlist: state.wishlist.filter(item => item.id !== product.id),
            };
          }
          return { wishlist: [...state.wishlist, product] };
        });
      },

      isInWishlist: (productId: number) => {
        return get().wishlist.some(item => item.id === productId);
      },

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: 'smartcart-wishlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
