import { Controller, Get, Param } from '@nestjs/common';

@Controller('recados')
export class RecadosController {

    @Get()
    findAll(){
        return 'essa rota retorna todos os recados'
    }

    @Get(':id')
    findONe(){
        return 'Essa rota retorna Um recado'
    }

}
