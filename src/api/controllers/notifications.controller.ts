/**
 * Controller de Notificações
 */
import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ListNotificationsUseCase } from '@application/use-cases/notifications/list-notifications.use-case';
import { MarkNotificationReadUseCase } from '@application/use-cases/notifications/mark-notification-read.use-case';
import { GetUnreadCountUseCase } from '@application/use-cases/notifications/get-unread-count.use-case';
import { SnoozeNotificationUseCase } from '@application/use-cases/notifications/snooze-notification.use-case';
import { SnoozeNotificationDto, SnoozeNotificationDtoSchema } from '@application/dto/snooze-notification.dto';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly listNotificationsUseCase: ListNotificationsUseCase,
    private readonly markNotificationReadUseCase: MarkNotificationReadUseCase,
    private readonly getUnreadCountUseCase: GetUnreadCountUseCase,
    private readonly snoozeNotificationUseCase: SnoozeNotificationUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @CurrentUser() user: { sub: string },
    @Query('unread') unread?: string,
  ) {
    const unreadOnly = unread === 'true';
    return this.listNotificationsUseCase.execute(user.sub, unreadOnly);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  async markAsRead(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
  ) {
    return this.markNotificationReadUseCase.execute(user.sub, id);
  }

  @Get('unread/count')
  @HttpCode(HttpStatus.OK)
  async getUnreadCount(@CurrentUser() user: { sub: string }) {
    const count = await this.getUnreadCountUseCase.execute(user.sub);
    return { count };
  }

  @Patch(':id/snooze')
  @HttpCode(HttpStatus.OK)
  async snooze(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Body(new ZodValidationPipe(SnoozeNotificationDtoSchema)) dto: SnoozeNotificationDto,
  ) {
    return this.snoozeNotificationUseCase.execute(user.sub, id, dto);
  }
}

