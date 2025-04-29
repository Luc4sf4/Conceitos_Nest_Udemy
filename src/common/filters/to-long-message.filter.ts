/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';

export class ToLongMessage implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const response = context.getResponse();
    const request = context.getRequest();

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    //pegando o campo texto que vai vir no body
    const texto = request.body?.texto;
    if (texto && texto.length > 500) {
      return response.status(400).json({
        message: 'Texto muito grande ultrapassando a marca dos 500 caracteres',
        statusCode: 400,
        date: new Date().toISOString(),
      });
    }
    const error =
      typeof response === 'string'
        ? {
            message: exceptionResponse,
          }
        : (exceptionResponse as object);
    response.status(statusCode).json({
      ...error,
      statusCode,
      exceptionResponse,
      data: new Date().toISOString(),
    });
  }
}
