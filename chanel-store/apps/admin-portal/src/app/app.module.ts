// Standard library
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

// External module
import { DatabaseModule } from '@chanel-store/database';
import { AuthModule, JwtAuthGuard } from '@chanel-store/auth';
import { SharedModule } from '@chanel-store/shared';
import { CustomerModule } from '@chanel-store/customer';
import { ProductModule } from '@chanel-store/product';
import { StoreModule } from '@chanel-store/store';

// Internal module
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DatabaseModule,
    SharedModule,
    CustomerModule,
    ProductModule,
    StoreModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
  ],
})
export class AppModule {}
