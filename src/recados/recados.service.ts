import { CreateRecadoDto } from './dto/create-recado.dto';

import { Injectable, NotFoundException } from '@nestjs/common';
import { RecadoEntity } from './entities/recado.entity';
import { UpdateRecadoDto } from './dto/update-recado.dto';

@Injectable()
export class RecadosService {
  private lastId = 1;
  private recados: RecadoEntity[] = [
    {
      id: 1,
      texto: 'Este e um recado teste',
      de: 'Joana',
      para: 'João',
      lido: false,
      data: new Date(),
    },
  ];

  throwNotFundError() {
    throw new NotFoundException('Recado nao encontrado');
  }
  findAll() {
    return this.recados; //lista todos os recados, mais em especifico o array mencionado
  }
  findOne(id: string) {
    const recado = this.recados.find(item => item.id === +id); //procura por Id, informado no parametro e busca o json e monta pra gente
    if (recado) return recado;
    //throw new HttpException('Recado nao encontrado', HttpStatus.NOT_FOUND);
    this.throwNotFundError();
  }
  create(createRecadoDto: CreateRecadoDto) {
    this.lastId++; //adiciona um numero da sequencia de id
    const id = this.lastId; //relaciona a constante id com o lastId
    const novoRecado = {
      id,
      ...createRecadoDto,
      lido: false,
      data: new Date(),
    }; //recebe o json desejado
    this.recados.push(novoRecado); //adiciona no array

    return novoRecado; //retorna mostrando o JSON
  }

  update(id: string, updateRecadoDto: UpdateRecadoDto) {
    const recadoExistenteIndex = this.recados.findIndex(
      item => item.id === +id, //acha o index do recado que estamos tentando apagar
    );
    if (recadoExistenteIndex < 0) {
      this.throwNotFundError();
    }
    const recadoExistente = this.recados[recadoExistenteIndex]; // encontra o recado que estamos procurando
    this.recados[recadoExistenteIndex] = {
      ...recadoExistente,
      ...updateRecadoDto,
    }; //troca as chaves do recado existente para o recado que desejamos atualizar
  }
  remove(id: string) {
    const recadoExistenteIndex = this.recados.findIndex(
      item => item.id === +id, //acha o index do recado que estamos tentando apagar
    );

    if (recadoExistenteIndex < 0) {
      this.throwNotFundError();
    }

    const recado = this.recados[recadoExistenteIndex];

    this.recados.splice(recadoExistenteIndex, 1); //apaga o index da array

    return recado;
  }
}
