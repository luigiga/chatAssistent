/* eslint-disable prettier/prettier */
/**
 * Entry point da aplicação
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './api/app.module';
import { ZodExceptionFilter } from './api/filters/zod-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Exception filter para Zod
  app.useGlobalFilters(new ZodExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  // eslint-disable-next-line prettier/prettier
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
