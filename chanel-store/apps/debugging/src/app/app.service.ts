// Standard library
import { createHmac } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Faker from 'faker';

// External module
import { User, Role, Address } from '@chanel-store/shared';
import { CsCrudEntityService } from '@chanel-store/core';
import { CREATE_HMAC_KEY, CREATE_HMAC_DIGEST } from '@chanel-store/auth';

// class UserService extends CsCrudEntityService<User> {}

@Injectable()
export class UserService extends CsCrudEntityService<User> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {
    super(userRepository);
  }
}

/**
 * Define debugging deeder to fake data
 */
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}
  private userService = new UserService(this.userRepository);

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
  async createStoreManager(): Promise<void> {
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
        email: store.email,
        user_name: store.userName,
        password: createHmac(CREATE_HMAC_KEY, 'abcd@1234').digest(
          CREATE_HMAC_DIGEST
        ),
        role: Role.StoreManager,
      };

      await this.userService.create(storeManager);
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

    for (const store of users) {
      const storeManager = {
        email: store.email,
        user_name: store.userName,
        password: createHmac(CREATE_HMAC_KEY, 'abcd@1234').digest(
          CREATE_HMAC_DIGEST
        ),
        role: Role.User,
      };

      await this.userService.create(storeManager);
    }
  }

  /**
   * Create Store
   */
  async createStores(address) {
    const stores = ['Chanel Store New York', 'Chanel Store Viet Nam'];

    for (const store of stores) {
      const storeData = {
        name: store,
        lat: Faker.address.latitude,
        lng: Faker.address.longitude,
        store_address_id: address.id,
        phone_number: Faker.phone,
        email: 'channel.store@test.com',
        description: 'Description',
        is_publicshed: true,
      };
    }
  }
}
