export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  id?: string;
  title: string;
  slug?: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images?: string[];
  category: Category;
  subcategories?: SubCategory[];
  brand?: Brand;
  ratingsAverage: number;
  ratingsQuantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  review: string;
  rating: number;
  user: {
    _id: string;
    name: string;
  };
  product: string;
  createdAt: string;
}

export interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: Product;
}

export interface Cart {
  _id: string;
  cartOwner: string;
  products: CartItem[];
  totalCartPrice: number;
  totalAfterDiscount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}

export interface UserAddress {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface OrderItem {
  _id: string;
  count: number;
  price: number;
  product: Product;
}

export interface Order {
  _id: string;
  id?: number | string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  cartItems: OrderItem[];
  shippingAddress?: ShippingAddress;
  taxPrice?: number;
  shippingPrice?: number;
  totalOrderPrice: number;
  paymentMethodType: 'cash' | 'card';
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  createdAt: string;
}
