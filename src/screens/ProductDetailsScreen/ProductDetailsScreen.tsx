import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Product } from '../../types/product';
import { productService } from '../../api/productService';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { styles } from './ProductDetailsScreen.style';
import { colors } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconNames } from '../../constants/iconsName';
const Icon = Ionicons as any;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DetailRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;
type DetailNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductDetails'
>;

const getStockStyle = (status: string) => {
  const s = status?.toLowerCase() ?? '';
  if (s.includes('low'))
    return { badge: styles.stockLow, text: styles.stockTextLow };
  if (s.includes('out'))
    return { badge: styles.stockOut, text: styles.stockTextOut };
  return { badge: styles.stockInStock, text: styles.stockTextIn };
};

const formatReviewDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const ProductDetailsScreen = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<DetailNavProp>();
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  const cartItem = useCartStore(state =>
    state.items.find(item => item.product.id === productId),
  );
  const addToCart = useCartStore(state => state.addToCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);

  const isInWishlist = useWishlistStore(state => state.isInWishlist(productId));
  const toggleWishlist = useWishlistStore(state => state.toggleWishlist);

  const currentCartQty = cartItem?.quantity || 0;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await productService.getProductById(productId);
      setProduct(data);

      const catData = await productService.getProductsByCategory(
        data.category,
        10,
        0,
      );
      setSimilar(catData.products.filter(p => p.id !== productId));
    } catch (err: any) {
      setError(err?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleImageScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      setActiveImg(index);
    },
    [],
  );

  const handleSimilarPress = useCallback(
    (p: Product) => {
      navigation.push('ProductDetails', { productId: p.id, title: p.title });
    },
    [navigation],
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {' '}
          <Icon
            name={IconNames.WarningOutline}
            size={18}
            color={colors.primary}
          />{' '}
          {error || 'Product not found'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const stockStyle = getStockStyle(product.availabilityStatus);
  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleImageScroll}
          scrollEventThrottle={16}
        >
          {images.map((uri, idx) => (
            <Image
              key={idx}
              source={{ uri }}
              style={styles.imageSlide}
              resizeMode="contain"
            />
          ))}
        </ScrollView>

        {images.length > 1 && (
          <View style={styles.paginationContainer}>
            {images.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === activeImg ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        )}

        <View style={styles.infoContainer}>
          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{product.category}</Text>
            </View>
            {product.tags?.slice(0, 2).map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {product.brand ? (
            <Text style={styles.brand}>{product.brand}</Text>
          ) : null}

          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.ratingRow}>
            <Icon name={IconNames.Star} size={14} color={colors.secondary} />
            <Text style={{ color: colors.secondary, fontSize: 14 }}>
              {product.rating.toFixed(1)}
            </Text>
            <Text style={styles.reviewCount}>
              ({product.reviews?.length ?? 0} reviews)
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>
              $ {product.price.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.stockBadge, stockStyle.badge]}>
            <Text style={[styles.stockText, stockStyle.text]}>
              {product.availabilityStatus}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.infoGrid}>
            {product.warrantyInformation ? (
              <View style={styles.infoCard}>
                <Icon
                  name={IconNames.Shield}
                  size={14}
                  color={colors.secondary}
                />
                <Text style={styles.infoCardLabel}>Warranty</Text>
                <Text style={styles.infoCardValue}>
                  {product.warrantyInformation}
                </Text>
              </View>
            ) : null}
            {product.shippingInformation ? (
              <View style={styles.infoCard}>
                <Icon
                  name={IconNames.CubeOutline}
                  size={14}
                  color={colors.secondary}
                />
                <Text style={styles.infoCardLabel}>Shipping</Text>
                <Text style={styles.infoCardValue}>
                  {product.shippingInformation}
                </Text>
              </View>
            ) : null}
          </View>

          {product.reviews?.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>
                Customer Reviews ({product.reviews.length})
              </Text>
              {product.reviews.map((review, idx) => (
                <View key={idx} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>
                      {review.reviewerName}
                    </Text>
                    <Text style={styles.reviewDate}>
                      {formatReviewDate(review.date)}
                    </Text>
                  </View>
                  <View style={styles.reviewStars}>
                    {Array.from({ length: 5 }, (_, index) => {
                      const rating = review.rating;

                      let iconName = IconNames.StarOutline;

                      if (index + 1 <= rating) {
                        iconName = IconNames.Star;
                      } else if (index < rating) {
                        iconName = IconNames.StarHalf;
                      }

                      return (
                        <Icon
                          key={index}
                          name={iconName}
                          size={14}
                          color={colors.secondary}
                        />
                      );
                    })}
                    <Text style={styles.reviewComment}>
                      {' ' + review.rating}
                    </Text>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {similar.length > 0 && (
          <View style={styles.similarContainer}>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Similar Products</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.similarScroll}
            >
              {similar.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.similarCard}
                  activeOpacity={0.85}
                  onPress={() => handleSimilarPress(p)}
                >
                  <Image
                    source={{ uri: p.thumbnail }}
                    style={styles.similarImage}
                    resizeMode="contain"
                  />
                  <View style={styles.similarInfo}>
                    <Text style={styles.similarTitle} numberOfLines={2}>
                      {p.title}
                    </Text>
                    <Text style={styles.similarPrice}>
                      {p.price.toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.wishlistFab}
        onPress={() => toggleWishlist(product)}
        activeOpacity={0.8}
      >
        {isInWishlist ? (
          <Icon name={IconNames.Heart} size={20} color={colors.error} />
        ) : (
          <Icon name={IconNames.HeartOutline} size={20} />
        )}
      </TouchableOpacity>
      <View style={styles.bottomBar}>
        {currentCartQty === 0 ? (
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => addToCart(product, 1)}
            activeOpacity={0.85}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.bottomStepper}>
            <TouchableOpacity
              style={styles.bottomStepperBtn}
              onPress={() => updateQuantity(product.id, currentCartQty - 1)}
              activeOpacity={0.7}
            >
              <Icon name={IconNames.Remove} size={14} color={colors.primary} />
            </TouchableOpacity>

            <Text style={styles.bottomStepperText}>
              In Cart: {currentCartQty}
            </Text>

            <TouchableOpacity
              style={styles.bottomStepperBtn}
              onPress={() => updateQuantity(product.id, currentCartQty + 1)}
              activeOpacity={0.7}
            >
              <Icon name={IconNames.Add} size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
