// Standard libs
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// External libs
import { CsCrudEntityService } from '@chanel-store/core';

// Internal module
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

@Injectable()
export class ProductService extends CsCrudEntityService<Product> {
  constructor(
    @InjectRepository(Product) private csRepository: Repository<Product>
  ) {
    super(csRepository);
  }
}

@Injectable()
export class CategoryService extends CsCrudEntityService<Category> {
  constructor(
    @InjectRepository(Category) private csRepository: Repository<Category>
  ) {
    super(csRepository);
  }
}

@Injectable()
export class DiscountService extends CsCrudEntityService<Discount> {
  constructor(
    @InjectRepository(Discount)
    private csRepository: Repository<Discount>
  ) {
    super(csRepository);
  }
}

@Injectable()
export class OrderService extends CsCrudEntityService<Order> {
  constructor(
    @InjectRepository(Order)
    private csRepository: Repository<Order>
  ) {
    super(csRepository);
  }
}

@Injectable()
export class OrderItemService extends CsCrudEntityService<OrderItem> {
  constructor(
    @InjectRepository(OrderItem)
    private csRepository: Repository<OrderItem>
  ) {
    super(csRepository);
  }
}

@Injectable()
export class ProductSkuService extends CsCrudEntityService<ProductSku> {
  constructor(
    @InjectRepository(ProductSku)
    private csRepository: Repository<ProductSku>
  ) {
    super(csRepository);
  }
}

@Injectable()
export class VariantService extends CsCrudEntityService<Variant> {
  constructor(
    @InjectRepository(Variant)
    private csRepository: Repository<Variant>
  ) {
    super(csRepository);
  }
}

@Injectable()
export class VariantValueService extends CsCrudEntityService<VariantValue> {
  constructor(
    @InjectRepository(VariantValue)
    private csRepository: Repository<VariantValue>
  ) {
    super(csRepository);
  }
}

@Injectable()
export class SkuValueService extends CsCrudEntityService<SkuValue> {
  constructor(
    @InjectRepository(SkuValue)
    private csRepository: Repository<SkuValue>
  ) {
    super(csRepository);
  }
}

@Injectable()
export class CustomerFeedbackService extends CsCrudEntityService<CustomerFeedback> {
  constructor(
    @InjectRepository(CustomerFeedback)
    private csRepository: Repository<CustomerFeedback>
  ) {
    super(csRepository);
  }
}

@Injectable()
export class MediaService extends CsCrudEntityService<Media> {
  constructor(
    @InjectRepository(Media)
    private csRepository: Repository<Media>
  ) {
    super(csRepository);
  }
}

@Injectable()
export class WishlistService extends CsCrudEntityService<Wishlist> {
  constructor(
    @InjectRepository(Wishlist)
    private csRepository: Repository<Wishlist>
  ) {
    super(csRepository);
  }
}

@Injectable()
export class CartItemService extends CsCrudEntityService<CartItem> {
  constructor(
    @InjectRepository(CartItem)
    private csRepository: Repository<CartItem>
  ) {
    super(csRepository);
  }
}
