import { Controller, Get } from '@nestjs/common';

@Controller('conceitos-manual')
export class ConeceitosManualController {
  @Get()
  home(): string {
    return 'conceitos-manual';
  }
}
