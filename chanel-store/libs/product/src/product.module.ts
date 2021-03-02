// Standard library
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Internal
import { ProductController } from './product.controller';
import {
  ProductService,
  CategoryService,
  DiscountService,
  OrderService,
  OrderItemService,
  ProductSkuService,
  VariantService,
  VariantValueService,
  SkuValueService,
  CustomerFeedbackService,
  MediaService,
  WishlistService,
  CartItemService,
} from './product.service';
import {
  Category,
  Product,
  Discount,
  Order,
  OrderItem,
  ProductSku,
  Variant,
  VariantValue,
  SkuValue,
  CustomerFeedback,
  Media,
  Wishlist,
  CartItem,
} from './product.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Product,
      Discount,
      Order,
      OrderItem,
      ProductSku,
      Variant,
      VariantValue,
      SkuValue,
      CustomerFeedback,
      Media,
      Wishlist,
      CartItem,
    ]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    CategoryService,
    DiscountService,
    OrderService,
    OrderItemService,
    ProductSkuService,
    VariantService,
    VariantValueService,
    SkuValueService,
    CustomerFeedbackService,
    MediaService,
    WishlistService,
    CartItemService,
  ],
  exports: [
    ProductService,
    CategoryService,
    DiscountService,
    OrderService,
    OrderItemService,
    ProductSkuService,
    VariantService,
    VariantValueService,
    SkuValueService,
    CustomerFeedbackService,
    MediaService,
    WishlistService,
    CartItemService,
  ],
})
export class ProductModule {}
