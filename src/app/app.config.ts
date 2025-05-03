import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  database: {
    type: process.env.DATABASE_TYPE as 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME,
    database: process.env.DATABASE_DATABASE,
    password: process.env.DATABASE_PASSWORD,
    autoLoadEntities: Boolean(process.env.DATABASE_AUTOLOADENTITIES), // carrega entidades sem precisar especifica-las
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), //sincroniza com o BD. nao deve ser usado em produção
  },
  environment: process.env.NODE_ENV || 'development',
}));
