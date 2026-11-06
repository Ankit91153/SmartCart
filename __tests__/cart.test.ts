import { useCartStore } from '../src/store/useCartStore';
import { Product } from '../src/types/product';

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
}));

const mockProductA: Product = {
    id: 1,
    title: 'iPhone 15',
    description: 'Latest Apple iPhone',
    category: 'smartphones',
    price: 1000,
    discountPercentage: 10,
    rating: 4.8,
    stock: 20,
    tags: ['phone', 'apple'],
    sku: 'IPHONE15',
    availabilityStatus: 'In Stock',
    reviews: [],
    thumbnail: 'https://example.com/iphone.jpg',
    images: [],
};

const mockProductB: Product = {
    id: 2,
    title: 'AirPods Pro',
    description: 'Wireless earbuds',
    category: 'audio',
    price: 200,
    discountPercentage: 0,
    rating: 4.5,
    stock: 15,
    tags: ['audio', 'apple'],
    sku: 'AIRPODS',
    availabilityStatus: 'In Stock',
    reviews: [],
    thumbnail: 'https://example.com/airpods.jpg',
    images: [],
};

describe('Cart Store Calculations & Logic', () => {
    beforeEach(() => {
        useCartStore.getState().clearCart();
    });

    test('1. Add to cart should add items and calculate correct total quantity', () => {
        const store = useCartStore.getState();

        store.addToCart(mockProductA, 2);
        store.addToCart(mockProductB, 1);

        expect(useCartStore.getState().items.length).toBe(2);
        expect(useCartStore.getState().getTotalItems()).toBe(3);
    });

    test('2. Subtotal should be sum of (price * quantity) without discount', () => {
        const store = useCartStore.getState();

        store.addToCart(mockProductA, 2);
        store.addToCart(mockProductB, 3);

        expect(useCartStore.getState().getSubtotal()).toBe(2600);
    });

    test('3. Discount calculation should accurately calculate total savings', () => {
        const store = useCartStore.getState();

        store.addToCart(mockProductA, 2);
        store.addToCart(mockProductB, 1);

        expect(useCartStore.getState().getTotalDiscount()).toBe(200);
    });

    test('4. Clear cart should empty all items and reset totals to 0', () => {
        const store = useCartStore.getState();

        store.addToCart(mockProductA, 5);
        store.clearCart();

        expect(useCartStore.getState().items.length).toBe(0);
        expect(useCartStore.getState().getFinalTotal()).toBe(0);
    });
});