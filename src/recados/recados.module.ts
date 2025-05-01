import { Module, forwardRef } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils } from './recado.utils';
import { RecadosService } from './recados.service';
import { RegexFactory } from 'src/common/regex/regex.factory';
// import { MyDynamicModule } from 'src/my-dynamic/my-dynamic.module';

// possibilidade de usar o factory, ja que e uma função
// const createRegexClass = () => {
//   //Meu código/logica
//    return new RemoveSpacesRegex();
// };
@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    forwardRef(() => PessoasModule),
    // MyDynamicModule.register({
    //   apiKey: 'Aqui vem a API Key',
    //   apiUrl: 'http://blablabla.blag',
    // }),
  ],
  controllers: [RecadosController],
  providers: [RecadosService, RecadosUtils, RegexFactory],
  exports: [RecadosUtils],
})
export class RecadosModule {}
