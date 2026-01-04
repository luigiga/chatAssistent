/**
 * Controller de autenticação
 */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from '@application/use-cases/auth/refresh-token.use-case';
import { LogoutUseCase } from '@application/use-cases/auth/logout.use-case';
import { RegisterDto, RegisterDtoSchema } from '@application/dto/register.dto';
import { LoginDto, LoginDtoSchema } from '@application/dto/login.dto';
import {
  RefreshTokenDto,
  RefreshTokenDtoSchema,
} from '@application/dto/refresh-token.dto';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    // Validar DTO
    const validatedDto = RegisterDtoSchema.parse(dto);
    return this.registerUseCase.execute(validatedDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    // Validar DTO
    const validatedDto = LoginDtoSchema.parse(dto);
    return this.loginUseCase.execute(validatedDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    // Validar DTO
    const validatedDto = RefreshTokenDtoSchema.parse(dto);
    return this.refreshTokenUseCase.execute(validatedDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() body: { refreshToken: string }) {
    await this.logoutUseCase.execute(body.refreshToken);
  }
}

