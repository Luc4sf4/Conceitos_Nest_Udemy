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
import { ConflictException, NotFoundException } from '@nestjs/common';

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
            findOneBy: jest.fn(),
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
      //Arrange -- montando as coisas que eu vou precisar retornar la na frente
      const createpessoaDto: CreatePessoaDto = {
        email: 'lucas@email.com',
        name: 'Lucas',
        senha: '123456',
      };
      const passwordHash = 'HASHDESENHA';
      const novaPessoa = {
        id: 1,
        nome: createpessoaDto.name,
        passwordHash,
        email: createpessoaDto.email,
      };

      // Como o valor retornado por hashingService.service e necessário
      //vamos simular este valor.
      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);

      // Como a pessoa retornada por pessoaRepository e necessaria em
      // pessoaRepository.save. Vamos simular este valor
      jest.spyOn(pessoaRepository, 'create').mockReturnValue(novaPessoa as any);

      //Act
      const result = await pessoaService.create(createpessoaDto);

      //Assert
      // O método hashingService.hash foi chamado com o createPessoaDto.senha ?
      expect(hashingService.hash).toHaveBeenCalledWith(createpessoaDto.senha); //.toHaveBeenCalled();

      //O método pessoaRepository.create foi chamado com os dados da nova
      // pessoa com o hash de senha criado por hashingService.hash?
      expect(pessoaRepository.create).toHaveBeenCalledWith({
        nome: createpessoaDto.name,
        passwordHash,
        email: createpessoaDto.email,
      });

      // O método pessoaRepository.save foi chamado com os dados da nova
      // pessoa gerada por pessoaRepository.create ?
      expect(pessoaRepository.save).toHaveBeenCalledWith(novaPessoa);

      // O resultado do método pessoaService.create retornou a nova pessoa
      // criada ?
      expect(result).toEqual(novaPessoa);
    });

    it('deve lançar um ConflictException', async () => {
      //
      jest.spyOn(pessoaRepository, 'save').mockRejectedValue({
        code: '23505',
      });

      await expect(pessoaService.create({} as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve lançar um ConflictException', async () => {
      //
      jest
        .spyOn(pessoaRepository, 'save')
        .mockRejectedValue(new Error('Erro genérico'));

      await expect(pessoaService.create({} as any)).rejects.toThrow(
        new Error('Erro genérico'),
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar uma pessoa se a pessoa for encontrada', async () => {
      const pessoaId = 1;
      const pessoaEncontrada = {
        id: 1,
        nome: 'Lucas',
        email: 'lucas@email.com',
        passwordHash: '123456',
      };

      jest
        .spyOn(pessoaRepository, 'findOneBy')
        .mockResolvedValue(pessoaEncontrada as any);

      const result = await pessoaService.findOne(pessoaId);

      expect(result).toEqual(pessoaEncontrada);
    });

    it('deve retornar uma pessoa se a pessoa for encontrada', async () => {
      jest
        .spyOn(pessoaRepository, 'findOneBy')
        .mockResolvedValue(undefined as any);

      await expect(pessoaService.findOne(1)).rejects.toThrow(
        new NotFoundException('Pessoa nao encontrada'),
      );
    });
  });
});
