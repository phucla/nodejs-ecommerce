// Standard library
import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Class help create a custom exception filter
 */
@Catch(HttpException)
export class CsExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      messsge: exception.message,
    });
  }
}
