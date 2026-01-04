/**
 * Use Case: Renovar access token usando refresh token
 */
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { RefreshTokenRepository } from '@domain/interfaces/repositories/refresh-token.repository.interface';
import { UserRepository } from '@domain/interfaces/repositories/user.repository.interface';
import { JwtService as JwtServiceInterface } from '@infrastructure/auth/jwt-service.interface';
import { RefreshTokenDto } from '../../dto/refresh-token.dto';
import { AuthResponseDto } from '../../dto/auth-response.dto';
import { RefreshToken } from '@domain/entities/refresh-token.entity';
import { randomUUID } from 'crypto';
import {
  REFRESH_TOKEN_REPOSITORY,
  USER_REPOSITORY,
  JWT_SERVICE,
} from '@infrastructure/auth/tokens';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(JWT_SERVICE)
    private readonly jwtService: JwtServiceInterface,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    // Verificar e validar refresh token
    const tokenPayload = await this.jwtService.verifyRefreshToken(
      dto.refreshToken,
    );
    if (!tokenPayload) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // Buscar refresh token no banco
    const refreshToken = await this.refreshTokenRepository.findByToken(
      dto.refreshToken,
    );
    if (!refreshToken || !refreshToken.isValid()) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    // Buscar usuário
    const user = await this.userRepository.findById(refreshToken.userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Revogar refresh token antigo (rotação)
    await this.refreshTokenRepository.revoke(refreshToken.token);

    // Gerar novos tokens
    const accessToken = await this.jwtService.generateAccessToken({
      sub: user.id,
      email: user.email,
    });

    const newRefreshTokenValue = await this.jwtService.generateRefreshToken({
      sub: user.id,
    });

    // Calcular data de expiração
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + this.jwtService.getRefreshTokenExpirationDays(),
    );

    // Criar e persistir novo refresh token
    const newRefreshToken = RefreshToken.create(
      randomUUID(),
      newRefreshTokenValue,
      user.id,
      expiresAt,
    );
    await this.refreshTokenRepository.create(newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshTokenValue,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}

