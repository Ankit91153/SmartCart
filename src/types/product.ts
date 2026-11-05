export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoryItem {
  slug: string;
  name: string;
  url: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: number;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
  discountPercentage: number;
}
export interface Order {
  orderId: string;
  placedAt: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
}