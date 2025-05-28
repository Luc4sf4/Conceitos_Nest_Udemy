import { validate } from 'class-validator';
import { CreatePessoaDto } from './create-pessoa.dto';

describe('CreatePessoaDto', () => {
  it('deve validar um DTO valido', async () => {
    const dto = new CreatePessoaDto();
    dto.email = 'teste@example.com';
    dto.senha = 'senha123';
    dto.name = 'Lucas Dias';

    const errors = await validate(dto);
    expect(errors.length).toBe(0); //Se tiver 0 erros, o dto e valido
  });

  it('deve falhar se o email for invalido', async () => {
    const dto = new CreatePessoaDto();
    dto.email = 'email-invalido';
    dto.senha = 'senha123';
    dto.name = 'Lucas Dias';

    const errors = await validate(dto);

    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('email');
  });

  it('deve falhar se a senha for muito curta', async () => {
    const dto = new CreatePessoaDto();
    dto.email = 'teste@example.com';
    dto.senha = '123';
    dto.name = 'Lucas Dias';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('senha');
  });

  it('deve falhar se o nome for vazio', async () => {
    const dto = new CreatePessoaDto();
    dto.email = 'teste@example.com';
    dto.senha = '123';
    dto.name = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('deve falhar se o nome for vazio', async () => {
    const dto = new CreatePessoaDto();
    dto.email = 'teste@example.com';
    dto.senha = '123';
    dto.name = 'a'.repeat(101);

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });
});
