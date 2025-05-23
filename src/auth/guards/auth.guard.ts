/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Nao logado');
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      const pessoa = await this.pessoaRepository.findOneBy({
        id: payload.sub,
        active: true,
      });
      if (!pessoa) {
        throw new UnauthorizedException('Pessoa nao autorizada');
      }

      payload['pessoa'] = pessoa;

      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Falha ao logar');
    }
    return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers?.authorization;
    if (!authorization || typeof authorization !== 'string') {
      return undefined;
    }
    return authorization.split(' ')[1];
  }
}
