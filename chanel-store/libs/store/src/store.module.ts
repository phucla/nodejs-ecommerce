// Standard library
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Internal
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Store, BusinessHour } from './store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, BusinessHour])],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [],
})
export class CustomerModule {}
