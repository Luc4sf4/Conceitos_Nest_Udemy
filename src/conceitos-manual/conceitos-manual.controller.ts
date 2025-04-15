import { Controller, Get } from '@nestjs/common';
import { ConceitosManualServices } from './conceitos-manual.service';

@Controller('conceitos-manual')
export class ConeceitosManualController {
  //chamar o construtor, falar que ele eh uma variavel privada apenas pra leitura, definir o nome da variavel e dps a classe na qual ele representa
  constructor(
    private readonly conceitosManualService: ConceitosManualServices,
  ) {}

  @Get()
  home(): string {
    return this.conceitosManualService.solucionaHome();
  }
}
