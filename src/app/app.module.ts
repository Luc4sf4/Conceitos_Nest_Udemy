import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { SimpleMiddleware } from 'src/common/middlewares/simple.middleware';
import { APP_FILTER } from '@nestjs/core';
import { MyExceptionFilter } from 'src/common/filters/my-exception.filter';
import { ErrorExceptionFilter } from 'src/common/filters/error-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'postgres',
      password: 'admin',
      autoLoadEntities: true, // carrega entidades sem precisar especifica-las
      synchronize: true, //sincroniza com o BD. nao deve ser usado em produção
    }),
    RecadosModule,
    PessoasModule,
  ],
  controllers: [AppController], //-> quem controla os request e as responses
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    },
  ], // -> usado para injetar dependências  onde pode ter as services utilizados para aplicar a logica de negócios
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
