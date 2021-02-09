// Standard library
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Internal
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
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
  providers: [ProductService],
  exports: [],
})
export class ProductModule {}
