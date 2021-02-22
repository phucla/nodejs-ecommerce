// Standard library
import {
  Entity,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// External module
import { CsCrudEntity, CsCrudPublishedEntity } from '@chanel-store/core';
import { Store } from '@chanel-store/store';
import { User, ShippingAddress } from '@chanel-store/shared';

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
  @ApiProperty({
    type: String,
    example: 'Eyewear',
  })
  @Column()
  name: string;

  @ApiProperty({
    type: String,
    example: 'Eyewear category',
  })
  @Column()
  description: string;

  @ManyToOne(() => Store, (store) => store.categories)
  store: Store;

  @OneToOne(() => Category)
  @JoinColumn()
  parent: Category;
}

/**
 * Define the Product entity
 */
@Entity('Product')
export class Product extends CsCrudPublishedEntity {
  @ApiProperty({
    type: String,
    example: 'Eyewear',
  })
  @Column()
  name: string;

  @ApiProperty({
    type: String,
    example: 'Eyewear product',
  })
  @Column()
  description: string;

  @OneToMany(() => Media, (media) => media.id)
  media: Media[];

  @ApiProperty({
    enum: Object.values(ProductType),
    example: ProductType.Eyewear,
  })
  @Column('varchar')
  product_type: ProductType;

  @ManyToOne(() => Store, (store) => store.id)
  store: Store;

  @ManyToOne(() => Category, (categpry) => categpry.id)
  category: Category;
}

/**
 * Define the Discount entity
 */
@Entity('Discount')
export class Discount extends CsCrudPublishedEntity {
  @ApiProperty({
    type: String,
    example: 'DC001',
  })
  @Column()
  code: string;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  @Column()
  is_percent: boolean;

  @ApiProperty({
    type: Number,
    example: 50,
  })
  @Column()
  value: number;

  @ApiProperty({
    enum: Object.values(DiscountType),
    example: DiscountType.Customer,
  })
  @Column('varchar')
  type: DiscountType;

  @ApiProperty({
    type: Date,
    example: 'YYYY-MM-DDTHH:MM:SS.mmmZ',
  })
  @Column()
  start_at: Date;

  @ApiProperty({
    type: Date,
    example: 'YYYY-MM-DDTHH:MM:SS.mmmZ',
  })
  @Column()
  expire_at: Date;

  @ApiProperty({
    type: Number,
    example: 10,
  })
  @Column()
  max_uses: number;

  @ApiProperty({
    type: String,
    example: 'Product description',
  })
  @Column()
  description: string;

  @ManyToOne(() => User || Product, (target) => target.id)
  target: User | Product;
}

/**
 * Define the Discount entity
 */
@Entity('Order')
export class Order extends CsCrudEntity {
  @ManyToOne(() => User, (user) => user.id)
  customer: User;

  @ApiProperty({
    type: Number,
    example: 1000,
  })
  @Column()
  total_price: number;

  @OneToOne(() => ShippingAddress)
  @JoinColumn()
  shipping_address: ShippingAddress;

  @ApiProperty({
    enum: Object.values(OrderStatus),
    example: OrderStatus.Processing,
  })
  @Column('varchar')
  status: OrderStatus;
}

/**
 * Define the ProductSku entity
 */
@Entity('ProductSku')
export class ProductSku extends CsCrudEntity {
  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @ApiProperty({
    type: Number,
    example: 100,
  })
  @Column()
  price: number;

  @ApiProperty({
    type: Number,
    example: 100,
  })
  @Column()
  quantity: number;

  @ApiProperty({
    type: String,
    example: 'ABC1234',
  })
  @Column()
  sku: string;

  @ApiProperty({
    type: Number,
    example: 100,
  })
  @Column()
  cost_price: number;

  @ApiProperty({
    type: Number,
    example: 100,
  })
  @Column()
  retail_price: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product_sku, {
    cascade: true,
  })
  product_skus: OrderItem[];
}

/**
 * Define the OrderItem entity
 */
@Entity('OrderItem')
export class OrderItem extends CsCrudEntity {
  @ManyToOne(() => ProductSku, (productSku) => productSku.product_skus)
  product_sku: ProductSku;

  @ManyToOne(() => Order, (order) => order.id)
  order: Order;

  @ApiProperty({
    type: Number,
    example: 100,
  })
  @Column()
  quantity: number;

  @ManyToOne(() => Discount, (discount) => discount.id)
  discount: Discount;

  @ApiProperty({
    type: Number,
    example: 200,
  })
  @Column({
    nullable: true,
  })
  discount_price: number;
}

/**
 * Define the Variant entity
 */
@Entity('Variant')
export class Variant extends CsCrudEntity {
  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @ApiProperty({
    type: String,
    example: 'Color',
  })
  @Column()
  name: string;
}

/**
 * Define the VariantValue entity
 */
@Entity('VariantValue')
export class VariantValue extends CsCrudEntity {
  @ManyToOne(() => Variant, (variant) => variant.id)
  variant: Variant;

  @ApiProperty({
    type: String,
    example: 'Red',
  })
  @Column()
  name: string;
}

/**
 * Define the SkuValue entity
 */
@Entity('SkuValue')
export class SkuValue extends CsCrudEntity {
  @ManyToOne(() => VariantValue, (variantValue) => variantValue.id)
  variant_value: VariantValue;

  @ManyToOne(() => Variant, (variant) => variant.id)
  variant: Variant;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @ManyToOne(() => ProductSku, (productSku) => productSku.id)
  sku: ProductSku;
}

/**
 * Define the CustomerFeedback entity
 */
@Entity('CustomerFeedback')
export class CustomerFeedback extends CsCrudEntity {
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @ApiProperty({
    type: String,
    example: 'Customer feedback',
  })
  @Column()
  content: string;

  @ApiProperty({
    enum: Object.values(ProductRating),
    example: ProductRating.Five,
  })
  @Column('varchar')
  star: ProductRating;
}

/**
 * Define the Media entity
 */
@Entity('Media')
export class Media extends CsCrudEntity {
  @ApiProperty({
    type: String,
    example: 'https://image.com',
  })
  @Column()
  url: string;

  @ApiProperty({ enum: Object.values(MediaType), example: MediaType.Image })
  @Column('varchar')
  type: MediaType;

  @ApiProperty({
    type: String,
    example: 'Eyewear',
  })
  @Column()
  title: string;

  @ApiProperty({
    type: String,
    example: 'Description',
  })
  @Column()
  description: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Column()
  position: number;

  @ApiProperty({
    type: String,
    example: 'https://image.com',
  })
  @Column()
  thumb: string;

  @ManyToOne(() => Product, (product) => product.media)
  product: Product;
}

/**
 * Define the Wishlist entity
 */
@Entity('Wishlist')
export class Wishlist extends CsCrudEntity {
  @OneToOne(() => User)
  @JoinColumn()
  customer: User;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;
}

/**
 * Define the Cart entity
 */
@Entity('Cart')
export class Cart extends CsCrudEntity {
  @OneToOne(() => User)
  @JoinColumn()
  customer: User;
}

/**
 * Define the CartItem entity
 */
@Entity('CartItem')
export class CartItem extends CsCrudEntity {
  @ManyToOne(() => Cart, (cart) => cart.id)
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @ApiProperty({
    type: Number,
    example: 2,
  })
  @Column()
  quantity: number;
}
