import { PartialType } from '@nestjs/mapped-types';
import { CreateRecadoDto } from './create-recado.dto';
import { IsBoolean, IsOptional } from 'class-validator';

//? -> opcional o envio das chaves
export class UpdateRecadoDto extends PartialType(CreateRecadoDto) {
  //importando tudo do CreateRecadoDto e deixando tudo optional/opcional
  //podemos sobrescrever ou adicionar coisas obrigatórias que nao estão na classe do CreateRecado DTO
  @IsBoolean()
  @IsOptional()
  readonly lido?: boolean;
}
