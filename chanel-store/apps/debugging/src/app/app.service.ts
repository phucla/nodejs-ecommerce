// Standard library
import { createHmac } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import * as Faker from 'faker';

// External module
import { CsCrudEntity, ICsCrudService } from '@chanel-store/core';
import { CREATE_HMAC_KEY, CREATE_HMAC_DIGEST } from '@chanel-store/auth';
import {
  User,
  Role,
  UserService,
  AddressService,
  IUser,
  IAddress,
  Address,
  ShippingAddress,
  ShippingAddressService,
  IShippingAddress,
} from '@chanel-store/shared';
import {
  CreateBusinessHourDTO,
  DayOfWeek,
  StoreService,
  BusinessHourService,
  Store,
} from '@chanel-store/store';
import { IProfile, ProfileService } from '@chanel-store/customer';
import {
  ProductType,
  ProductService,
  CategoryService,
  ProductSkuService,
  VariantService,
  VariantValueService,
  SkuValueService,
  OrderService,
  OrderItemService,
  ICategory,
  IProduct,
  IProductSku,
  IVariant,
  IVariantValue,
  ISkuValue,
  IOrder,
  Category,
  Product,
  ProductSku,
  Variant,
  VariantValue,
  Order,
  OrderStatus,
  IOrderItem,
} from '@chanel-store/product';
import { Gender } from 'libs/customer/src/enums/gender.enum';

/**
 * Define debugging seeder to fake data
 */
@Injectable()
export class AppService {
  constructor(
    private logger: Logger,
    private userService: UserService,
    private storeService: StoreService,
    private businessHourService: BusinessHourService,
    private addressService: AddressService,
    private profileService: ProfileService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private productSkuService: ProductSkuService,
    private variantService: VariantService,
    private variantValueService: VariantValueService,
    private skuValueService: SkuValueService,
    private orderService: OrderService,
    private shippingAddressService: ShippingAddressService,
    private orderItemService: OrderItemService
  ) {}
  private DEFAULT_PASSWORD = 'abcd@1234';

  /**
   * Init data
   */
  async initData(): Promise<void> {
    await this.createRootAdmin();
    const stores = await this.createStores(2);
    for (const store of stores) {
      this.createStoreManager(3, store.id);
      const categories: Category[] = await this.createCategory(3, store);
      await this.createProduct(store, Faker.random.arrayElement(categories));
    }
    const users: User[] = await this.createUser(10);
    await this.createOrders(10, Faker.random.arrayElement(users).id);
  }

  async removeData(): Promise<void> {
    this.removeOrders();
    this.removeUsers(Role.User);
  }

  async removeOrders(orderIds?: number[]): Promise<void> {
    if (!orderIds) {
      await this.shippingAddressService.bulkDelete();
      await this.orderItemService.bulkDelete();
      await this.orderService.bulkDelete();
      return;
    }

    // Remove order item
    for (const orderId of orderIds) {
      await this.orderItemService.bulkDelete({
        order: {
          id: orderId,
        },
      });
    }

    // Remove orders
    await this.orderService.bulkDelete(orderIds);
  }

  async removeUsers(role: Role, userIds?: number[]): Promise<void> {
    if (!userIds) {
      const users: User[] = await this.userService.find({
        where: {
          role,
        },
      });

      for (const user of users) {
        await this.userService.hardDelete(user.id);
      }
      return;
    }

    // Remove order item
    for (const userId of userIds) {
      await this.userService.hardDelete(userId);
    }
  }

  /**
   * Create root Admin account
   */
  async createRootAdmin(): Promise<User> {
    const admin: IUser = {
      email: 'admin@test.com',
      user_name: 'admin',
      password: createHmac(CREATE_HMAC_KEY, this.DEFAULT_PASSWORD).digest(
        CREATE_HMAC_DIGEST
      ),
      role: Role.Admin,
    };

    return await this.userService.create(admin);
  }

  async createStoreManager(
    numberOfManagers: number,
    storeId: number
  ): Promise<User[]> {
    let store: Store;

    if (storeId) {
      store = await this.storeService.findById(storeId);
    } else {
      const latestStoreId: number = await this._getLatestId(this.storeService);
      store = await this.storeService.findById(latestStoreId);
    }

    const managers: User[] = await this._createStoreManager(
      numberOfManagers,
      store
    );
    return managers;
  }

  /**
   * Create User data
   */
  async createUser(numberOfUsers: number): Promise<User[]> {
    this.logger.debug('Start create User');
    const latestId = await this._getLatestId(this.userService);
    const users: User[] = [];
    for (let i = 0; i < numberOfUsers; i++) {
      const userDto: IUser = {
        email: `user${latestId + i + 1}@test.com`,
        user_name: `user${latestId + i + 1}`,
        password: createHmac(CREATE_HMAC_KEY, this.DEFAULT_PASSWORD).digest(
          CREATE_HMAC_DIGEST
        ),
        role: Role.User,
      };

      const userResponse = await this.userService.create(userDto);
      users.push(userResponse);

      // Create profile of User
      this.createProfile(userResponse);
    }
    this.logger.debug('The Users has been successfully created');
    return users;
  }

  /**
   * Create Profile
   * @param user
   * @param store
   */
  async createProfile(user: User, store?: Store): Promise<void> {
    const address = await this.createAddress();

    const profile: IProfile = {
      first_name: Faker.name.firstName(),
      last_name: Faker.name.lastName(),
      gender: Faker.random.arrayElement(Object.values(Gender)),
      phone_number: Faker.phone.phoneNumber(),
      address: address,
      store: store,
      user: user,
    };
    await this.profileService.create(profile);
  }

  /**
   * Create Store
   * Include create Store address, Store's business hour and Store manager
   */
  async createStores(numberStore: number): Promise<Store[]> {
    const stores: Store[] = [];
    const latestStoreId = await this._getLatestId(this.storeService);

    // Create store
    for (let i = 0; i < numberStore; i++) {
      // Create store address
      const address = await this.createAddress();

      const storeData = {
        name: Faker.company.companyName(),
        lat: Faker.address.latitude(),
        lng: Faker.address.longitude(),
        store_address: address,
        phone_number: Faker.phone.phoneNumberFormat(),
        email: `channel.store${latestStoreId + i + 1}@test.com`,
        description: Faker.company.companySuffix(),
        is_published: true,
      };

      // Create store data
      const storeEntity = await this.storeService.create(storeData);
      stores.push(storeEntity);

      // Create store business hour
      await this.createBusinessHour(storeEntity);
      return stores;
    }
  }

  /**
   * Create store address
   */
  async createAddress(): Promise<Address> {
    const address: IAddress = {
      address: Faker.address.streetAddress(),
      city: Faker.address.city(),
      zip_code: Faker.address.zipCode('000000'),
      state: Faker.address.state(),
    };

    return await this.addressService.create(address);
  }

  /**
   * Create business hour
   * @param(store) store entity
   */
  async createBusinessHour(store: Store): Promise<void> {
    for (const day of Object.values(DayOfWeek)) {
      const businessHour: CreateBusinessHourDTO = {
        open_hour: Faker.date.recent(),
        close_hour: Faker.date.recent(),
        date_of_week: day,
        store: store,
      };
      await this.businessHourService.create(businessHour);
    }
  }

  /**
   * Create category
   */
  async createCategory(
    numberOfCategory: number,
    store: Store | number,
    parent?: Category | number
  ): Promise<Category[]> {
    const categories: Category[] = [];
    let categoryStore: Store;
    let categoryParent: Category;
    if (typeof store === 'number') {
      categoryStore = await this.storeService.findById(store);
    } else {
      categoryStore = store;
    }

    if (typeof parent === 'number') {
      categoryParent = await this.categoryService.findById(parent);
    } else {
      categoryParent = parent;
    }

    for (let i = 0; i < numberOfCategory; i++) {
      const categoryData: ICategory = {
        name: Faker.commerce.product(),
        description: Faker.lorem.words(),
        store: categoryStore,
        parent: categoryParent,
        is_published: true,
      };

      const category = await this.categoryService.create(categoryData);
      categories.push(category);
    }
    return categories;
  }

  async createProductWitoutStore(): Promise<Product> {
    let store: Store;
    let category: Category;
    const storeId: number = await this._getLatestId(this.storeService);
    if (storeId) {
      store = await this.storeService.findById(storeId);
    } else {
      store = await this.createStores(1)[0];
    }

    const categoriId: number = await this._getLatestId(this.categoryService);
    if (categoriId) {
      category = await this.categoryService.findById(categoriId);
    } else {
      category = await this.createCategory(1, store)[0];
    }

    return await this.createProduct(store, category);
  }

  async createProduct(store: Store, category: Category): Promise<Product> {
    let productSku: ProductSku;
    const variantValues: VariantValue[] = [];

    const products: Product[] = await this._createProduct(1, store, category);
    const product: Product = products[0];
    // Create Product Sku
    const variants: Variant[] = await this.createVariant(2, product);

    // Create Variant Value
    for (const variant of variants) {
      const result: VariantValue[] = await this.createVariantValue(2, variant);
      variantValues.push(...result);
    }

    // Create ProductSku
    for (const variantValue of variantValues) {
      productSku = await this.createProductSku(1, product)[0];
      for (const variant of variants) {
        await this.createSkuValue(variantValue, variant, productSku, product);
      }
    }

    return product;
  }

  /**
   * Create Product SKU
   * @param product
   */
  async createProductSku(
    numberSku: number,
    product: Product
  ): Promise<ProductSku[]> {
    const productSkus: ProductSku[] = [];
    for (let i = 0; i < numberSku; i++) {
      const productSkuDto: IProductSku = {
        product: product,
        price: parseFloat(Faker.commerce.price()),
        quantity: Faker.random.number(),
        sku: Faker.lorem.word(10),
        cost_price: parseFloat(Faker.commerce.price()),
        retail_price: parseFloat(Faker.commerce.price()),
      };

      const productSku = await this.productSkuService.create(productSkuDto);
      productSkus.push(productSku);
    }
    return productSkus;
  }

  /**
   * Create Variant
   * @param product
   */
  async createVariant(
    numberVariants: number,
    product: Product
  ): Promise<Variant[]> {
    const variants: Variant[] = [];
    for (let i = 0; i < numberVariants; i++) {
      const variantDto: IVariant = {
        product: product,
        name: Faker.commerce.product(),
      };
      const variant = await this.variantService.create(variantDto);
      variants.push(variant);
    }
    return variants;
  }

  /**
   * Create Variant value
   * @param variant
   */
  async createVariantValue(
    numberVariantValue: number,
    variant: Variant
  ): Promise<VariantValue[]> {
    const variantValues: VariantValue[] = [];
    for (let i = 0; i < numberVariantValue; i++) {
      const variantValueDto: IVariantValue = {
        variant: variant,
        name: Faker.commerce.product(),
      };
      const variantValue = await this.variantValueService.create(
        variantValueDto
      );
      variantValues.push(variantValue);
    }
    return variantValues;
  }

  /**
   * Create SKU value
   * @param variant
   */
  async createSkuValue(
    variantValue: VariantValue,
    variant: Variant,
    productSku: ProductSku,
    product: Product
  ): Promise<void> {
    const skuValueDto: ISkuValue = {
      variant: variant,
      variant_value: variantValue,
      product: product,
      sku: productSku,
    };

    await this.skuValueService.create(skuValueDto);
  }

  async createOrders(
    numberOrder: number,
    customerId: number
  ): Promise<Order[]> {
    const customer: User = await this.userService.findById(customerId);
    const orders: Order[] = [];
    for (let i = 0; i < numberOrder; i++) {
      const order = await this._createOrder(customer);
      orders.push(order);
      await this._createOrderItem(
        Faker.random.number({
          max: 5,
          min: 1,
        }),
        order
      );
    }
    return orders;
  }

  private async _createOrder(customer: User): Promise<Order> {
    const address: Address = await this.createAddress();
    const shippingAddressDto: IShippingAddress = {
      user: customer,
      address: address,
    };
    const shippingAddress: ShippingAddress = await this.shippingAddressService.create(
      shippingAddressDto
    );

    const orderDto: IOrder = {
      customer: customer,
      total_price: parseFloat(Faker.commerce.price()),
      shipping_address: shippingAddress,
      status: OrderStatus.Processing,
    };

    const order = await this.orderService.create(orderDto);
    return order;
  }

  private async _createOrderItem(
    numberItems: number,
    order: Order
  ): Promise<void> {
    const productsSku: ProductSku[] = await this.productSkuService.find();

    for (let i = 0; i < numberItems; i++) {
      const orderItemDto: IOrderItem = {
        product_sku: Faker.random.arrayElement(productsSku),
        order: order,
        quantity: Faker.random.number(10),
      };
      await this.orderItemService.create(orderItemDto);
    }
  }

  /**
   * Create Store manager account
   */
  private async _createStoreManager(
    numberOfManagers: number,
    store: Store
  ): Promise<User[]> {
    const latestId = await this._getLatestId(this.userService);
    const managers: User[] = [];

    for (let i = 0; i < numberOfManagers; i++) {
      const storeManagerDto: IUser = {
        email: `store${latestId + i + 1}@test.com`,
        user_name: `store${latestId + i + 1}`,
        password: createHmac(CREATE_HMAC_KEY, this.DEFAULT_PASSWORD).digest(
          CREATE_HMAC_DIGEST
        ),
        role: Role.StoreManager,
      };

      // Create Store manager
      const storeMangerResponse = await this.userService.create(
        storeManagerDto
      );
      managers.push(storeMangerResponse);

      // Create profile of Store manager
      this.createProfile(storeMangerResponse, store);
    }
    return managers;
  }

  private async _getLatestId(
    service: ICsCrudService<CsCrudEntity>
  ): Promise<number> {
    const entities = await service.find({
      skip: 0,
      take: 1,
      order: {
        id: 'DESC',
      },
    });

    if (entities.length) {
      return entities[0].id;
    }

    return 0;
  }

  /**
   * Create Product
   * @param store
   * @param category
   */
  private async _createProduct(
    numberOfProduct: number,
    store: Store,
    category: Category
  ): Promise<Product[]> {
    const products: Product[] = [];

    for (let i = 0; i < numberOfProduct; i++) {
      const productDto: IProduct = {
        name: Faker.commerce.productName(),
        description: Faker.commerce.productDescription(),
        product_type: Faker.random.arrayElement(Object.values(ProductType)),
        store: store,
        category: category,
        is_published: true,
      };

      const product = await this.productService.create(productDto);
      products.push(product);
    }
    return products;
  }
}
