// Standard library
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

// External module
import { CsCrudEntityService, comparePassword } from '@chanel-store/core';
import { User } from '@chanel-store/shared';

// Internal module
import { JwtPayload, LoginStatus } from './interface';
import { EXPIRE_DATE } from './constants/auth.const';

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

  async findByLogin(username: string, password: string): Promise<User> {
    const user: User = await this.findOne({ user_name: username });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await comparePassword(user.password, password);
    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  /**
   * Validate user with username and password
   * @param username String
   * @param password String
   */
  async validateUser(username: string, password: string): Promise<JwtPayload> {
    const user = await this.findByLogin(username, password);

    if (user) {
      return {
        username: user.user_name,
        role: user.role,
      };
    }
    return null;
  }

  /**
   * Login
   * @param user any
   */
  async login(user: JwtPayload): Promise<LoginStatus> {
    return {
      access_token: this.jwtService.sign(user),
      username: user.username,
      expiresIn: EXPIRE_DATE,
    };
  }

  /**
   * Validate User payload
   * @param payload
   */
  async validateUserPayload(payload: JwtPayload): Promise<User> {
    const user: User = await this.findByUserName(payload.username);
    return user;
  }
}
