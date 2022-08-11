import { AppConfig } from '@app/configuration/contracts/app.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DatabaseConfig } from 'src/configuration/contracts/database.config';

export const config: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): TypeOrmModuleOptions => {
    const appConfig = config.get<AppConfig>('application');
    const databaseConfig: DatabaseConfig =
      config.get<DatabaseConfig>('database');

    const basePath =
      __dirname + (appConfig.environment === 'test' ? '/dist' : '');

    return {
      type: 'mysql',
      charset: 'utf8mb4_general_ci',
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.user,
      password: databaseConfig.password,
      database: databaseConfig.name,
      autoLoadEntities: true,
      entities: [basePath + '/src/modules/**/*.entity.js'],
      migrations: [basePath + '/src/database/migrations/*.ts'],
    };
  },
};
