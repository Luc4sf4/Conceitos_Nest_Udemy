/* eslint-disable @typescript-eslint/no-unused-vars */
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Repository } from 'typeorm';
import { PessoasService } from './pessoas.service';
import { Pessoa } from './entities/pessoa.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PessoasService', () => {
  let pessoaService: PessoasService;
  let pessoaRepository: Repository<Pessoa>;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoasService,
        {
          provide: getRepositoryToken(Pessoa),
          useValue: {},
        },
        {
          provide: HashingService,
          useValue: {},
        },
      ],
    }).compile();
    pessoaService = module.get<PessoasService>(PessoasService);
    pessoaRepository = module.get<Repository<Pessoa>>(
      getRepositoryToken(Pessoa),
    );
    hashingService = module.get<HashingService>(HashingService);
  });
  it('pessoaService deve estar definido', () => {
    expect(PessoasService).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma nova pessoa', () => {
      // CreatePessoaDto
      // Que o hashing service tenha o método hash
      // Saber se o hashing service foi chamado com o CreatePessoaDto
      // Saber se o pessoaRepository.create foi chamado com dados pessoa
      // Saber se o pessoaRepository.save foi chamado com a pessoa criada
      // O retorno final deve ser a nova pessoa criada -> expect
    });
  });
});
