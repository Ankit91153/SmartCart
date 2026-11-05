import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderItem, CartItem } from '../types/product';

interface OrderState {
  orders: Order[];
  placeOrder: (
    cartItems: CartItem[],
    subtotal: number,
    discount: number,
    total: number,
  ) => Order;
  clearOrders: () => void;
}

const generateOrderId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      placeOrder: (cartItems, subtotal, discount, total) => {
        const items: OrderItem[] = cartItems.map(ci => ({
          productId: ci.product.id,
          title: ci.product.title,
          thumbnail: ci.product.thumbnail,
          price: ci.product.price,
          quantity: ci.quantity,
          discountPercentage: ci.product.discountPercentage,
        }));

        const newOrder: Order = {
          orderId: generateOrderId(),
          placedAt: new Date().toISOString(),
          items,
          subtotal,
          discount,
          total,
          status: 'confirmed',
        };

        set(state => ({ orders: [newOrder, ...state.orders] }));

        return newOrder;
      },

      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'smartcart-orders-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
