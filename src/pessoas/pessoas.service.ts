import { TokenPayLoadDto } from './../auth/dto/token-payload.dto';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Pessoa } from './entities/pessoa.entity';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import * as path from 'path';
import * as fs from 'fs/promises';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
@Injectable({ scope: Scope.DEFAULT })
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
    const pessoas = await this.pessoaRepository.find({
      order: {
        id: 'desc',
      },
    });
    return pessoas;
  }

  async findOne(id: number) {
    this.count++;
    const pessoa = await this.pessoaRepository.findOneBy({
      id,
    });
    if (!pessoa) throw new NotFoundException('Pessoa nao encontrada');
    return pessoa;
  }

  async update(
    id: number,
    updatePessoaDto: UpdatePessoaDto,
    tokenPayload: TokenPayLoadDto,
  ) {
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

    if (pessoa.id !== tokenPayload.sub) {
      throw new ForbiddenException('Voce nao e essa pessoa');
    }

    return this.pessoaRepository.save(pessoa);
  }

  async remove(id: number, tokenPayload: TokenPayLoadDto) {
    const pessoa = await this.pessoaRepository.findOneBy({
      id,
    });

    if (!pessoa) throw new NotFoundException('Pessoa nao encontrada ');

    if (pessoa.id !== tokenPayload.sub) {
      throw new ForbiddenException('Voce nao e essa pessoa');
    }

    await this.pessoaRepository.remove(pessoa);
    return pessoa;
  }

  async uploadPicture(
    file: Express.Multer.File,
    @TokenPayloadParam() tokenPayload: TokenPayLoadDto,
  ) {
    if (file.size > 1024) {
      throw new BadRequestException('File too small');
    }

    const pessoa = await this.findOne(tokenPayload.sub);

    const fileExtension = path
      .extname(file.originalname)
      .toLowerCase()
      .substring(1);
    const fileName = `${tokenPayload.sub}.${fileExtension}`;
    const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);

    await fs.writeFile(fileFullPath, file.buffer);

    pessoa.picture = fileName;
    await this.pessoaRepository.save(pessoa);

    return {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      buffer: {},
      size: file.size,
    };
  }
}
