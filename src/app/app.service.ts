import { Injectable } from '@nestjs/common';

@Injectable() //indica pro nest que a classe e injetável, ou seja, se torna uma service
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  solucionaExemplo() {
    return 'exemplo usa o service';
  }
}
