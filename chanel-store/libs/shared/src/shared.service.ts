// Standard libs
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// External libs
import { CsCrudEntityService } from '@chanel-store/core';
import { Profile } from '@chanel-store/customer';

// Internal module
import { User, Address, ShippingAddress } from './shared.entity';

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
  async getUserInfo() {
    const user = await this.findById(29);
    const profile = await this.profileRepository.find({
      where: {
        user,
      },
    });

    return {
      ...user,
      profile,
    };
  }

  async hardDelete(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.profileRepository.delete({
      user,
    });
    await this.bulkDelete([id]);
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
