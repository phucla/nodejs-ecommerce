// Standard libs
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// External libs
import { CsCrudEntityService } from '@chanel-store/core';
import { Profile } from '@chanel-store/customer';

// Internal module
import { User, Address, ShippingAddress } from './shared.entity';
import { CreateUserDto, UpdateUserDto } from './share.dto';

@Injectable()
export class SharedService {}

@Injectable()
export class UserService extends CsCrudEntityService<User> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>
  ) {
    super(userRepository);
  }

  async createUser(entity: CreateUserDto): Promise<User> {
    const result: User = await this.userRepository.create(entity);
    await this.userRepository.save(result);
    return result;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    return await this.userRepository.save(Object.assign(user, updateUserDto));
  }

  async findByLogin(username: string): Promise<User> {
    const user: User = await this.findOne({ user_name: username });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async deleteUser(id: number, isSoftDelete: boolean): Promise<boolean> {
    const user = await this.findById(id);
    if (!isSoftDelete) {
      await this.profileRepository.delete({
        user,
      });
    } else {
      await this.profileRepository.softDelete({
        user,
      });
    }

    await this.delete(id, isSoftDelete);
    return true;
  }
}

@Injectable()
export class AddressService extends CsCrudEntityService<Address> {
  constructor(
    @InjectRepository(Address) private userRepository: Repository<Address>
  ) {
    super(userRepository);
  }
}

@Injectable()
export class ShippingAddressService extends CsCrudEntityService<ShippingAddress> {
  constructor(
    @InjectRepository(ShippingAddress)
    private shippingAddressRepository: Repository<ShippingAddress>
  ) {
    super(shippingAddressRepository);
  }

  async findByIds(
    ids: number[] | ShippingAddress[]
  ): Promise<ShippingAddress[]> {
    return await this.shippingAddressRepository.findByIds(ids, {
      loadRelationIds: true,
    });
  }
}
