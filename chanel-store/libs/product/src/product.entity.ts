// Standard library
import { Entity, Column, OneToOne, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// External module
import { CsCrudEntity, CsCrudPublishedEntity } from '@chanel-store/core';
import { Store, ShippingAddress } from '@chanel-store/store';
import { User } from '@chanel-store/auth';

// Internal
import { DiscountType } from './enums/discount-type.enum';
import { ProductType } from './enums/product-type.enum';
import { OrderStatus } from './enums/order-status.enum';
import { ProductRating } from './enums/rating.enum';
import { MediaType } from './enums/media-type.enum';

/**
 * Define the Category entity
 */
@Entity('Category')
export class Category extends CsCrudPublishedEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ManyToOne(() => Store, (store) => store.id)
  @Column()
  store_id: Store;

  @OneToOne(() => Category, (category) => category.id)
  @Column()
  parent_id: Category;
}

/**
 * Define the Product entity
 */
@Entity('Product')
export class Product extends CsCrudPublishedEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ManyToOne(() => Media, (media) => media.id)
  @Column()
  media_id: Media;

  @ApiProperty({ enum: Object.values(ProductType) })
  @Column('varchar')
  product_type: ProductType;

  @ManyToOne(() => Store, (store) => store.id)
  @Column()
  store_id: Store;

  @ManyToOne(() => Category, (categpry) => categpry.id)
  @Column()
  category_id: Category;
}

/**
 * Define the Discount entity
 */
@Entity('Discount')
export class Discount extends CsCrudPublishedEntity {
  @ApiProperty()
  @Column()
  code: string;

  @ApiProperty()
  @Column()
  is_percent: boolean;

  @ApiProperty()
  @Column()
  value: number;

  @ApiProperty({ enum: Object.values(DiscountType) })
  @Column('varchar')
  type: DiscountType;

  @ApiProperty()
  @Column()
  start_at: Date;

  @ApiProperty()
  @Column()
  expire_at: Date;

  @ApiProperty()
  @Column()
  max_uses: number;

  @ApiProperty()
  @Column()
  description: string;

  @ManyToOne(() => User || Product, (target) => target.id)
  @Column()
  target_id: User | Product;
}

/**
 * Define the Discount entity
 */
@Entity('Order')
export class Order extends CsCrudEntity {
  @ManyToOne(() => User, (user) => user.id)
  @Column()
  customer_id: User;

  @ApiProperty()
  @Column()
  total_price: number;

  @OneToOne(() => ShippingAddress, (address) => address.id)
  @Column()
  shipping_address_id: ShippingAddress;

  @ApiProperty({ enum: Object.values(OrderStatus) })
  @Column('varchar')
  status: OrderStatus;
}

/**
 * Define the OrderItem entity
 */
@Entity('OrderItem')
export class OrderItem extends CsCrudEntity {
  @ManyToOne(() => ProductSku, (productSku) => productSku.id)
  @Column()
  product_sku_id: ProductSku;

  @ManyToOne(() => Order, (order) => order.id)
  @Column()
  order_id: Order;

  @ApiProperty()
  @Column()
  quantity: number;

  @ManyToOne(() => Discount, (discount) => discount.id)
  @Column()
  discount_id: Discount;

  @ApiProperty()
  @Column()
  discount_price: number;
}

/**
 * Define the ProductSku entity
 */
@Entity('ProductSku')
export class ProductSku extends CsCrudEntity {
  @ManyToOne(() => Product, (product) => product.id)
  @Column()
  product_id: Product;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty()
  @Column()
  quantity: number;

  @ApiProperty()
  @Column()
  sku: string;

  @ApiProperty()
  @Column()
  cost_price: number;

  @ApiProperty()
  @Column()
  retail_price: number;
}

/**
 * Define the Variant entity
 */
@Entity('Variant')
export class Variant extends CsCrudEntity {
  @ManyToOne(() => Product, (product) => product.id)
  @Column()
  product_id: Product;

  @ApiProperty()
  @Column()
  name: string;
}

/**
 * Define the VariantValue entity
 */
@Entity('VariantValue')
export class VariantValue extends CsCrudEntity {
  @ManyToOne(() => Variant, (variant) => variant.id)
  @Column()
  variant_id: Variant;

  @ApiProperty()
  @Column()
  name: string;
}

/**
 * Define the SkuValue entity
 */
@Entity('SkuValue')
export class SkuValue extends CsCrudEntity {
  @ManyToOne(() => VariantValue, (variantValue) => variantValue.id)
  @Column()
  variant_value_id: VariantValue;

  @ManyToOne(() => Variant, (variant) => variant.id)
  @Column()
  variant_id: Variant;

  @ManyToOne(() => Product, (product) => product.id)
  @Column()
  product_id: Product;

  @ManyToOne(() => ProductSku, (productSku) => productSku.id)
  @Column()
  sku_id: ProductSku;
}

/**
 * Define the CustomerFeedback entity
 */
@Entity('CustomerFeedback')
export class CustomerFeedback extends CsCrudEntity {
  @ManyToOne(() => User, (user) => user.id)
  @Column()
  user_id: User;

  @ManyToOne(() => Product, (product) => product.id)
  @Column()
  product_id: Product;

  @ApiProperty()
  @Column()
  content: string;

  @ApiProperty({ enum: Object.values(ProductRating) })
  @Column()
  star: ProductRating;
}

/**
 * Define the Media entity
 */
@Entity('Media')
export class Media extends CsCrudEntity {
  @ApiProperty()
  @Column()
  url: string;

  @ApiProperty({ enum: Object.values(MediaType) })
  @Column()
  type: MediaType;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  position: number;

  @ApiProperty()
  @Column()
  thumb: string;
}

/**
 * Define the Wishlist entity
 */
@Entity('Wishlist')
export class Wishlist extends CsCrudEntity {
  @OneToOne(() => User, (user) => user.id)
  @Column()
  customer_id: User;

  @ManyToOne(() => Product, (product) => product.id)
  @Column()
  product_id: Product;
}

/**
 * Define the Cart entity
 */
@Entity('Cart')
export class Cart extends CsCrudEntity {
  @OneToOne(() => User, (user) => user.id)
  @Column()
  customer_id: User;
}

/**
 * Define the CartItem entity
 */
@Entity('CartItem')
export class CartItem extends CsCrudEntity {
  @ManyToOne(() => Cart, (cart) => cart.id)
  @Column()
  cart_id: Cart;

  @ManyToOne(() => Product, (product) => product.id)
  @Column()
  product_id: Product;

  @ApiProperty()
  @Column()
  quantity: number;
}
