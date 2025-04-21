/* eslint-disable @typescript-eslint/await-thenable */
import { CreateRecadoDto } from './dto/create-recado.dto';

import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/*
quando usar o async ? quando o método retornar uma promise, por exemplo?
Operações com banco de dados, usando https/Apis externas, Delay, timeouts e etc

*/

@Injectable()
export class RecadosService {
  //Cria o construtor
  constructor(
    //injeção de dependência do repositório falando a entidade
    @InjectRepository(Recado)
    //cira o recadoRepository passando o tipo Repository do TypeOrm passando
    //o Recado da Entidade
    private readonly recadoRepository: Repository<Recado>,
  ) {}
  throwNotFundError() {
    throw new NotFoundException('Recado nao encontrado');
  }

  /*
    Nesse método iremos buscar todos os recados, o método find ele busca todos
    os recados e retorna como se fosse um array dentro da variável recados
    pra isso a método deve ser assíncrona.
    Um método ou função async permite o uso de await dentro dele, o que 
    significa que ele pode esperar pela resolução de Promises (como chamadas de
    banco de dados, APIs externas, etc), sem bloquear a execução do restante do
    código.
    Em resumo, usamos `await` para esperar que a Promise com os dados seja 
    resolvida antes de retornar o resultado.
  */
  async findAll() {
    const recados = await this.recadoRepository.find();
    return recados;
  }

  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: {
        id,
      },
    });
    if (recado) return recado;
    this.throwNotFundError();
  }
  async create(createRecadoDto: CreateRecadoDto) {
    const novoRecado = {
      ...createRecadoDto,
      lido: false,
      data: new Date(),
    }; //recebe o json desejado
    //adiciona no array
    const recado = await this.recadoRepository.create(novoRecado);
    return this.recadoRepository.save(recado); //retorna mostrando o JSON
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto) {
    const partialUpdateRecadoDto = {
      lido: updateRecadoDto?.lido,
      text: updateRecadoDto?.texto,
    }; //utilizando para selecionar quais campos em especifico que
    //podemos alterar
    const recado = await this.recadoRepository.preload({
      //pre carrega os campos que iremos atualizar pegando ele com as
      // atualizações que iremos receber
      id,
      ...partialUpdateRecadoDto,
    });
    if (!recado) return this.throwNotFundError(); //se recado nao existir
    return this.recadoRepository.save(recado);
  }
  async remove(id: number) {
    const recado = await this.recadoRepository.findOneBy({
      id,
    });

    if (!recado) return this.throwNotFundError();
    await this.recadoRepository.remove(recado);
    return recado;
  }
}
