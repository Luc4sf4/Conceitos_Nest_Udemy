import { Injectable } from '@nestjs/common';

@Injectable()
export class ConceitosManualServices {
  solucionaHome(): string {
    return 'Home do Conceitos Manual Solucionada. ';
  }
}
