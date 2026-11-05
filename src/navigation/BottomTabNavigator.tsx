import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../types/navigation';
import { ProductScreen } from '../screens/ProductScreen/ProductScreen';
import { WishlistScreen } from '../screens/WishlistScreen/WishlistScreen';
import { CartScreen } from '../screens/CartScreen/CartScreen';
import { OrdersScreen } from '../screens/OrdersScreen/OrdersScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
      }}
    >
      <Tab.Screen name="Products" component={ProductScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
    </Tab.Navigator>
  );
};
