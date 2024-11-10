import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeOrmConfig(): TypeOrmModuleOptions {
  const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;
  return {
    type: 'postgres',
    port: DB_PORT,
    database: DB_NAME,
    host: DB_HOST,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    synchronize: true,
    autoLoadEntities: false,
    entities: [
      'dist/**/**/**/*.entity{.ts,.js}',
      'dist/**/**/*.entity{.ts,.js}',
    ],
  };
}
