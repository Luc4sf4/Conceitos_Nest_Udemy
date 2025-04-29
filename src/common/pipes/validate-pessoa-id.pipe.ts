/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { PessoasService } from 'src/pessoas/pessoas.service';

@Injectable()
export class ValidatePessoaIdPipe implements PipeTransform {
  constructor(private readonly pessoaService: PessoasService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const { remetenteId, destinatarioId } = value;

    const remetente = await this.pessoaService.findOne(remetenteId);
    const destinatario = await this.pessoaService.findOne(destinatarioId);

    if (!remetente || !destinatario) {
      throw new BadRequestException(
        'Procure alguém que esteja no banco de dados',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  }
}
