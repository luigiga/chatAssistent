/**
 * Use Case: Logout (revogar refresh token)
 */
import { Injectable, Inject } from '@nestjs/common';
import { RefreshTokenRepository } from '@domain/interfaces/repositories/refresh-token.repository.interface';
import { REFRESH_TOKEN_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    // Revogar refresh token
    await this.refreshTokenRepository.revoke(refreshToken);
  }
}

