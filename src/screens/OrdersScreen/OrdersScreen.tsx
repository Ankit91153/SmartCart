import React, { useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useOrderStore } from '../../store/useOrderStore';
import { Order } from '../../types/product';
import { styles } from './OrdersScreen.style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme';
import { IconNames } from '../../constants/iconsName';
const Icon = Ionicons as any;
type OrdersNavProp = NativeStackNavigationProp<RootStackParamList>;

export const OrdersScreen = () => {
  const navigation = useNavigation<OrdersNavProp>();
  const orders = useOrderStore(state => state.orders);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const renderOrderItem = useCallback(
    ({ item }: { item: Order }) => (
      <View style={styles.orderCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderIdText}>{item.orderId}</Text>
            <Text style={styles.dateText}>{formatDate(item.placedAt)}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.itemsPreviewContainer}>
          {item.items.map(orderItem => (
            <View key={orderItem.productId} style={styles.itemRow}>
              <Image
                source={{ uri: orderItem.thumbnail }}
                style={styles.itemThumb}
              />
              <View style={styles.itemMeta}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {orderItem.title}
                </Text>
                <Text style={styles.itemQtyPrice}>
                  Qty: {orderItem.quantity} • ${orderItem.price.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <Text style={styles.footerLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>${item.total.toFixed(2)}</Text>
        </View>
      </View>
    ),
    [],
  );

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name={IconNames.Cube} size={40} color={colors.primary} />
        <Text style={styles.emptyTitle}>No Orders Yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={item => item.orderId}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
