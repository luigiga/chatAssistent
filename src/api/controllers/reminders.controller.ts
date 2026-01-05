/**
 * Controller de Reminders
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateReminderUseCase } from '@application/use-cases/reminders/create-reminder.use-case';
import { ListRemindersUseCase } from '@application/use-cases/reminders/list-reminders.use-case';
import { UpdateReminderUseCase } from '@application/use-cases/reminders/update-reminder.use-case';
import { DeleteReminderUseCase } from '@application/use-cases/reminders/delete-reminder.use-case';
import { CompleteReminderUseCase } from '@application/use-cases/reminders/complete-reminder.use-case';
import { CreateReminderDto, CreateReminderDtoSchema } from '@application/dto/create-reminder.dto';
import { UpdateReminderDto, UpdateReminderDtoSchema } from '@application/dto/update-reminder.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('reminders')
@UseGuards(JwtAuthGuard)
export class RemindersController {
  constructor(
    private readonly createReminderUseCase: CreateReminderUseCase,
    private readonly listRemindersUseCase: ListRemindersUseCase,
    private readonly updateReminderUseCase: UpdateReminderUseCase,
    private readonly deleteReminderUseCase: DeleteReminderUseCase,
    private readonly completeReminderUseCase: CompleteReminderUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateReminderDto,
  ) {
    const validatedDto = CreateReminderDtoSchema.parse(dto);
    const reminder = await this.createReminderUseCase.execute(user.sub, validatedDto);
    return this.mapToResponse(reminder);
  }

  @Get()
  async list(@CurrentUser() user: { sub: string }) {
    const reminders = await this.listRemindersUseCase.execute(user.sub);
    return reminders.map((reminder) => this.mapToResponse(reminder));
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
  ) {
    const reminders = await this.listRemindersUseCase.execute(user.sub);
    const reminder = reminders.find((r) => r.id === id);
    if (!reminder) {
      return null;
    }
    return this.mapToResponse(reminder);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Body() dto: UpdateReminderDto,
  ) {
    const validatedDto = UpdateReminderDtoSchema.parse(dto);
    const reminder = await this.updateReminderUseCase.execute(user.sub, id, validatedDto);
    return this.mapToResponse(reminder);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
  ) {
    await this.deleteReminderUseCase.execute(user.sub, id);
  }

  @Patch(':id/complete')
  async complete(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
  ) {
    const reminder = await this.completeReminderUseCase.execute(user.sub, id);
    return this.mapToResponse(reminder);
  }

  private mapToResponse(reminder: any) {
    return {
      id: reminder.id,
      userId: reminder.userId,
      title: reminder.title,
      description: reminder.description,
      reminderDate: reminder.reminderDate?.toISOString(),
      isRecurring: reminder.isRecurring,
      recurrenceRule: reminder.recurrenceRule,
      completed: reminder.completed,
      createdAt: reminder.createdAt?.toISOString(),
      updatedAt: reminder.updatedAt?.toISOString(),
      completedAt: reminder.completedAt?.toISOString(),
    };
  }
}

