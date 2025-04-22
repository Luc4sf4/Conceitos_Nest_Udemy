/* eslint-disable @typescript-eslint/await-thenable */
import { CreateRecadoDto } from './dto/create-recado.dto';

import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';

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
    private readonly pessoasService: PessoasService,
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
    const recados = await this.recadoRepository.find({
      relations: ['de', 'para'],
      order: {
        id: 'desc',
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
    return recados;
  }

  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: {
        id,
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
    if (!recado) throw new NotFoundException('Recado nao encontrado');
    return recado;
  }
  async create(createRecadoDto: CreateRecadoDto) {
    const { deId, paraId } = createRecadoDto;
    //Encontrar a pessoa que esta criando o recado
    const de = await this.pessoasService.findOne(deId);
    //Encontrar a pessoa que esta recebendo o recado
    const para = await this.pessoasService.findOne(paraId);

    const novoRecado = {
      texto: createRecadoDto.texto,
      de,
      para,
      lido: false,
      data: new Date(),
    }; //recebe o json desejado
    //adiciona no array
    const recado = await this.recadoRepository.create(novoRecado);
    await this.recadoRepository.save(recado);
    return {
      ...recado,
      de: {
        id: recado.de.id,
      },
      para: {
        para: recado.para.id,
      },
    }; //retorna mostrando o JSON com os campos especificados
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto) {
    const recado = await this.findOne(id);

    recado.texto = updateRecadoDto?.texto ?? recado.texto;
    recado.lido = updateRecadoDto?.lido ?? recado.lido;

    await this.recadoRepository.save(recado);
    return recado;
  }
  async remove(id: number) {
    //procura o id na tabela
    const recado = await this.recadoRepository.findOneBy({
      id,
    });
    // se nao achar o id, joga erro
    if (!recado) return this.throwNotFundError();
    //faz com que seja removido na tabela
    await this.recadoRepository.remove(recado);
    //retorna
    return recado;
  }
}
