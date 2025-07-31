import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Автоматическое преобразование типов
      transformOptions: {
        enableImplicitConversion: true, // Неявное преобразование типов
      },
      forbidNonWhitelisted: true, // Запрет неописанных полей
      whitelist: true, // Автоматическое удаление неописанных полей
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('API for blog management')
    .setVersion('1.0')
    .addTag('blog')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
