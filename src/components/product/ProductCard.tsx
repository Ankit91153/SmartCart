import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Product } from '../../types/product';
import { styles } from './ProductCard.styles';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';
import { colors } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconNames } from '../../constants/iconsName';
const Icon = Ionicons as any;

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  onPress,
}) => {
  const isInWishlist = useWishlistStore(state =>
    state.isInWishlist(product.id),
  );
  const toggleWishlist = useWishlistStore(state => state.toggleWishlist);

  const cartItem = useCartStore(state =>
    state.items.find(item => item.product.id === product.id),
  );
  const addToCart = useCartStore(state => state.addToCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);

  const quantity = cartItem?.quantity || 0;

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="contain"
        />

        {product.discountPercentage > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(product.discountPercentage)}% OFF
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.wishlistButton}
          activeOpacity={0.7}
          onPress={() => toggleWishlist(product)}
        >
          <Text style={{ fontSize: 16 }}>
            {isInWishlist ? (
              <Icon name={IconNames.Heart} size={18} color={colors.error} />
            ) : (
              <Icon name={IconNames.HeartOutline} size={18} />
            )}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {product.brand ? (
          <Text style={styles.brand} numberOfLines={1}>
            {product.brand}
          </Text>
        ) : null}

        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.ratingRow}>
          <Icon name={IconNames.Star} size={12} color={colors.secondary} />
          <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.currentPrice}>${product.price.toFixed(2)}</Text>
        </View>

        {quantity === 0 ? (
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={() => addToCart(product, 1)}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.qtyButton}
              activeOpacity={0.7}
              onPress={() => updateQuantity(product.id, quantity - 1)}
            >
              <Icon
                name={IconNames.RemoveOutline}
                size={16}
                color={colors.primary}
              />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{quantity}</Text>

            <TouchableOpacity
              style={styles.qtyButton}
              activeOpacity={0.7}
              onPress={() => updateQuantity(product.id, quantity + 1)}
            >
              <Icon
                name={IconNames.AddOutline}
                size={16}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const ProductCard = memo(ProductCardComponent);
