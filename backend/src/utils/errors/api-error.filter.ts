import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import ApiError from 'src/utils/errors/api-error.utils';

@Catch(ApiError)
export class ApiErrorFilter implements ExceptionFilter {
  catch(exception: ApiError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = exception.code || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.code
      ? exception.message
      : 'Something went wrong!';

    response.status(statusCode).json({
      code: statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
