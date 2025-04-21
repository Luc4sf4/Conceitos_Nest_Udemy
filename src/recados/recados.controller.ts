import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';

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

//DTO - Data Transfer Object -> Objeto de transferência de dados
//DTO - Objeto simples -> Em nest usado para:  Validar / transformar dados

@Controller('recados') //decorator de classe
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  //@HttpCode(HttpStatus.NOT_FOUND) Decorator para mudar o código HTTP, podendo usar os números ou o Enum do HttpStatus
  @Get() //decorator de método
  findAll() {
    return this.recadosService.findAll();
  }

  @Get(':id')
  findONe(@Param('id', ParseIntPipe) id: number /*Decorator de função*/) {
    console.log(id);
    return this.recadosService.findOne(id);
  }

  /*Podemos pedir pro Nest nos retornar somente uma chave do Arquivo JSON
    Basta especificar dentro do decorator @Body, mas isso nao eh muito comum de 
    se utilizar
    */
  @Post()
  create(@Body() createRecadoDto: CreateRecadoDto) {
    return this.recadosService.create(createRecadoDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRecadoDto: UpdateRecadoDto) {
    return this.recadosService.update(id, updateRecadoDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe /*transforma o string em inteiro */) id: number,
  ) {
    return this.recadosService.remove(id);
  }
}
