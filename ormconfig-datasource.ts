import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { DatabaseConfig } from 'src/configuration/contracts/database.config';

config();

// @bug configService isn't loading the environment variables
//const configService = new ConfigService();
//const databaseConfig: DatabaseConfig =
//  configService.get<DatabaseConfig>('database');

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.APP_NAME,
  migrations: [__dirname + '/src/migrations/*.ts'],
});
