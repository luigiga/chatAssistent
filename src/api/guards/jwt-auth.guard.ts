/**
 * Guard para autenticação JWT
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService as JwtServiceInterface } from '@infrastructure/auth/jwt-service.interface';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JWT_SERVICE } from '@infrastructure/auth/tokens';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(JWT_SERVICE)
    private readonly jwtService: JwtServiceInterface,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verifica se a rota é pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const payload = await this.jwtService.verifyAccessToken(token);
    if (!payload) {
      throw new UnauthorizedException('Token inválido');
    }

    // Adiciona payload ao request para uso nos controllers
    request.user = payload;
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
