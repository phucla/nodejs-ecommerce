// Standard library
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Internal
import { SharedController } from './shared.controller';
import { SharedService } from './shared.service';
import { User, Address, ShippingAddress } from './shared.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ShippingAddress, Address])],
  controllers: [SharedController],
  providers: [SharedService],
  exports: [],
})
export class SharedModule {}
