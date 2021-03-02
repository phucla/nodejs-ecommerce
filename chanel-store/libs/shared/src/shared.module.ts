// Standard library
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Internal
import { SharedController } from './shared.controller';
import {
  SharedService,
  UserService,
  AddressService,
  ShippingAddressService,
} from './shared.service';
import { User, Address, ShippingAddress } from './shared.entity';
import { Profile } from '@chanel-store/customer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ShippingAddress, Address, Profile]),
  ],
  controllers: [SharedController],
  providers: [
    SharedService,
    UserService,
    AddressService,
    ShippingAddressService,
  ],
  exports: [UserService, AddressService, ShippingAddressService],
})
export class SharedModule {}
