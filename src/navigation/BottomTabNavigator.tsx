import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../types/navigation';
import { ProductScreen } from '../screens/ProductScreen/ProductScreen';
import { WishlistScreen } from '../screens/WishlistScreen/WishlistScreen';
import { CartScreen } from '../screens/CartScreen/CartScreen';
import { OrdersScreen } from '../screens/OrdersScreen/OrdersScreen';
import { colors } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { SCREEN_NAMES } from '../constants/screen';
import { IconNames } from '../constants/iconsName';
const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator = () => {
  const totalCartItems = useCartStore(state => state.getTotalItems());
  const totalWishlistItems = useWishlistStore(state => state.wishlist.length);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name={SCREEN_NAMES.Products}
        component={ProductScreen}
        options={{
          title: 'Products',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name={focused ? IconNames.BigHandle : IconNames.BagHandleOutline}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.Wishlist}
        component={WishlistScreen}
        options={{
          title: 'Wishlist',
          tabBarBadge: totalWishlistItems > 0 ? totalWishlistItems : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.error,
            fontSize: 10,
            fontWeight: '700',
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name={focused ? IconNames.Heart : IconNames.HeartOutline}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.Cart}
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarBadge: totalCartItems > 0 ? totalCartItems : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            fontSize: 10,
            fontWeight: '700',
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name={focused ? IconNames.Cart : IconNames.CartOutline}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.Orders}
        component={OrdersScreen}
        options={{
          title: 'My Orders',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name={focused ? IconNames.Receipt : IconNames.ReceiptOutline}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
