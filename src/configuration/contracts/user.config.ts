import { IsDefined, IsNumber, IsPositive } from 'class-validator';

/**
 * User config attributes
 */
export class UserConfig {
  @IsDefined()
  @IsNumber()
  @IsPositive()
  public readonly postDailyLimit: number;
}
