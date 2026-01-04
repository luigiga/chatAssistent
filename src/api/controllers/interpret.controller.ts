/**
 * Controller para interpretação de mensagens
 */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InterpretUseCase } from '@application/use-cases/interpret/interpret.use-case';
import { InterpretDto, InterpretDtoSchema } from '@application/dto/interpret.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('interpret')
@UseGuards(JwtAuthGuard)
export class InterpretController {
  constructor(private readonly interpretUseCase: InterpretUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async interpret(
    @CurrentUser() user: { sub: string },
    @Body() dto: InterpretDto,
  ) {
    // Validar DTO
    const validatedDto = InterpretDtoSchema.parse(dto);

    // Executar use case
    return this.interpretUseCase.execute(user.sub, validatedDto);
  }
}

