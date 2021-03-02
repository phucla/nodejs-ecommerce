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
import { JwtPayload } from './interface';
import { EXPIRE_DATE } from './constants/auth.const';
import { LoginDto } from './auth.dto';
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

  async findByLogin(loginDto: LoginDto): Promise<User> {
    const user: User = await this.userRepository.findOne({
      user_name: loginDto.username,
      role: loginDto.role,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await comparePassword(user.password, loginDto.password);
    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  /**
   * Validate User payload
   * @param payload
   */
  async validateUserPayload(payload: JwtPayload): Promise<User> {
    const user: User = await this.findByUserName(payload.username);
    return user;
  }

  /**
   * Signin
   * @param loginDto
   */
  async signIn(loginDto: LoginDto) {
    const user = await this.findByLogin(loginDto);
    const payload: JwtPayload = {
      username: user.user_name,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      username: user.user_name,
      expiresIn: EXPIRE_DATE,
    };
  }
}
