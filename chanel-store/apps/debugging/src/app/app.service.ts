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
  ICategory,
  IProduct,
  IProductSku,
  IVariant,
  IVariantValue,
  Category,
  Product,
  ProductSku,
  Variant,
  VariantValue,
  ISkuValue,
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
    private skuValueService: SkuValueService
  ) {}
  private DEFAULT_PASSWORD = 'abcd@1234';

  /**
   * Init data
   */
  async initData() {
    await this.createRootAdmin();
    const stores = await this.createStores(2);
    for (const store of stores) {
      this.createStoreManager(3, store);
    }
    await this.createUser(10);
  }

  async getUser() {
    return await this._getLatestId(this.userService);
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

  /**
   * Create Store manager account
   */
  async createStoreManager(
    numberOfManagers: number,
    store: Store
  ): Promise<void> {
    const latestId = await this._getLatestId(this.userService);

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

      // Create profile of Store manager
      this.createProfile(storeMangerResponse, store);
    }
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
   * Create Product
   * @param store
   * @param category
   */
  async _createProduct(
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

  async _getLatestId(service: ICsCrudService<CsCrudEntity>): Promise<number> {
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
}

// array = [
//   {
//     city: 'A',
//     name: 'Name 1',
//   },
//   {
//     city: 'A',
//     name: 'Name 1',
//   },
//   {
//     city: 'A',
//     name: 'Name 1',
//   },
// ];

// for(i = 0; i< array.length, i ++) {
//   for (j = i+ 1, j < array.length; j++) {
//      if (duplicate) {
//        array[j].error ='Error'
//      }
//   }
// }
