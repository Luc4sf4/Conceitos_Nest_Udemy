import { Injectable } from '@nestjs/common';

@Injectable()
export class RecadosUtils {
  inverteString(str: string) {
    console.log(' nao e mock');
    return str.split('').reverse().join('');
  }
}

// pensar que o mock vai fingir ser a classe original
@Injectable()
export class RecadosUtilsMock {
  inverteString() {
    console.log('Passei pelo mock');
    return 'bla bla bla';
  }
}
