import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async login(loginDto: LoginDto) {
    const pessoa = await this.pessoaRepository.findOneBy({
      email: loginDto.email,
    });

    if (!pessoa) {
      throw new UnauthorizedException('Pessoa nao existe.');
    }

    const passwordIsValid = await this.hashingService.compare(
      loginDto.password,
      pessoa.passwordHash,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Senha invalida.');
    }

    // Fazer o novo token e entregar para o usuario na resposta

    return {
      message: 'Usuário logado!',
    };
  }
}
