import { Body, Controller, Get, Param, Post } from '@nestjs/common';

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

    /*Podemos pedir pro Nest nos retornar somente uma chave do Arquivo JSON
    Basta especificar dentro do decorator @Body, mas isso nao eh muito comum de se utilizar
    */
    @Post()
    create(@Body('recado') body: any){
        return body;
    }

}
