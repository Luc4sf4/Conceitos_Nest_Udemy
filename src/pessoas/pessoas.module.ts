import { Module } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { PessoasController } from './pessoas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';

/**Dependência circular seria quando um modulo importa o outro modulo
 * e o outro modulo esta importando o mesmo modulo e fica circulando e acaba
 * confundindo o Nest
 */
@Module({
  imports: [TypeOrmModule.forFeature([Pessoa])],
  controllers: [PessoasController],
  providers: [PessoasService],
  exports: [PessoasService], // ao importar este modulo em outro modulo,
})
export class PessoasModule {}
