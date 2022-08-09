import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { dataSource } from 'datasource';
import { DatabaseConfig } from 'src/configuration/contracts/database.config';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

export const config: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): TypeOrmModuleOptions => {
    const databaseConfig: DatabaseConfig =
      config.get<DatabaseConfig>('database');

    return {
      type: 'mysql',
      charset: 'utf8mb4_general_ci',
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.user,
      password: databaseConfig.password,
      database: databaseConfig.name,
      entities: [__dirname + '/src/modules/**/*.entity.js'], // path to dist folder
      migrations: [__dirname + '/src/database/migrations/*.ts'],
    };
  },
};
