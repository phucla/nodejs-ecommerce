// Standard library
import { createHmac } from 'crypto';

// External module
import { User, Role } from '@chanel-store/shared';
import { CsCrudEntityService } from '@chanel-store/core';
import { CREATE_HMAC_KEY, CREATE_HMAC_DIGEST } from '@chanel-store/auth';

/**
 * Define debugging deeder to fake data
 */
export class DebuggingSeeder {
  constructor(private readonly userService: CsCrudEntityService<User>) {}

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
}
