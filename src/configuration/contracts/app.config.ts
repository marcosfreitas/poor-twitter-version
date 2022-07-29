import { IsDefined, IsEnum, IsSemVer } from 'class-validator';

import { Environment } from './env.config';

/**
 * Application config attributes
 */
export class AppConfig {
  @IsDefined()
  @IsEnum(Environment)
  public readonly environment: Environment;

  @IsDefined()
  @IsSemVer()
  public readonly version: string;

  @IsDefined()
  public readonly name: string;

  @IsDefined()
  public readonly listenPort: number;
}
