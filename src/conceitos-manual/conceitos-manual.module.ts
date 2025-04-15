import { Module } from '@nestjs/common';
import { ConeceitosManualController } from './conceitos-manual.controller';
//Maioria das classes precisa de um Decorator que seriam basicamente as anotacoes de cada classe, mudando o comportamento da classe, e geralmente
//fica em cima dos metodos
@Module({
  controllers: [ConeceitosManualController],
})
export class ConceitosManualModule {}
