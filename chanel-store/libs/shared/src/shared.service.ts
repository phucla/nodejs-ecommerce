// Standard libs
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// External libs
import { CsCrudEntityService } from '@chanel-store/core';

// Internal module
import { User, Address, ShippingAddress } from './shared.entity';

@Injectable()
export class SharedService {}

@Injectable()
export class UserService extends CsCrudEntityService<User> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {
    super(userRepository);
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
    private userRepository: Repository<ShippingAddress>
  ) {
    super(userRepository);
  }
}
