/**
 * Módulo de autenticação
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from '../controllers/auth.controller';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from '@application/use-cases/auth/refresh-token.use-case';
import { LogoutUseCase } from '@application/use-cases/auth/logout.use-case';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma-user.repository';
import { PrismaRefreshTokenRepository } from '@infrastructure/repositories/prisma-refresh-token.repository';
import { UserRepository } from '@domain/interfaces/repositories/user.repository.interface';
import { RefreshTokenRepository } from '@domain/interfaces/repositories/refresh-token.repository.interface';
import { Argon2PasswordHasher } from '@infrastructure/auth/password-hasher.service';
import { PasswordHasher } from '@infrastructure/auth/password-hasher.interface';
import { NestJwtServiceImpl } from '@infrastructure/auth/jwt.service';
import { JwtService as JwtServiceInterface } from '@infrastructure/auth/jwt-service.interface';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  USER_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
  PASSWORD_HASHER,
  JWT_SERVICE,
} from '@infrastructure/auth/tokens';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    // Repositories
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },
    // Services
    {
      provide: PASSWORD_HASHER,
      useClass: Argon2PasswordHasher,
    },
    {
      provide: JWT_SERVICE,
      useClass: NestJwtServiceImpl,
    },
    PrismaService,
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [
    JwtAuthGuard,
    USER_REPOSITORY,
    REFRESH_TOKEN_REPOSITORY,
    JWT_SERVICE,
  ],
})
export class AuthModule {}

