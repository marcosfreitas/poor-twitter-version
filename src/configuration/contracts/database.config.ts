import { IsDefined, IsNumber } from 'class-validator';

export class DatabaseConfig {
  @IsDefined()
  public readonly driver: 'mysql' | 'mariadb' | 'postgres' | 'sqlite';

  @IsDefined()
  public readonly host: string;

  @IsDefined()
  @IsNumber()
  public readonly port: number;

  @IsDefined()
  public readonly name: string;

  @IsDefined()
  public readonly user: string;

  @IsDefined()
  public readonly password: string;
}
