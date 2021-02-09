// Standard library
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Internal
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Profile } from './customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [],
})
export class CustomerModule {}
