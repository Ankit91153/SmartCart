import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useCartStore } from '../../store/useCartStore';
import { useOrderStore } from '../../store/useOrderStore';
import { styles } from './CheckoutScreen.style';

type CheckoutNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'Checkout'
>;

export const CheckoutScreen = () => {
  const navigation = useNavigation<CheckoutNavProp>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useCartStore(state => state.items);
  const getSubtotal = useCartStore(state => state.getSubtotal);
  const getTotalDiscount = useCartStore(state => state.getTotalDiscount);
  const getFinalTotal = useCartStore(state => state.getFinalTotal);
  const clearCart = useCartStore(state => state.clearCart);

  const placeOrder = useOrderStore(state => state.placeOrder);

  console.log(placeOrder);

  const subtotal = getSubtotal();
  const discount = getTotalDiscount();
  const finalTotal = getFinalTotal();

  const handlePlaceOrder = useCallback(async () => {
    if (items.length === 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout<any>(resolve, 1200));
      const confirmedOrder = placeOrder(items, subtotal, discount, finalTotal);
      clearCart();
      navigation.replace('OrderConfirmation', {
        orderId: confirmedOrder.orderId,
        totalAmount: confirmedOrder.total,
      });
    } catch (error) {
      console.warn('Checkout failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    items,
    isSubmitting,
    subtotal,
    discount,
    finalTotal,
    placeOrder,
    clearCart,
    navigation,
  ]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressRow}>
            <Text style={styles.addressIcon}>📍</Text>
            <View style={styles.addressDetails}>
              <Text style={styles.addressName}>John Doe</Text>
              <Text style={styles.addressText}>
                Flat 402, Sunshine Towers, Silicon Valley, Bangalore - 560100
              </Text>
              <View style={styles.deliveryBadge}>
                <Text style={styles.deliveryBadgeText}>
                  ⚡ Free Express Delivery
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentIcon}>💵</Text>
            <Text style={styles.paymentText}>
              Cash on Delivery (Pre-selected)
            </Text>
            <Text style={styles.selectedBadge}>✅</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items ({items.length})</Text>
          {items.map(item => (
            <View key={item.product.id} style={styles.orderItem}>
              <Image
                source={{ uri: item.product.thumbnail }}
                style={styles.itemThumb}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.product.title}
                </Text>
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                {(item.product.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bill Details</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Items Total</Text>
            <Text style={styles.value}>{subtotal.toFixed(2)}</Text>
          </View>

          {discount > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Discount</Text>
              <Text style={[styles.value, styles.discountValue]}>
                −{discount.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Delivery Fee</Text>
            <Text style={[styles.value, styles.discountValue]}>FREE</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{finalTotal.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.placeOrderBtn,
            isSubmitting && styles.placeOrderBtnDisabled,
          ]}
          activeOpacity={0.85}
          disabled={isSubmitting}
          onPress={handlePlaceOrder}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.placeOrderText}>
              Place Order • {finalTotal.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
