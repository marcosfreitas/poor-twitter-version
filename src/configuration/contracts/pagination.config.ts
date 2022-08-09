import { IsDefined, IsNumber, IsPositive } from 'class-validator';

export class PaginationConfig {
  @IsDefined()
  @IsNumber()
  @IsPositive()
  public readonly pageSize: number;
}
