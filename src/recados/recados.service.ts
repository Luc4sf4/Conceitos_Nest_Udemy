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
  constructor(
    //Cria o construtor
    @InjectRepository(Recado) //injeção de dependência do repositório falando a entidade
    private readonly recadoRepository: Repository<Recado>, //cira o recadoRepository passando o tipo Repository do TypeOrm passando o Recado da Entidade
  ) {}

  private lastId = 1;
  private recados: Recado[] = [
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

  /*
    Nesse método iremos buscar todos os recados, o método find ele busca todos
    os recados e retorna como se fosse um array dentro da variável recados
    pra isso a método deve ser assíncrona.
    Um método ou função async permite o uso de await dentro dele, o que 
    significa que ele pode esperar pela resolução de Promises (como chamadas de
    banco de dados, APIs externas, etc), sem bloquear a execução do restante do
    código.
    Em resumo, usamos `await` para esperar que a Promise com os dados seja resolvida
    antes de retornar o resultado.
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
  remove(id: number) {
    const recadoExistenteIndex = this.recados.findIndex(
      item => item.id === id, //acha o index do recado que estamos tentando apagar
    );

    if (recadoExistenteIndex < 0) {
      this.throwNotFundError();
    }

    const recado = this.recados[recadoExistenteIndex];

    this.recados.splice(recadoExistenteIndex, 1); //apaga o index da array

    return recado;
  }
}
