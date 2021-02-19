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
    private variantValueService: VariantValueService
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
  async createProfile(user: User, store?: Store) {
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
  async createAddress() {
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
  async createBusinessHour(store: Store) {
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
  async createCategory(store) {
    const categories = [
      {
        name: 'Eyewear',
        description: 'Eyewear category',
      },
      {
        name: 'Watch',
        description: 'Watch category',
      },
      {
        name: 'Fragrance',
        description: 'Fragrance category',
      },
    ];

    for (const category of categories) {
      const categoryData = {
        name: category.name,
        description: category.description,
        store: store,
      };

      await this.categoryService.create(categoryData);
    }
  }

  /**
   * Create Product
   * @param store
   * @param category
   */
  async createProduct(store, category) {
    const product = {
      name: Faker.commerce.productName(),
      description: Faker.commerce.productDescription(),
      product_type: Faker.random.arrayElement(Object.values(ProductType)),
      store: store,
      category: category,
      is_published: true,
    };

    await this.productService.create(product);
  }

  /**
   * Create Product SKU
   * @param product
   */
  async createProductSku(product) {
    const productSku = {
      product: product,
      price: parseFloat(Faker.commerce.price()),
      quantity: Faker.random.number(),
      sku: Faker.random.words(10),
      cost_price: parseFloat(Faker.commerce.price()),
      retail_price: parseFloat(Faker.commerce.price()),
    };

    await this.productSkuService.create(productSku);
  }

  /**
   * Create Variant
   * @param product
   */
  async createVariant(product) {
    const variantNames = ['Color', 'Size'];
    const variant = {
      product: product,
      name: Faker.random.arrayElement(variantNames),
    };
    await this.variantService.create(variant);
  }

  /**
   * Create Variant value
   * @param variant
   */
  async createVariantValue(variant) {
    const variantNames = ['Color', 'Size'];
    const variantValue = {
      variant: variant,
      name: Faker.random.arrayElement(variantNames),
    };
    await this.variantValueService.create(variantValue);
  }

  async _getLatestId(service: ICsCrudService<CsCrudEntity>): Promise<number> {
    const storeManagers = await service.find({
      skip: 0,
      take: 1,
      order: {
        id: 'DESC',
      },
    });

    if (storeManagers.length) {
      return storeManagers[0].id;
    }

    return 0;
  }
}
