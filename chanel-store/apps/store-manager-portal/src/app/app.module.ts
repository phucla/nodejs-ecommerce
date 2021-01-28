// Standard library
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@chanel-store/database';

// Internal
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
