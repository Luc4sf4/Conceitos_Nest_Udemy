import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('home') //Decorator definindo a classe como uma controller, podendo ate mesmo definir os recursos dentro do Decorator
export class AppController {
  constructor(private readonly appService: AppService) {} //injeta o construtor de AppService

  //Metodo da solicitacao -> Ler (Read) -> cRud
  //podemos definir o outro recurso(ou URL, ja que cada Decorator de route deixa uma "/" caso esteja vazio) dentro desse decorator
  //ficaria -> /home/hello
  @Get('hello')
  getHello(): string {
    return 'Qualquer Coisa';
  }

  @Get('exemplo')
  exemplo() {
    return this.appService.solucionaExemplo;
  }
}
