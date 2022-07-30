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
    const databaseConfig: DatabaseConfig =
      config.get<DatabaseConfig>('database');

    return {
      type: 'mysql',
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.user,
      password: databaseConfig.password,
      database: databaseConfig.name,
      autoLoadEntities: true,
      migrations: [__dirname + '/migrations/*.ts'],
    };
  },
};
