// Standard library
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Internal
import { CustomerController } from './customer.controller';
import { ProfileService } from './customer.service';
import { Profile } from './customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [CustomerController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class CustomerModule {}
