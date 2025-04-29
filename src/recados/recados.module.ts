import { Module, forwardRef } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils, RecadosUtilsMock } from './recado.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    forwardRef(() => PessoasModule),
  ],
  controllers: [RecadosController],
  providers: [
    {
      provide: RecadosUtils, // Token
      useValue: new RecadosUtilsMock(), // Valor a ser usado
      //useClass: RecadosUtils,
      //Geralmente o mock e usado para se escrever testes
    },
  ],
  exports: [RecadosUtils], //Caso a classe e o token tiverem o mesmo nome se utiliza assim
})
export class RecadosModule {}
