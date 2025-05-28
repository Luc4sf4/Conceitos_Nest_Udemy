import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';

export default (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove chaves que nao estão no DTO, prevenindo assim de injeções ou ataque hackers
      forbidNonWhitelisted: true, // levanta erro quando a chave nao existir no DTO
      transform: false, //tenta transformar os tipos de dados de param para DTO
    }),
    new ParseIntIdPipe(),
  );

  return app;
};
