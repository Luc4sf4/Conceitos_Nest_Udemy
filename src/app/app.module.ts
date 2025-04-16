import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';

@Module({
  imports: [RecadosModule],
  controllers: [AppController], //-> quem controla os request e as responses
  providers: [AppService], // -> usado para injetar dependencias  onde pode ter as services utilizados para aplicar a logica de negocios
  exports: [],
})
export class AppModule {}
