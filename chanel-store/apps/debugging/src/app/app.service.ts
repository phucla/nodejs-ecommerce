// Standard library
import { createHmac } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Faker from 'faker';

// External module
import { User, Role, Address, CreateAddressDTO } from '@chanel-store/shared';
import { CsCrudEntityService } from '@chanel-store/core';
import { CREATE_HMAC_KEY, CREATE_HMAC_DIGEST } from '@chanel-store/auth';
import {
  Store,
  CreateBusinessHourDTO,
  DayOfWeek,
  BusinessHour,
} from '@chanel-store/store';
import { Profile, CreateProfileDTO } from '@chanel-store/customer';
import {
  Category,
  Product,
  ProductType,
  ProductSku,
  Variant,
  VariantValue,
} from '@chanel-store/product';

class UserService extends CsCrudEntityService<User> {}
class StoreService extends CsCrudEntityService<Store> {}
class AddressService extends CsCrudEntityService<Address> {}
class BusinessHourService extends CsCrudEntityService<BusinessHour> {}
class ProfileService extends CsCrudEntityService<Profile> {}
class CategoryService extends CsCrudEntityService<Category> {}
class ProductService extends CsCrudEntityService<Product> {}
class ProductSkuService extends CsCrudEntityService<ProductSku> {}
class VariantService extends CsCrudEntityService<Variant> {}
class VariantValueService extends CsCrudEntityService<VariantValue> {}

/**
 * Define debugging deeder to fake data
 */
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    @InjectRepository(BusinessHour)
    private businessHourRepository: Repository<BusinessHour>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(ProductSku)
    private productSkuRepository: Repository<ProductSku>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(VariantValue)
    private variantValueRepository: Repository<VariantValue>
  ) {}
  private userService = new UserService(this.userRepository);
  private storeService = new StoreService(this.storeRepository);
  private addressService = new AddressService(this.addressRepository);
  private businessHourService = new BusinessHourService(
    this.businessHourRepository
  );
  private profileService = new ProfileService(this.profileRepository);
  private categoryService = new CategoryService(this.categoryRepository);
  private productService = new ProductService(this.productRepository);
  private productSkuService = new ProductSkuService(this.productSkuRepository);
  private variantService = new VariantService(this.variantRepository);
  private variantValueService = new VariantValueService(
    this.variantValueRepository
  );

  /**
   * Init data
   */
  async initData() {
    await this.createAdmin();
    await this.createStores();
    await this.createUser();
  }

  /**
   * Create Admin account
   */
  async createAdmin(): Promise<User> {
    const admin = {
      email: 'admin@test.com',
      user_name: 'admin',
      password: createHmac(CREATE_HMAC_KEY, 'abcd@1234').digest(
        CREATE_HMAC_DIGEST
      ),
      role: Role.Admin,
    };

    return await this.userService.create(admin);
  }

  /**
   * Create Store manager account
   */
  async createStoreManager(storeEntity): Promise<void> {
    const storeManagers = [
      {
        email: 'store01@test.com',
        userName: 'store01',
      },
      {
        email: 'store02@test.com',
        userName: 'store02',
      },
      {
        email: 'store03@test.com',
        userName: 'store03',
      },
    ];
    for (const store of storeManagers) {
      const storeManager = {
        email: storeEntity.id + store.email,
        user_name: storeEntity.id + store.userName,
        password: createHmac(CREATE_HMAC_KEY, 'abcd@1234').digest(
          CREATE_HMAC_DIGEST
        ),
        role: Role.StoreManager,
      };

      // Create Store manager
      const storeMangerResponse = await this.userService.create(storeManager);

      // Create profile of Store manager
      this.createProfile(storeMangerResponse, storeEntity);
    }
  }

  /**
   * Create User data
   */
  async createUser(): Promise<void> {
    const users = [
      {
        email: 'user01@test.com',
        userName: 'user01',
      },
      {
        email: 'user02@test.com',
        userName: 'user02',
      },
      {
        email: 'store03@test.com',
        userName: 'user03',
      },
    ];

    for (const user of users) {
      const userData = {
        email: user.email,
        user_name: user.userName,
        password: createHmac(CREATE_HMAC_KEY, 'abcd@1234').digest(
          CREATE_HMAC_DIGEST
        ),
        role: Role.User,
      };

      await this.userService.create(userData);
    }
  }

  /**
   * Create profile
   */
  async createProfile(user, store) {
    // Create address of store manager
    const address = await this.createAddress();

    const profile: CreateProfileDTO = {
      first_name: Faker.name.firstName(),
      last_name: Faker.name.lastName(),
      gender: Faker.name.gender(),
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
  async createStores() {
    const stores = ['Chanel Store New York', 'Chanel Store Viet Nam'];

    // Create store
    for (const store of stores) {
      // Create store address
      const address = await this.createAddress();

      const storeData = {
        name: store,
        lat: Faker.address.latitude(),
        lng: Faker.address.longitude(),
        store_address: address,
        phone_number: Faker.phone.phoneNumberFormat(),
        email: 'channel.store@test.com',
        description: 'Description',
        is_published: true,
      };

      // Create store data
      const storeEntity = await this.storeService.create(storeData);

      // Create store business hour
      await this.createBusinessHour(storeEntity);

      // Create store manager
      await this.createStoreManager(storeEntity);
    }
  }

  /**
   * Create store address
   */
  async createAddress() {
    const address: CreateAddressDTO = {
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
  async createBusinessHour(store) {
    for (const day of Object.values(DayOfWeek)) {
      const businessHour: CreateBusinessHourDTO = {
        open_hour: '07:00 AM',
        close_hour: '05:00 PM',
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
}
