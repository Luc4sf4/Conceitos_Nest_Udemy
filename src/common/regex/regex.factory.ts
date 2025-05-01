/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OnlyLowercasesLettersRegex } from './only-lowercase-letters.regex copy';
import { RemoveSpacesRegex } from './remove-spaces.regex';
import { RegexInterface } from './regex.protocol';

//Pra saber quais classes com possibilidade de injetar na classe
export type ClassNames = 'OnlyLowercaseLettersRegex' | 'RemoveSpacesRegex';

// vai utilizar essa classe dentro do sistema de injeção de dependências do Nest
@Injectable()
export class RegexFactory {
  create(className: ClassNames): RegexInterface {
    switch (className) {
      case 'OnlyLowercaseLettersRegex':
        return new OnlyLowercasesLettersRegex();
      case 'RemoveSpacesRegex':
        return new RemoveSpacesRegex();
      default:
        throw new InternalServerErrorException(
          `No class found for ${className}`,
        );
    }
  }
}
