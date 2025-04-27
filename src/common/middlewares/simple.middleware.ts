// Cliente -> (servidor) -> Middleware (Request, Response)
// ->NestJs(Guard, Interceptors, pipes)

import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('SimpleMiddleware: Ola');

    // Terminando a cadeia de chamadas
    // return res.status(404).send({
    //   message: 'Nao encontrado',
    // });
    next();

    console.log('SimpleMiddleware: Tchau');

    res.on('finish', () => {
      console.log('SimpleMiddleware: Terminou');
    });
  }
}
