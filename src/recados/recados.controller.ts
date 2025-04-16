import { Controller, Get, Param } from '@nestjs/common';

@Controller('recados')//decorator de classe
export class RecadosController {

    @Get()//decorator de metodo
    findAll(){
        return 'essa rota retorna todos os recados'
    }

    @Get(':id')
    findONe(@Param('id') id: String)/*Decorator de funcao*/{
        console.log(id);
        return `Essa rota retorna o recado ID ${id}`;
    }

}
