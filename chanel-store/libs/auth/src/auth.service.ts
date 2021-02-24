// Standard library
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { createHmac } from 'crypto';

// External module
import { CsCrudEntityService } from '@chanel-store/core';
import {
  User,
  CREATE_HMAC_KEY,
  CREATE_HMAC_DIGEST,
} from '@chanel-store/shared';

@Injectable()
export class AuthService extends CsCrudEntityService<User> {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {
    super(userRepository);
  }

  /**
   * Find user by user name
   * @param username String
   */
  async findByUserName(username: string): Promise<User> {
    const entity = await this.userRepository.findOne({ user_name: username });
    if (entity) {
      return entity;
    }

    throw new NotFoundException();
  }

  /**
   * Validate user with username and password
   * @param username String
   * @param password String
   */
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.findByUserName(username);
    if (
      user &&
      createHmac(CREATE_HMAC_KEY, password).digest(CREATE_HMAC_DIGEST) ===
        user.password
    ) {
      // Remove password
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Login
   * @param user any
   */
  async login(user: any) {
    const data = user;
    return {
      access_token: this.jwtService.sign(data),
    };
  }

  async validateUserPayload(payload) {
    // const user = this.us;
    return payload;
  }
}
