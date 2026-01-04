/**
 * Implementação do serviço JWT usando @nestjs/jwt
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtService as JwtServiceInterface, JwtPayload } from './jwt-service.interface';

@Injectable()
export class NestJwtServiceImpl implements JwtServiceInterface {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
    });
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>(
        'REFRESH_TOKEN_EXPIRES_IN',
        '7d',
      ),
    });
  }

  async verifyAccessToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return payload as JwtPayload;
    } catch (error) {
      return null;
    }
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
      return payload as JwtPayload;
    } catch (error) {
      return null;
    }
  }

  getRefreshTokenExpirationDays(): number {
    const expiresIn = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRES_IN',
      '7d',
    );
    // Converte "7d" para número de dias
    const match = expiresIn.match(/(\d+)([d])/);
    if (match) {
      return parseInt(match[1], 10);
    }
    return 7; // padrão
  }
}

