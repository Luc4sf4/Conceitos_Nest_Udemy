import { CreateRecadoDto } from './dto/create-recado.dto';
import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
/*
quando usar o async ? quando o método retornar uma promise, por exemplo?
Operações com banco de dados, usando https/Apis externas, Delay, timeouts e etc

*/

/**
 * Instanciar uma classe: você faz tudo na mão. O Nest só olha,
 *  não participa, não ajuda, não injeta, não controla ciclo de vida.

  Injeção de dependência: você só declara o que precisa, e o 
  Nest faz todo o trampo pesado por trás — resolve dependências, cuida do escopo,
  facilita testes, e integra tudo com o restante do ecossistema 
  (pipes, interceptors, guards, filters...). 
 */

//Scope.DEFAULT -> o provider em questão e um singleton (quando a aplicação inicia ela inicia e mantém a instancia)
//Scope.REQUEST -> o provider em questão e instanciado a cada requisição (inicia a cada chamado)
//Scope.TRANSIENT -> Criada uma instancia do provider para cada classe que injetar esse provider

@Injectable({ scope: Scope.DEFAULT }) //qualquer classe que tem esta annotations, pode participar do sistema de injeção de dependência
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
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const recados = await this.recadoRepository.find({
      take: limit, // quantos registros serão exibidor (por pagina)
      skip: offset, // quantos registros devem ser pulados (por pagina)
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
    const recado = this.recadoRepository.create(novoRecado);
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
