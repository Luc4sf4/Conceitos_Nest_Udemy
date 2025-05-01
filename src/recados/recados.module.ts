/* eslint-disable no-constant-condition */
import { Module, forwardRef } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils, RecadosUtilsMock } from './recado.utils';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
  SERVER_NAME,
} from 'src/recados/recados.constant';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { OnlyLowercasesLettersRegex } from 'src/common/regex/only-lowercase-letters.regex copy';

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
    // {
    //   // nao pode usar provide para interface, por isso usamos a classe abstrata
    //   provide: RegexProtocol,
    //   // 1 === 1 -> true
    //   // 1 !== 1 -> false
    //   useClass: 1 === 1 ? RemoveSpacesRegex : OnlyLowercasesLettersRegex,
    // },
    {
      provide: ONLY_LOWERCASE_LETTERS_REGEX,
      useClass: OnlyLowercasesLettersRegex,
    },
    {
      provide: REMOVE_SPACES_REGEX,
      useClass: RemoveSpacesRegex,
    },
  ],
  exports: [RecadosUtils, SERVER_NAME], //Caso a classe e o token tiverem o mesmo nome se utiliza assim
})
export class RecadosModule {}
