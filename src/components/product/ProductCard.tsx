import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Product } from '../../types/product';
import { styles } from './ProductCard.styles';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';

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
  const addToCart = useCartStore(state => state.addToCart);

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} />

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
          <Text style={{ fontSize: 16 }}>{isInWishlist ? '❤️' : '🤍'}</Text>
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
          <Text style={{ fontSize: 12 }}>⭐</Text>
          <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.currentPrice}>${product.price.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => addToCart(product)}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export const ProductCard = memo(ProductCardComponent);
