export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetails: { productId: number; title: string };
  Checkout: undefined;
  OrderConfirmation: { orderId: string; totalAmount: number };
};

export type BottomTabParamList = {
  Products: undefined;
  Categories: undefined;
  Wishlist: undefined;
  Cart: undefined;
  Orders: undefined;
};
