import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';

import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';

export class GlobalConfig {
  @IsDefined()
  public readonly application: AppConfig;

  @ValidateNested()
  @Type(() => DatabaseConfig)
  @IsDefined()
  public database: DatabaseConfig;
}
