/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Pessoa } from './entities/pessoa.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';

@Injectable({ scope: Scope.TRANSIENT })
export class PessoasService {
  private count = 0;
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService,
  ) {
    this.count++;
    console.log(`PessoaService foi iniciado ${this.count} vezes`);
  }

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createPessoaDto.senha,
      );

      const novaPessoa = {
        nome: createPessoaDto.name,
        passwordHash,
        email: createPessoaDto.email,
      };
      const pessoa = this.pessoaRepository.create(novaPessoa); //cria a pessoa
      await this.pessoaRepository.save(pessoa); //salva a pessoa no banco de dados
      return pessoa;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('email ja cadastrado');
      }
      throw error;
    }
  }
  async findAll() {
    const pessoas = await this.pessoaRepository.find();
    return pessoas;
  }

  async findOne(id: number) {
    this.count++;
    console.log(`PessoaService ${this.count} - findOne`);

    const pessoa = await this.pessoaRepository.findOne({
      where: {
        id,
      },
    });

    if (!pessoa) throw new NotFoundException('Pessoa nao encontrada ');

    return pessoa;
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const dadosPessoa = {
      nome: updatePessoaDto?.name,
    };

    if (updatePessoaDto?.senha) {
      const passwordHash = await this.hashingService.hash(
        updatePessoaDto.senha,
      );

      dadosPessoa['passwordHash'] = passwordHash;
    }

    const pessoa = await this.pessoaRepository.preload({
      id,
      ...dadosPessoa,
    });

    if (!pessoa) throw new NotFoundException('Pessoa nao encontrada ');

    return this.pessoaRepository.save(pessoa);
  }

  async remove(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({
      id,
    });

    if (!pessoa) throw new NotFoundException('Pessoa nao encontrada ');

    await this.pessoaRepository.remove(pessoa);
    return pessoa;
  }
}
