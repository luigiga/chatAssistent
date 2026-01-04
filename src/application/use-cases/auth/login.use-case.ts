/**
 * Use Case: Login de usuário
 */
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { UserRepository } from '@domain/interfaces/repositories/user.repository.interface';
import { Email } from '@domain/value-objects/email.vo';
import { PasswordHasher } from '@infrastructure/auth/password-hasher.interface';
import { LoginDto } from '../../dto/login.dto';
import { AuthResponseDto } from '../../dto/auth-response.dto';
import { JwtService as JwtServiceInterface } from '@infrastructure/auth/jwt-service.interface';
import { RefreshTokenRepository } from '@domain/interfaces/repositories/refresh-token.repository.interface';
import { RefreshToken } from '@domain/entities/refresh-token.entity';
import { randomUUID } from 'crypto';
import {
  USER_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
  PASSWORD_HASHER,
  JWT_SERVICE,
} from '@infrastructure/auth/tokens';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(JWT_SERVICE)
    private readonly jwtService: JwtServiceInterface,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    // Validar email
    const email = Email.create(dto.email);

    // Buscar usuário
    const user = await this.userRepository.findByEmail(email.getValue());
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar senha
    const isValidPassword = await this.passwordHasher.verify(
      dto.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar tokens
    const accessToken = await this.jwtService.generateAccessToken({
      sub: user.id,
      email: user.email,
    });

    const refreshTokenValue = await this.jwtService.generateRefreshToken({
      sub: user.id,
    });

    // Calcular data de expiração do refresh token
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + this.jwtService.getRefreshTokenExpirationDays(),
    );

    // Criar e persistir refresh token
    const refreshToken = RefreshToken.create(
      randomUUID(),
      refreshTokenValue,
      user.id,
      expiresAt,
    );
    await this.refreshTokenRepository.create(refreshToken);

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}

