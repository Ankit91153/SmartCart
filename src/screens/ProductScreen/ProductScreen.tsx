import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Product } from '../../types/product';
import { productService } from '../../api/productService';
import { styles } from './ProductScreen.style';
import { colors } from '../../theme';
import { ProductCard } from '../../components/product/ProductCard';
type HomeScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'MainTabs'
>;

const PAGE_SIZE = 10;

export const ProductScreen = () => {
  const navigation = useNavigation<HomeScreenNavProp>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // first time
  const loadInitialProducts = useCallback(async () => {
    try {
      setError(null);
      const data = await productService.getProducts(PAGE_SIZE, 0);
      setProducts(data.products);
      setHasMore(products.length + data.products.length < data.total);
    } catch (err: any) {
      setError(err?.message || 'Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadInitialProducts();
  }, [loadInitialProducts]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadInitialProducts();
  }, [loadInitialProducts]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;

    try {
      setLoadingMore(true);
      const nextSkip = products.length;
      const data = await productService.getProducts(PAGE_SIZE, nextSkip);

      setProducts(prev => [...prev, ...data.products]);
      setHasMore(products.length + data.products.length < data.total);
    } catch (err: any) {
      console.warn('Pagination error:', err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, loading, products.length]);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetails', {
        productId: product.id,
        title: product.title,
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={() => handleProductPress(item)} />
    ),
    [handleProductPress],
  );

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [loadingMore]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadInitialProducts}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};
