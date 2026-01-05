/**
 * Controller de Interações com IA
 * Gerencia confirmação e rejeição de ações pendentes
 */
import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ConfirmInteractionUseCase } from '@application/use-cases/interactions/confirm-interaction.use-case';
import { RejectInteractionUseCase } from '@application/use-cases/interactions/reject-interaction.use-case';
import { ListPendingInteractionsUseCase } from '@application/use-cases/interactions/list-pending-interactions.use-case';

@Controller('interactions')
@UseGuards(JwtAuthGuard)
export class InteractionsController {
  constructor(
    private readonly confirmInteractionUseCase: ConfirmInteractionUseCase,
    private readonly rejectInteractionUseCase: RejectInteractionUseCase,
    private readonly listPendingInteractionsUseCase: ListPendingInteractionsUseCase,
  ) {}

  /**
   * Lista todas as interações pendentes do usuário
   */
  @Get('pending')
  async listPending(@CurrentUser() user: { sub: string }) {
    return this.listPendingInteractionsUseCase.execute(user.sub);
  }

  /**
   * Confirma uma interação pendente e executa a ação
   */
  @Post(':id/confirm')
  @HttpCode(HttpStatus.OK)
  async confirm(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
  ) {
    return this.confirmInteractionUseCase.execute(user.sub, id);
  }

  /**
   * Rejeita uma interação pendente
   */
  @Post(':id/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reject(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
  ) {
    await this.rejectInteractionUseCase.execute(user.sub, id);
  }
}

