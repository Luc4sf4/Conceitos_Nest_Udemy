import { Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { APP_FILTER } from '@nestjs/core';
import { ToLongMessage } from 'src/common/filters/to-long-message.filter';

@Module({
  imports: [TypeOrmModule.forFeature([Recado]), PessoasModule],
  controllers: [RecadosController],
  providers: [
    RecadosService,
    {
      provide: APP_FILTER,
      useClass: ToLongMessage,
    },
  ],
})
export class RecadosModule {}
