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

  // Processar CORS_ORIGIN - pode ser string única ou múltiplas separadas por vírgula
  const corsOriginEnv = process.env.CORS_ORIGIN || 'http://localhost:5173';
  const allowedOrigins = corsOriginEnv
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  // Habilitar CORS
  app.enableCors({
    origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
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
