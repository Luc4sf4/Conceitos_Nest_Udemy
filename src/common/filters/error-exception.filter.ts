import { Request } from 'express';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class ErrorExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    // se nao tiver status, retorna erro 400
    const statusCode = exception.getStatus ? exception.getStatus() : 400;
    const exceptionResponse = exception.getResponse
      ? exception.getResponse()
      : { message: 'Error', statusCode };

    response.status(statusCode).json({
      exceptionResponse,
      data: new Date().toISOString(),
      path: request.url,
    });
  }
}
