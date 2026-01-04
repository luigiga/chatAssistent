/**
 * Exception Filter para erros do Zod
 * Converte erros de validação do Zod em respostas HTTP 400
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errors = exception.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Erro de validação',
      errors,
    });
  }
}

