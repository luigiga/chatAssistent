/**
 * Controller de Health Check
 */
import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';

@Controller()
export class HealthController {
  @Public()
  @Get()
  getHealth() {
    return {
      status: 'ok',
      message: 'Lumeo API is running',
      version: '1.0.0',
      endpoints: {
        auth: {
          register: 'POST /auth/register',
          login: 'POST /auth/login',
          refresh: 'POST /auth/refresh',
          logout: 'POST /auth/logout',
        },
        interpret: {
          interpret: 'POST /interpret',
        },
        tasks: {
          list: 'GET /tasks',
          create: 'POST /tasks',
          get: 'GET /tasks/:id',
          update: 'PATCH /tasks/:id',
          delete: 'DELETE /tasks/:id',
          complete: 'PATCH /tasks/:id/complete',
        },
        notes: {
          list: 'GET /notes',
          create: 'POST /notes',
          get: 'GET /notes/:id',
          update: 'PATCH /notes/:id',
          delete: 'DELETE /notes/:id',
        },
        reminders: {
          list: 'GET /reminders',
          create: 'POST /reminders',
          get: 'GET /reminders/:id',
          update: 'PATCH /reminders/:id',
          delete: 'DELETE /reminders/:id',
          complete: 'PATCH /reminders/:id/complete',
        },
      },
    };
  }

  @Public()
  @Get('health')
  getHealthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

