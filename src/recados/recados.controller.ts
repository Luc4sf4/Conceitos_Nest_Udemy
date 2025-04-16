import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

/**
 CRUD
 Create -> Post -> criar um recado
 Read -> Get -> lendo um recado 
 Read -> Get -> lendo todos os recados
 Update -> Put/Patch -> atualizar um recado 
 Delete -> DELETE -> Apagar um recado
 */

// Patch utilizado para atualizar dados de um recurso
// Put utilizado para atualizar um recurso inteiro

@Controller('recados')//decorator de classe
export class RecadosController {

    @HttpCode(HttpStatus.NOT_FOUND)//Decorator para mudar o codigo HTTP, podendo usar os numeros ou o Enum do HttpStatus
    @Get()//decorator de metodo
    findAll(){
        return 'essa rota retorna todos os recados'
    }

    @Get(':id')
    findONe(@Param('id') id: String /*Decorator de funcao*/){
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

    @Patch(':id')
    update(@Param('id') id: string, @Body() body : any){
        return{
            id,
             body
        }
    }

}
