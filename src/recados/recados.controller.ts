import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayLoadDto } from 'src/auth/dto/token-payload.dto';
import { RoutePolicyGuard } from 'src/auth/guards/route-policy.guard';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';
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

@UseGuards(RoutePolicyGuard)
@Controller('recados') //decorator de classe
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  //@HttpCode(HttpStatus.NOT_FOUND) Decorator para mudar o código HTTP, podendo usar os números ou o Enum do HttpStatus
  @Get() //decorator de método
  @SetRoutePolicy(RoutePolicies.findAllRecados)
  async findAll(@Query() paginationDto: PaginationDto) {
    const recado = await this.recadosService.findAll(paginationDto);
    return recado;
  }
  @Get(':id')
  findONe(@Param('id') id: number /*Decorator de função*/) {
    console.log(id);
    return this.recadosService.findOne(id);
  }

  /*Podemos pedir pro Nest nos retornar somente uma chave do Arquivo JSON
    Basta especificar dentro do decorator @Body, mas isso nao eh muito comum de 
    se utilizar
    */
  @UseGuards(AuthTokenGuard)
  @Post()
  create(
    @Body() createRecadoDto: CreateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayLoadDto,
  ) {
    return this.recadosService.create(createRecadoDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRecadoDto: UpdateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayLoadDto,
  ) {
    return this.recadosService.update(id, updateRecadoDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayLoadDto,
  ) {
    return this.recadosService.remove(id, tokenPayload);
  }
}
