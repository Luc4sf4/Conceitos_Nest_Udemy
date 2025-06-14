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
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';

jest.mock('fs/promises'); //mockando o modulo do fs
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
            findOne: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
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

    it('deve lançar um NotFoundException se usuário nao autorizado', async () => {
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

  describe('remove', () => {
    it('deve remover uma pessoa se autorizado', async () => {
      const pessoaId = 1;
      const tokenPayload = { sub: pessoaId } as any;
      const existingPessoa = { id: pessoaId, nome: 'John Doe' };

      jest
        .spyOn(pessoaRepository, 'findOneBy') // mocka certo
        .mockResolvedValue(existingPessoa as any);

      jest
        .spyOn(pessoaRepository, 'remove')
        .mockResolvedValue(existingPessoa as any);

      const result = await pessoasService.remove(pessoaId, tokenPayload);

      expect(pessoaRepository.findOneBy).toHaveBeenCalledWith({ id: pessoaId });
      expect(pessoaRepository.remove).toHaveBeenCalledWith(existingPessoa);
      expect(result).toEqual(existingPessoa);
    });

    it('deve lançar um ForbiddenException se usuário nao autorizado', async () => {
      // Arrange
      const pessoaId = 1; // ID da pessoa no banco
      const tokenPayload = { sub: 2 } as any; // ID do usuário autenticado (diferente da pessoa)

      const existingPessoa = { id: pessoaId, nome: 'John Doe' };

      // Corrigido: mock do método correto (findOneBy)
      jest
        .spyOn(pessoaRepository, 'findOneBy')
        .mockResolvedValue(existingPessoa as any);

      // Act + Assert
      await expect(
        pessoasService.remove(pessoaId, tokenPayload),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar um NotFoundException se pessoa nao encontrada', async () => {
      const pessoaId = 1;
      const tokenPayload = { sub: pessoaId } as any;

      jest.spyOn(pessoaRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        pessoasService.remove(pessoaId, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('uploadPicture', () => {
    it('deve salvar a imagem corretamente e atualizar a pessoa', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.png',
        size: 2000,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const mockPessoa = {
        id: 1,
        nome: 'lucas',
        email: 'lucas@email.com',
      } as Pessoa;

      const tokenPayload = { sub: 1 } as any;

      jest.spyOn(pessoasService, 'findOne').mockResolvedValue(mockPessoa);
      jest.spyOn(pessoaRepository, 'save').mockResolvedValue({
        ...mockPessoa,
        picture: '1.png',
      });
      const filePath = path.resolve(process.cwd(), 'pictures', '1.png');

      //Act
      const result = await pessoasService.uploadPicture(mockFile, tokenPayload);

      //Assert
      expect(fs.writeFile).toHaveBeenCalledWith(filePath, mockFile.buffer);
      expect(pessoaRepository.save).toHaveBeenCalledWith({
        ...mockPessoa,
        picture: '1.png',
      });
      expect(result).toEqual({
        ...mockPessoa,
        picture: '1.png',
      });
    });

    it('deve lançar um BadRequestException se o arquivo for muito pequeno', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.png',
        size: 500, // Menor que 1024 bytes
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const tokenPayload = { sub: 1 } as any;

      //Act & Assert

      await expect(
        pessoasService.uploadPicture(mockFile, tokenPayload),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar um NotFoundException se a pessoa nao for encontrada', async () => {
      //Arrange
      const mockFile = {
        originalname: 'test.png',
        size: 5000,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const tokenPayload = { sub: 1 } as any;

      jest
        .spyOn(pessoasService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      await expect(
        pessoasService.uploadPicture(mockFile, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
