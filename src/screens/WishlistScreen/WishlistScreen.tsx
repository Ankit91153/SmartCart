import React, { useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Product } from '../../types/product';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';
import { styles } from './WishlistScreen.style';
import { colors } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconNames } from '../../constants/iconsName';
const Icon = Ionicons as any;
type WishlistNavProp = NativeStackNavigationProp<RootStackParamList>;

export const WishlistScreen = () => {
  const navigation = useNavigation<WishlistNavProp>();

  const wishlist = useWishlistStore(state => state.wishlist);
  const toggleWishlist = useWishlistStore(state => state.toggleWishlist);
  const addToCart = useCartStore(state => state.addToCart);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetails', {
        productId: product.id,
        title: product.title,
      });
    },
    [navigation],
  );

  const handleMoveToCart = useCallback(
    (product: Product) => {
      addToCart(product, 1);
      toggleWishlist(product);
    },
    [addToCart, toggleWishlist],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.card}
          onPress={() => handleProductPress(item)}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.image}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.removeBtn}
              activeOpacity={0.7}
              onPress={() => toggleWishlist(item)}
            >
              <Icon name={IconNames.Heart} size={20} color={colors.error} />
            </TouchableOpacity>
          </View>

          {/* Details */}
          <View style={styles.content}>
            <View>
              {item.brand ? (
                <Text style={styles.brand} numberOfLines={1}>
                  {item.brand}
                </Text>
              ) : null}

              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>

              <View style={styles.priceRow}>
                <Text style={styles.currentPrice}>
                  ${item.price.toFixed(2)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.moveToCartBtn}
              activeOpacity={0.8}
              onPress={() => handleMoveToCart(item)}
            >
              <Text style={styles.moveToCartText}>Move to Cart</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    },
    [handleProductPress, toggleWishlist, handleMoveToCart],
  );

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  if (wishlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name={IconNames.Heart} size={40} color={colors.primary} />
        <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
