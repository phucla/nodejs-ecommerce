// External module
import { Store } from '@chanel-store/store';
import { User, ShippingAddress } from '@chanel-store/shared';

// Internal module
import {
  Category,
  Product,
  Discount,
  Order,
  ProductSku,
  Variant,
  VariantValue,
  Cart,
} from '../product.entity';
import {
  ProductType,
  DiscountType,
  OrderStatus,
  ProductRating,
  MediaType,
} from '../enums';

export interface ICategory {
  name: string;
  description: string;
  store: Store;
  parent?: Category;
  is_published?: boolean;
}

export interface IProduct {
  name: string;
  description: string;
  product_type: ProductType;
  store: Store;
  category: Category;
  is_published?: boolean;
}

export interface IDiscount {
  code: string;
  is_percent: boolean;
  value: number;
  type: DiscountType;
  start_at: Date;
  expire_at: Date;
  max_uses: number;
  description: string;
  target: User | Product;
}

export interface IOrder {
  customer: User;
  total_price: number;
  shipping_address: ShippingAddress;
  status: OrderStatus;
}

export interface IProductSku {
  product: Product;
  price: number;
  quantity: number;
  sku: string;
  cost_price: number;
  retail_price: number;
}

export interface IOrderItem {
  product_sku: ProductSku;
  order: Order;
  quantity: number;
  discount: Discount;
  discount_price: number;
}

export interface IVariant {
  product: Product;
  name: string;
}

export interface IVariantValue {
  variant: Variant;
  name: string;
}

export interface ISkuValue {
  variant_value: VariantValue;
  variant: Variant;
  product: Product;
  sku: ProductSku;
}

export interface ICustomerFeedback {
  user: User;
  product: Product;
  content: string;
  star: ProductRating;
}

export interface IMedia {
  url: string;
  type: MediaType;
  title: string;
  description: string;
  position: number;
  thumb: string;
  product: Product;
}

export interface IWishlist {
  customer: User;
  product: Product;
}

export interface ICart {
  customer: User;
}

export interface ICartItem {
  cart: Cart;
  product: Product;
  quantity: number;
}
