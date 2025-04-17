/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RecadosService } from './recados.service';

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

@Controller('recados') //decorator de classe
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  //@HttpCode(HttpStatus.NOT_FOUND) Decorator para mudar o codigo HTTP, podendo usar os numeros ou o Enum do HttpStatus
  @Get() //decorator de metodo
  findAll(@Query() pagination: any) {
    const { limit = 10, offset = 10 } = pagination;
    // return `essa rota retorna todos os recados Limit=${limit}, Offset=${offset}.`;
    return this.recadosService.findAll();
  }

  @Get(':id')
  findONe(@Param('id') id: string /*Decorator de funcao*/) {
    console.log(id);
    return this.recadosService.findOne(id);
  }

  /*Podemos pedir pro Nest nos retornar somente uma chave do Arquivo JSON
    Basta especificar dentro do decorator @Body, mas isso nao eh muito comum de se utilizar
    */
  @Post()
  create(@Body() body: any) {
    return this.recadosService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.recadosService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recadosService.remove(id);
  }
}
