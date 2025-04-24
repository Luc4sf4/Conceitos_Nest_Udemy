/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // transformando os dados, e nao transformando eles
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }
    //transformando os dados
    const parsedValue = Number(value);

    //validando se os dados vieram de uma string numérica
    if (isNaN(parsedValue)) {
      throw new BadRequestException(
        'ParseIntIdPipe espera uma string numérica',
      );
    }

    //validando se os dados sao maiores que zero
    if (parsedValue < 0) {
      throw new BadRequestException(
        'ParseIntIdPipe espera um numero mais que zero',
      );
    }

    console.log('Pipe value', value);
    console.log('Pipe metadata', metadata);

    //Retornando o valor transformado
    return parsedValue;
  }
}
