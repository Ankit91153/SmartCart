import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { CartItem } from '../../types/product';
import { useCartStore } from '../../store/useCartStore';
import { styles } from './CartScreen.style';

type CartNavProp = NativeStackNavigationProp<RootStackParamList>;

export const CartScreen = () => {
  const navigation = useNavigation<CartNavProp>();

  const items = useCartStore(state => state.items);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const clearCart = useCartStore(state => state.clearCart);
  const getSubtotal = useCartStore(state => state.getSubtotal);
  const getTotalDiscount = useCartStore(state => state.getTotalDiscount);
  const getFinalTotal = useCartStore(state => state.getFinalTotal);

  const subtotal = getSubtotal();
  const discount = getTotalDiscount();
  const finalTotal = getFinalTotal();

  const handleClearCart = useCallback(() => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ],
    );
  }, [clearCart]);

  const handleItemPress = useCallback(
    (item: CartItem) => {
      navigation.navigate('ProductDetails', {
        productId: item.product.id,
        title: item.product.title,
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => {
      const { product, quantity } = item;

      return (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.itemCard}
          onPress={() => handleItemPress(item)}
        >
          <Image source={{ uri: product.thumbnail }} style={styles.itemImage} />

          <View style={styles.itemInfo}>
            <View>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {product.title}
              </Text>

              <View style={styles.priceRow}>
                <Text style={styles.itemPrice}>{product.price.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.qtyRow}>
              <View style={styles.qtyControl}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(product.id, quantity - 1)}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.qtyText}>{quantity}</Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(product.id, quantity + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removeFromCart(product.id)}
              >
                <Text style={styles.deleteBtnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [handleItemPress, updateQuantity, removeFromCart],
  );

  const keyExtractor = useCallback(
    (item: CartItem) => item.product.id.toString(),
    [],
  );
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Looks like you haven't added anything to your cart yet.
        </Text>
        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.shopBtnText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const renderFooter = () => (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Price Details</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>{subtotal.toFixed(2)}</Text>
      </View>

      {discount > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Discount Savings</Text>
          <Text style={[styles.summaryValue, styles.summaryDiscount]}>
            −{discount.toFixed(2)}
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Total Payable</Text>
        <Text style={styles.totalValue}>{finalTotal.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={styles.checkoutBtn}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Checkout')}
      >
        <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.clearRow}>
        <TouchableOpacity style={styles.clearBtn} onPress={handleClearCart}>
          <Text style={styles.clearBtnText}>Clear Cart</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};
