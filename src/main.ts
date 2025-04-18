/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove chaves que nao estão no DTO, prevenindo assim de injeções ou ataque hackers
      forbidNonWhitelisted: true, // levanta erro quando a chave nao existir no DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
