import { Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigType } from '@nestjs/config';
import globalConfig from 'src/global-config/global.config';

@Controller('home') //Decorator definindo a classe como uma controller, podendo ate mesmo definir os recursos dentro do Decorator
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(globalConfig.KEY)
    private readonly globalConfiguration: ConfigType<typeof globalConfig>,
  ) {
    console.log(globalConfiguration);
  } //injeta o construtor de AppService

  //método da solicitação -> Ler (Read) -> cRud
  //podemos definir o outro recurso(ou URL, ja que cada Decorator de route deixa uma "/" caso esteja vazio) dentro desse decorator
  //ficaria -> /home/hello
  // @Get('hello')
  getHello(): string {
    return 'Qualquer Coisa';
  }

  //@Get('exemplo')
  exemplo() {
    return this.appService.solucionaExemplo();
  }
}
