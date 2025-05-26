/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Repository } from 'typeorm';
import { PessoasService } from './pessoas.service';
import { Pessoa } from './entities/pessoa.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { create } from 'node:domain';

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
          useValue: {
            create: jest.fn(), //função que vai te dar informações do determinado método
            save: jest.fn(), //função que vai te dar informações do determinado método
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(), //função que vai te dar informações do determinado método
          },
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
    it('deve criar uma nova pessoa', async () => {
      // CreatePessoaDto
      //Arrange
      const createpessoaDto: CreatePessoaDto = {
        email: 'lucas@email.com',
        name: 'Lucas',
        senha: '123456',
      };
      const passwordHash = 'HASHDESENHA';
      // Que o hashing service tenha o método hash
      // Saber se o hashing service foi chamado com o CreatePessoaDto
      // Saber se o pessoaRepository.create foi chamado com dados pessoa
      // Saber se o pessoaRepository.save foi chamado com a pessoa criada
      // O retorno final deve ser a nova pessoa criada -> expect

      jest.spyOn(hashingService, 'hash').mockResolvedValue('HASHDESENHA');
      //Act
      await pessoaService.create(createpessoaDto);

      expect(hashingService.hash).toHaveBeenCalledWith(createpessoaDto.senha); //.toHaveBeenCalled();

      expect(pessoaRepository.create).toHaveBeenCalledWith({
        nome: createpessoaDto.name,
        passwordHash,
        email: createpessoaDto.email,
      });
    });
  });
});
