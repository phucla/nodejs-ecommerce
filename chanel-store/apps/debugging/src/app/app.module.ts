// Standard library
import { Module } from '@nestjs/common';

// Libs
import { DatabaseModule } from '@chanel-store/database';
import { SharedModule } from '@chanel-store/shared';
import { CustomerModule } from '@chanel-store/customer';
import { ProductModule } from '@chanel-store/product';
import { StoreModule } from '@chanel-store/store';

// Internal
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DatabaseModule,
    SharedModule,
    StoreModule,
    CustomerModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
