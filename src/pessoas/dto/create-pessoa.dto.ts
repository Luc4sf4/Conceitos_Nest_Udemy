import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePessoaDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  readonly name?: string;

  @IsEmail()
  readonly email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  readonly senha: string;
}
