import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

//Uma boa pratica seria colocar o readonly, pq a gente vai usar somente para a leitura, nao queremos alterar os dados
export class CreateRecadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  readonly texto: string;

  @IsNumber()
  deId: number;

  @IsNumber()
  paraId: number;
}
