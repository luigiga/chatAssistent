/**
 * Use Case: Registrar novo usuário
 */
import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { User } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/interfaces/repositories/user.repository.interface';
import { Password } from '@domain/value-objects/password.vo';
import { Email } from '@domain/value-objects/email.vo';
import { PasswordHasher } from '@infrastructure/auth/password-hasher.interface';
import { RegisterDto } from '../../dto/register.dto';
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
export class RegisterUseCase {
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

  async execute(dto: RegisterDto): Promise<AuthResponseDto> {
    // Validar email
    const email = Email.create(dto.email);

    // Verificar se usuário já existe
    const existingUser = await this.userRepository.findByEmail(
      email.getValue(),
    );
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Validar senha
    const password = Password.create(dto.password);

    // Hash da senha
    const passwordHash = await this.passwordHasher.hash(password.getValue());

    // Criar usuário
    const userId = randomUUID();
    const user = User.create(
      userId,
      email.getValue(),
      passwordHash,
      dto.name,
    );

    // Persistir usuário
    const savedUser = await this.userRepository.create(user);

    // Gerar tokens
    const accessToken = await this.jwtService.generateAccessToken({
      sub: savedUser.id,
      email: savedUser.email,
    });

    const refreshTokenValue = await this.jwtService.generateRefreshToken({
      sub: savedUser.id,
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
      savedUser.id,
      expiresAt,
    );
    await this.refreshTokenRepository.create(refreshToken);

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
      },
    };
  }
}

