// Cliente -> (servidor) -> Middleware (Request, Response)
// ->NestJs(Guard, Interceptors, pipes)

import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class OutroMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('OutroMiddleware: Ola');

    // Terminando a cadeia de chamadas
    // return res.status(404).send({
    //   message: 'Nao encontrado',
    // });
    /*return termina a função da classe*/ next(); //Proximo middleware

    console.log('OutroMiddleware: Tchau');

    res.on('finish', () => {
      console.log('OutroMiddleware: Terminou');
    });
  }
}
