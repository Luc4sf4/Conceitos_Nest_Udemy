import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConceitosManualModule } from 'src/conceitos-manual/conceitos-manual.module';
import { ConceitosAutomaticoModule } from 'src/conceitos-automatico/conceitos-automatico.module';

@Module({
  imports: [ConceitosManualModule, ConceitosAutomaticoModule],
  controllers: [AppController], //-> quem controla os request e as responses, onde pode ter as services utilizados para aplicar a logica de negocios
  providers: [AppService], // -> usado para injetar dependencias
  exports: [],
})
export class AppModule {}
