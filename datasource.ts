import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { SeederOptions } from 'typeorm-extension';

config();

// @bug configService isn't loading the environment variables
//const configService = new ConfigService();
//const databaseConfig: DatabaseConfig =
//  configService.get<DatabaseConfig>('database');

export const dataSource: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  charset: 'utf8mb4_general_ci',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.APP_NAME,
  entities: [__dirname + '/src/modules/**/*.entity.js'], // path to dist folder
  migrations: [__dirname + '/src/database/migrations/*.ts'],
  seeds: [__dirname + '/src/database/seeders/*.seeder.ts'],
  factories: [__dirname + '/src/database/factories/*.factory.ts'],
};

export default new DataSource(dataSource);
