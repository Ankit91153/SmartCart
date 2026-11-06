# SmartCart — Mobile App

A clean, production-ready React Native SmartCart application built as part of the technical evaluation. The app integrates with the DummyJSON API and implements offline caching, cart persistence, debounced search, performance optimizations, and abandoned-cart notifications.

---

## Tech Stack & Libraries

- **Framework:** React Native (0.88+) with TypeScript
- **Navigation:** React Navigation (Native Stack + Bottom Tabs)
- **State Management:** Zustand (with AsyncStorage persistence)
- **Networking:** Axios with custom response/error interceptor
- **Icons:** React Native Vector Icons (Ionicons)
- **Testing:** Jest

---

## Architectural Decisions

### 1. State Management: Why Zustand over Redux Toolkit?

For this application, I chose **Zustand** instead of Redux Toolkit for the following reasons:

1. **Lightweight & Zero Boilerplate:** Redux Toolkit requires writing slices, dispatch actions, reducers, and wrapping components with providers. Zustand needs zero context providers at the root and handles state updates with simple set/get functions.
2. **Selective Component Re-renders:** Zustand uses selector hooks (e.g., `useCartStore(state => state.items)`). A component only re-renders when the exact slice of data it is listening to changes, reducing unnecessary renders on flat lists.
3. **Built-in Middleware Persistence:** Zustand comes with `persist` middleware out of the box, allowing cart and order states to sync with `AsyncStorage` effortlessly without complex configuration like redux-persist.
4. **Bundle Size:** Zustand is under 2KB minified, making the app faster to initialize.

### 2. Offline First & Caching Strategy

The app supports viewing and interacting with products even without an active internet connection:
- **API First:** On network availability, fresh products and category lists are fetched and automatically cached into `AsyncStorage`.
- **Offline Fallback:** If the network request fails (or in airplane mode), the app switches to offline mode:
  - Previously cached products and categories are restored into the UI.
  - A subtle offline banner informs the user that cached data is being displayed.
  - **Client-side Filtering & Sorting:** When offline, search queries, category filters, and price/rating sorting are handled locally using optimized JavaScript array methods (`.filter()` and `.sort()`).

### 3. Abandoned Cart Notifications

- When an item is added to the cart, a scheduled reminder timer is initiated.
- If the cart remains idle and un-purchased, a notification alert reminds the user about their pending items.
- If the user clears the cart or proceeds through checkout, the pending reminder is immediately cancelled to prevent spamming.

---

## Project Structure

```
SmartCart/
├── __tests__/                  # Unit tests (Cart)
├── android/                    # Android native configuration
├── ios/                        # iOS native configuration
└── src/
    ├── api/                    # Axios client & DummyJSON API endpoints
    ├── components/             # Reusable UI components (ProductCard, etc.)
    ├── navigation/             # Root Stack & Bottom Tab navigators
    ├── screens/
    │   ├── ProductScreen/      # Product listing, search, categories, sorting
    │   ├── ProductDetailsScreen/# Image gallery, stock, reviews, similar items
    │   ├── CartScreen/         # Cart item controls, price summary, checkout CTA
    │   ├── CheckoutScreen/     # Simulated address, payment, order summary
    │   ├── OrderConfirmationScreen/ # Order success screen
    │   ├── OrdersScreen/       # Purchase history with order statuses
    │   └── WishlistScreen/     # Wishlist grid with move-to-cart
    ├── store/                  # Zustand stores (useCartStore, useWishlistStore, useOrderStore)
    ├── theme/                  # Color palette and spacing constants
    ├── types/                  # TypeScript interfaces (Product, Cart, Order, Nav)
    └── utils/                  # Currency formatting, Notification manager
```

---

## Setup & Running Locally

### Prerequisites
- Node.js >= 18
- JDK 17
- Android Studio & Android SDK setup with emulator or physical device

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Ankit91153/SmartCart.git
cd SmartCart
npm install
```

### 2. Start Metro Bundler
```bash
npm start
```

### 3. Run on Android
In a separate terminal:
```bash
npx react-native run-android
```

---

## Running Unit Tests

The test suite covers cart calculations, quantities, discounts, and search logic:

```bash
npm test
```

To run a specific test file:
```bash
npm test cart.test.ts
```
