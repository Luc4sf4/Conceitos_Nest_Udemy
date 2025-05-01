import { Module, forwardRef } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils } from './recado.utils';
import { RecadosService } from './recados.service';
import { RegexFactory } from 'src/common/regex/regex.factory';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
} from './recados.constant';

// possibilidade de usar o factory, ja que e uma função
// const createRegexClass = () => {
//   //Meu código/logica
//    return new RemoveSpacesRegex();
// };
@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    forwardRef(() => PessoasModule),
  ],
  controllers: [RecadosController],
  providers: [
    RecadosService,
    RecadosUtils,
    RegexFactory,
    {
      provide: REMOVE_SPACES_REGEX, // token
      //retorna uma função que retorna o que voce quer
      useFactory: (regexFactory: RegexFactory) => {
        //Meu código/logica
        return regexFactory.create('RemoveSpacesRegex');
      },
      //Factory
      inject: [RegexFactory], // injetando na factory na ordem
    },
    {
      provide: ONLY_LOWERCASE_LETTERS_REGEX, // token
      //retorna uma função que retorna o que voce quer
      useFactory: (regexFactory: RegexFactory) => {
        //Meu código/logica
        return regexFactory.create('OnlyLowercaseLettersRegex');
      },
      //Factory
      inject: [RegexFactory], // injetando na factory na ordem
    },
  ],
  exports: [RecadosUtils],
})
export class RecadosModule {}
