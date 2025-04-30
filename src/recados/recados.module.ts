import { Module, forwardRef } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils, RecadosUtilsMock } from './recado.utils';
import { SERVER_NAME } from 'src/common/constants/server-name.constant';

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
    {
      provide: SERVER_NAME,
      useValue: 'My name is NestJS',
    },
  ],
  exports: [RecadosUtils, SERVER_NAME], //Caso a classe e o token tiverem o mesmo nome se utiliza assim
})
export class RecadosModule {}
