import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Product, CategoryItem } from '../../types/product';
import { productService } from '../../api/productService';
import { styles } from './ProductScreen.style';
import { colors } from '../../theme';
import { ProductCard } from '../../components/product/ProductCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconNames } from '../../constants/iconsName';
const Icon = Ionicons as any;

type HomeScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'MainTabs'
>;

const PAGE_SIZE = 10;
const CACHE_KEY = 'smartcart_cached_products';
const CATEGORIES_CACHE_KEY = 'smartcart_cached_categories';
const parseSortKey = (
  key: string | null,
): [string | undefined, 'asc' | 'desc' | undefined] => {
  if (key === 'price-asc') return ['price', 'asc'];
  if (key === 'price-desc') return ['price', 'desc'];
  if (key === 'rating') return ['rating', 'desc'];
  return [undefined, undefined];
};

const SORT_OPTIONS = [
  { label: 'Default', value: null },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
];

export const ProductScreen = () => {
  const navigation = useNavigation<HomeScreenNavProp>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [showSortModal, setShowSortModal] = useState(false);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveToCache = async (newProducts: Product[]) => {
    try {
      const existing = await AsyncStorage.getItem(CACHE_KEY);
      let combined = newProducts;
      if (existing) {
        const parsed: Product[] = JSON.parse(existing);
        const map = new Map<number, Product>();
        parsed.forEach(p => map.set(p.id, p));
        newProducts.forEach(p => map.set(p.id, p));
        combined = Array.from(map.values());
      }
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(combined));
    } catch (e) {
      console.warn('Failed to cache products', e);
    }
  };

  const getFromCache = async (): Promise<Product[]> => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  };
  const applyOfflineFilter = (
    cachedList: Product[],
    query: string,
    category: string | null,
    sort: string | null,
  ): Product[] => {
    let result = [...cachedList];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q),
      );
    }

    if (category) {
      result = result.filter(
        p => p.category.toLowerCase() === category.toLowerCase(),
      );
    }

    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  };

  const loadProducts = useCallback(
    async (query: string, category: string | null, sort: string | null) => {
      try {
        setLoading(true);
        setError(null);

        let data;
        if (query.trim()) {
          data = await productService.searchProducts(
            query.trim(),
            PAGE_SIZE,
            0,
          );
        } else if (category) {
          data = await productService.getProductsByCategory(
            category,
            PAGE_SIZE,
            0,
          );
        } else {
          const [sortBy, order] = parseSortKey(sort);
          data = await productService.getProducts(PAGE_SIZE, 0, sortBy, order);
        }

        setProducts(data.products);
        setHasMore(data.products.length < data.total);
        setIsOffline(false);

        saveToCache(data.products);
      } catch (err: any) {
        console.warn(
          'Network error, attempting offline cache fallback:',
          err?.message,
        );
        const cached = await getFromCache();
        if (cached.length > 0) {
          const offlineFiltered = applyOfflineFilter(
            cached,
            query,
            category,
            sort,
          );
          setProducts(offlineFiltered);
          setHasMore(false);
          setIsOffline(true);
        } else {
          setError(
            err?.message ||
              'Failed to load products and no offline cache available.',
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadProducts('', null, null);
  }, [loadProducts]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
        await AsyncStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn('Network failed for categories, checking cache...');
        const cached = await AsyncStorage.getItem(CATEGORIES_CACHE_KEY);
        if (cached) {
          setCategories(JSON.parse(cached));
        }
      }
    };
    loadCategories();
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts(searchQuery, activeCategory, sortKey);
  }, [loadProducts, searchQuery, activeCategory, sortKey]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading || isOffline) return;
    if (searchQuery.trim()) return;

    try {
      setLoadingMore(true);
      const nextSkip = products.length;
      const [sortBy, order] = parseSortKey(sortKey);

      let data;
      if (activeCategory) {
        data = await productService.getProductsByCategory(
          activeCategory,
          PAGE_SIZE,
          nextSkip,
        );
      } else {
        data = await productService.getProducts(
          PAGE_SIZE,
          nextSkip,
          sortBy,
          order,
        );
      }

      setProducts(prev => [...prev, ...data.products]);
      setHasMore(products.length + data.products.length < data.total);
      saveToCache(data.products);
    } catch (err: any) {
      console.warn('Pagination error:', err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [
    loadingMore,
    hasMore,
    loading,
    isOffline,
    searchQuery,
    products.length,
    activeCategory,
    sortKey,
  ]);

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => {
        loadProducts(text, activeCategory, sortKey);
      }, 400);
    },
    [loadProducts, activeCategory, sortKey],
  );

  const handleCategoryPress = useCallback(
    (slug: string | null) => {
      setActiveCategory(slug);
      setSearchQuery('');
      loadProducts('', slug, sortKey);
    },
    [loadProducts, sortKey],
  );

  const handleSortSelect = useCallback(
    (value: string | null) => {
      setSortKey(value);
      setShowSortModal(false);
      loadProducts(searchQuery, activeCategory, value);
    },
    [loadProducts, searchQuery, activeCategory],
  );

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

  const renderHeader = useCallback(
    () => (
      <View>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Icon
              name={IconNames.SearchOutline}
              size={18}
              color={colors.textMuted}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={handleSearchChange}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => handleSearchChange('')}
              >
                <Icon
                  name={IconNames.Close}
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.sortBtn, sortKey ? styles.sortBtnActive : null]}
            onPress={() => setShowSortModal(true)}
          >
            <Icon name={IconNames.Filter} size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          <TouchableOpacity
            style={[styles.chip, !activeCategory ? styles.chipActive : null]}
            onPress={() => handleCategoryPress(null)}
          >
            <Text
              style={[
                styles.chipText,
                !activeCategory ? styles.chipTextActive : null,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {categories.map(cat => (
            <TouchableOpacity
              key={cat.slug}
              style={[
                styles.chip,
                activeCategory === cat.slug ? styles.chipActive : null,
              ]}
              onPress={() => handleCategoryPress(cat.slug)}
            >
              <Text
                style={[
                  styles.chipText,
                  activeCategory === cat.slug ? styles.chipTextActive : null,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    ),
    [
      isOffline,
      searchQuery,
      sortKey,
      activeCategory,
      categories,
      handleSearchChange,
      handleCategoryPress,
    ],
  );

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
        <Text style={styles.errorText}>
          <Icon name={IconNames.Warning} size={18} color={colors.textMuted} />{' '}
          {error}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadProducts(searchQuery, activeCategory, sortKey)}
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
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() =>
          !loading ? (
            <View style={styles.emptyContainer}>
              <Icon
                name={IconNames.SearchOutline}
                size={18}
                color={colors.textMuted}
              />
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          ) : (
            <View />
          )
        }
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

      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Sort By</Text>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={String(opt.value)}
                style={styles.sortOption}
                onPress={() => handleSortSelect(opt.value)}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortKey === opt.value ? styles.sortOptionActive : null,
                  ]}
                >
                  {opt.label}
                </Text>
                {sortKey === opt.value && (
                  <Icon
                    name={IconNames.CheckmarkOutline}
                    size={18}
                    color={colors.textMuted}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
