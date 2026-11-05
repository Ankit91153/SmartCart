import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { BottomTabNavigator } from './BottomTabNavigator';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen/ProductDetailsScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen/CheckoutScreen';
import { OrderConfirmationScreen } from '../screens/OrderConfirmationScreen/OrderConfirmationScreen';
import { SCREEN_NAMES } from '../constants/screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={SCREEN_NAMES.MainTabs}
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.ProductDetails}
          component={ProductDetailsScreen}
          options={({ route }) => ({
            title: route.params.title || SCREEN_NAMES.Details,
          })}
        />
        <Stack.Screen
          name={SCREEN_NAMES.Checkout}
          component={CheckoutScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.OrderConfirmation}
          component={OrderConfirmationScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
