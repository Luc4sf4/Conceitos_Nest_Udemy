/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */

import { HashingService } from 'src/auth/hashing/hashing.service';
import { Repository } from 'typeorm';
import { PessoasService } from './pessoas.service';
import { Pessoa } from './entities/pessoa.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('PessoasService', () => {
  let pessoasService: PessoasService;
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
            find: jest.fn(),
            preload: jest.fn(),
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
    pessoasService = module.get<PessoasService>(PessoasService);
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
      const result = await pessoasService.create(createpessoaDto);

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

      await expect(pessoasService.create({} as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve lançar um erro generico quando um erro for lancado', async () => {
      //
      jest
        .spyOn(pessoaRepository, 'save')
        .mockRejectedValue(new Error('Erro genérico'));

      await expect(pessoasService.create({} as any)).rejects.toThrow(
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

      const result = await pessoasService.findOne(pessoaId);

      expect(result).toEqual(pessoaEncontrada);
    });

    it('deve retornar uma pessoa se a pessoa nao for encontrada', async () => {
      jest
        .spyOn(pessoaRepository, 'findOneBy')
        .mockResolvedValue(undefined as any);

      await expect(pessoasService.findOne(1)).rejects.toThrow(
        new NotFoundException('Pessoa nao encontrada'),
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar todas as pessoas encontradas', async () => {
      const pessoasMock: Pessoa[] = [
        {
          id: 1,
          nome: 'Lucas',
          email: 'lucas@email.com',
          passwordHash: '123456',
        } as Pessoa,
      ];

      jest.spyOn(pessoaRepository, 'find').mockResolvedValue(pessoasMock);

      const result = await pessoasService.findAll();

      expect(result).toEqual(pessoasMock);
      expect(pessoaRepository.find).toHaveBeenCalledWith({
        order: {
          id: 'desc',
        },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar uma pessoa se for autorizado', async () => {
      //Arrange
      const pessoaId = 1;
      const updatePessoaDto = { name: 'Joana', senha: '654321' };
      const tokenPayload = { sub: pessoaId } as any;
      const passwordHash = 'HASHDESENHA';
      const updatedPessoa = { id: pessoaId, nome: 'Joana', passwordHash };

      jest.spyOn(hashingService, 'hash').mockResolvedValueOnce(passwordHash);
      jest
        .spyOn(pessoaRepository, 'preload')
        .mockResolvedValue(updatedPessoa as any);
      jest
        .spyOn(pessoaRepository, 'save')
        .mockResolvedValue(updatedPessoa as any);

      //Act
      const result = await pessoasService.update(
        pessoaId,
        updatePessoaDto,
        tokenPayload,
      );

      expect(result).toEqual(updatedPessoa);
      // expect(hashingService.hash).toHaveBeenCalledWith(updatePessoaDto.senha);
      expect(hashingService.hash).toHaveBeenCalledWith(updatePessoaDto.senha);
      expect(pessoaRepository.preload).toHaveBeenCalledWith({
        id: pessoaId,
        nome: updatePessoaDto.name,
        passwordHash,
      });
      expect(pessoaRepository.save).toHaveBeenCalledWith(updatedPessoa);
    });
  });

  it('deve lançar um ForbiddenException se usuário nao autorizado', async () => {
    //Arrange
    const pessoaId = 1; // Usuário certo (ID 1)
    const tokenPayload = { sub: 2 } as any; // Usuário diferente (ID 2)
    const updatePessoaDto = { name: 'Jane Doe' };
    const existingPessoa = { id: pessoaId, nome: 'John Doe' };
    jest
      .spyOn(pessoaRepository, 'preload')
      .mockResolvedValue(existingPessoa as any);

    await expect(
      pessoasService.update(pessoaId, updatePessoaDto, tokenPayload),
    ).rejects.toThrow(ForbiddenException);
  });

  it('deve lançar um ForbiddenException se usuário nao autorizado', async () => {
    //Arrange
    const pessoaId = 1;
    const tokenPayload = { sub: pessoaId } as any;
    const updatePessoaDto = { name: 'Jane Doe' };

    //Nao estava aceitando null, tive que mudar pra undefined
    jest.spyOn(pessoaRepository, 'preload').mockResolvedValue(undefined);

    await expect(
      pessoasService.update(pessoaId, updatePessoaDto, tokenPayload),
    ).rejects.toThrow(NotFoundException);
  });
});
