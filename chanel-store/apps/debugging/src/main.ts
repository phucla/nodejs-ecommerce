/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
// Standard liarary
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Internal module
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Chanel Store - Debugging API')
    .setDescription('Chanel Store - Debugging API description')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  SwaggerModule.setup('api/doc', app, document);

  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log(
      'Debugging API listening at http://localhost:' + port + '/' + globalPrefix
    );
  });
}

bootstrap();
