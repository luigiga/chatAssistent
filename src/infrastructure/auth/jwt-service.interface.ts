/**
 * Interface para serviço JWT
 */
export interface JwtPayload {
  sub: string;
  email?: string;
  [key: string]: unknown;
}

export interface JwtService {
  /**
   * Gera access token
   */
  generateAccessToken(payload: JwtPayload): Promise<string>;

  /**
   * Gera refresh token
   */
  generateRefreshToken(payload: JwtPayload): Promise<string>;

  /**
   * Verifica e decodifica access token
   */
  verifyAccessToken(token: string): Promise<JwtPayload | null>;

  /**
   * Verifica e decodifica refresh token
   */
  verifyRefreshToken(token: string): Promise<JwtPayload | null>;

  /**
   * Retorna número de dias de expiração do refresh token
   */
  getRefreshTokenExpirationDays(): number;
}

