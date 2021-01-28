/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
// Standard library
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

// Internal
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3001;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();