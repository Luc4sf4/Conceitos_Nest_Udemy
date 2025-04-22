/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Pessoa } from './entities/pessoa.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
  ) {}

  async create(createPessoaDto: CreatePessoaDto) {
    try{ 
      const novaPessoa = {
        nome: createPessoaDto.name,
        passwordHash: createPessoaDto.senha,
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
  findAll() {
    return `This action returns all pessoas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pessoa`;
  }

  update(id: number, updatePessoaDto: UpdatePessoaDto) {
    return `This action updates a #${id} pessoa`;
  }

  remove(id: number) {
    return `This action removes a #${id} pessoa`;
  }
}
